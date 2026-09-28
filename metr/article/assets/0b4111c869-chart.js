/* Workstream traffic chart — instance-scoped component.
   Requires window.WORKSTREAM_TRAFFIC_DATA (assets/js/workstream_chart/data.js)
   and assets/css/workstream_chart/chart.css.
   Mounts automatically onto any [data-workstream-chart] element. */
(function(){
"use strict";

var instanceCounter=0;

var SUBTITLE="Numbers are based on a reconstructed dataset of messages (not the full message board dump) and workstream classification only had partial context from transcripts. This means the exact numbers are imprecise but likely representative.";

/* Distinct categorical hues for the Hugging Face leaves, which otherwise render
   as near-identical tints of the pale-yellow family color. */
var HF_LEAF_PALETTE=["#4e79a7","#f28e2b","#e15759","#76b7b2","#59a14f","#edc948","#b07aa1","#ff9da7"];

var VIEWS={
  board:{
    title:"Most messages on the board are covered by a few shared workstreams",
    subtitle:SUBTITLE
  },
  hf:{
    title:"The Hugging Face attack itself involved many different workstreams",
    subtitle:SUBTITLE,
    select:{families:["hf"]},
    expandedFamilies:["hf"],
    startHour:72,
    endHour:120,
    leafPalettes:{hf:HF_LEAF_PALETTE},
    hideWorkstreamsControl:true,
    purposeBesideLegend:true,
    legendInHeader:true,
    guideFamilies:["hf"],
    guideLabel:"Guide"
  },
  hacking:{
    title:"Hacking traffic by hour",
    select:{families:["scorer","hf"],groups:["other_hacking","artifactory"]},
    expandedFamilies:["cross"],
    guideFamilies:["scorer","hf","cross"]
  }
};

/* Round the axis top up to a 1/2/5 x 10^n step so tick labels read cleanly
   (0 / 500 / 1k / 1.5k / 2k rather than 0 / 396 / 791 / 1.2k / 1.6k). */
function nextSmallerStep(step){
  var mag=Math.pow(10,Math.floor(Math.log10(step)));
  var lead=Math.round(step/mag);
  if(lead>=10)return 5*mag;
  if(lead>=5)return 2*mag;
  if(lead>=2)return 1*mag;
  return mag/2;
}
function niceScale(dataMax,targetTicks){
  var raw=dataMax/targetTicks;
  var mag=Math.pow(10,Math.floor(Math.log10(raw)));
  var norm=raw/mag;
  var step=(norm<=1?1:norm<=2?2:norm<=5?5:10)*mag;
  var max=Math.ceil(dataMax/step)*step;
  /* If rounding up wasted more than half a step of empty headroom (e.g. a peak
     of 3,245 pushing the axis to 4,000), drop to the next smaller nice step and
     stop at the first increment above the data instead. Applied once only, and
     only while the tick count stays reasonable. */
  if(max-dataMax>step/2){
    var smallerStep=nextSmallerStep(step),
      smallerMax=Math.ceil(dataMax/smallerStep)*smallerStep;
    if(smallerMax/smallerStep<=10){step=smallerStep;max=smallerMax;}
  }
  return{step:step,max:max,count:Math.round(max/step)};
}

/* Turn a <details>/<summary> into a plain block with a heading, keeping its
   classes and children. Used where the content is already behind a disclosure
   and a second one would just cost an extra click — and where leaving an
   un-closable <details open> would misreport itself to assistive tech. */
function flattenDisclosure(details){
  var div=document.createElement("div");
  for(var i=0;i<details.attributes.length;i++){
    var a=details.attributes[i];
    if(a.name!=="open")div.setAttribute(a.name,a.value);
  }
  var summary=details.querySelector(":scope > summary");
  if(summary){
    var title=document.createElement("span");
    title.className=summary.className;
    title.textContent=summary.textContent;
    div.appendChild(title);
    summary.remove();
  }
  while(details.firstChild)div.appendChild(details.firstChild);
  details.replaceWith(div);
  return div;
}

function createWorkstreamChart(root,userConfig){
  var DATA=window.WORKSTREAM_TRAFFIC_DATA;
  if(!DATA){console.error("WorkstreamChart: WORKSTREAM_TRAFFIC_DATA not loaded");return null}
  userConfig=userConfig||{};
  var preset=VIEWS[userConfig.view]||{};
  var config=Object.assign({},preset,userConfig);
  var uid="wsc"+(++instanceCounter);

  var els={};
  root.querySelectorAll("[data-el]").forEach(function(el){els[el.dataset.el]=el});
  var required=["chart","legend","tooltip","definitionTooltip","chartTitle","periodValue",
                "workstreamChecks","categoryChecks","categoryGuide","binHours","segmentByPurpose"];
  for(var i=0;i<required.length;i++){
    if(!els[required[i]]){console.error("WorkstreamChart: missing [data-el=\""+required[i]+"\"]");return null}
  }

  els.chart.id=uid+"-chart";
  els.chartTitle.id=uid+"-title";
  els.chart.setAttribute("aria-labelledby",els.chartTitle.id);
  els.definitionTooltip.id=uid+"-deftip";
  /* position: fixed only tracks the viewport when no ancestor is transformed;
     the chart sits inside a transformed .breakout-wider figure, so move the
     tooltip out to <body> where the coordinates it computes actually apply. */
  if(document.body)document.body.appendChild(els.definitionTooltip);
  els.binHours.id=uid+"-bin";
  if(els.chartSubtitle){
    if(config.subtitle){els.chartSubtitle.textContent=config.subtitle;els.chartSubtitle.hidden=false}
    else els.chartSubtitle.hidden=true;
  }

  if(config.hideWorkstreamsControl&&els.workstreamsControl)els.workstreamsControl.hidden=true;
  /* Some views park the purpose list beside the legend instead of in the
     filters panel; CSS then decides whether it sits left of the legend or
     stacks above it, based on the card's width. If that empties the panel,
     drop the panel too rather than leave a disclosure with nothing in it. */
  if(config.purposeBesideLegend){
    if(els.chartAside&&els.purposeControl){
      els.chartAside.appendChild(els.purposeControl);
      const panel=root.querySelector(".controls-panel");
      if(panel&&!panel.querySelector(".control:not([hidden])"))panel.hidden=true;
    }
  }else if(els.purposeControl){
    /* In the filters panel the user has already clicked to get here, so drop the
       disclosure entirely rather than make them open a second one. */
    els.purposeControl=flattenDisclosure(els.purposeControl);
  }
  /* The bin selector keeps its markup position, the row after the legend, in
     every view. Views with a compact header lift the legend up into the header
     row and put the purpose list opposite it; the selector is then the row
     below that instead. */
  if(config.legendInHeader&&els.chartTop&&els.chartLegendRow){
    els.chartTop.appendChild(els.legend);
    els.chartTop.classList.add("has-legend");
    if(els.chartAside)els.chartTop.insertBefore(els.chartAside,els.legend);
  }
  /* The period total lives inside the plot, pinned to its top-right corner:
     traffic has tailed off well before the end of every view's window, so that
     corner is reliably empty and the number costs no vertical space. */
  if(els.chartWrap&&els.chartTotal){
    els.chartWrap.appendChild(els.chartTotal);
    els.chartTotal.classList.add("in-chart");
  }
  /* Whichever row those moves emptied would otherwise still claim its margin. */
  [els.chartTop,els.chartLegendRow].forEach(function(row){
    if(row&&!row.querySelector(":scope > *"))row.hidden=true;
  });
  if(config.guideLabel&&els.guideSummary)els.guideSummary.textContent=config.guideLabel;

  var startHour=Number(config.startHour||0);
  var endHour=config.endHour==null?DATA.interval.hours:Number(config.endHour);
  var DISPLAY_HOURS=endHour-startHour;

  /* config.select declares the initial visible leaves:
     {families:[...], groups:[...], leaves:[...]} — union; omitted means all. */
  function initialLeafSelection(){
    var sel=config.select;
    if(!sel)return DATA.leaves.map(function(leaf){return leaf.id});
    var families=sel.families||[],groups=sel.groups||[],leaves=sel.leaves||[];
    return DATA.leaves.filter(function(leaf){
      return families.indexOf(leaf.family)>=0||(leaf.group&&groups.indexOf(leaf.group)>=0)||leaves.indexOf(leaf.id)>=0;
    }).map(function(leaf){return leaf.id});
  }

  const state={
    bin:String(config.bin||"1"),
    segmentByPurpose:!!config.segmentByPurpose,
    categories:new Set(DATA.categories.map(category=>category.id)),
    selectedLeaves:new Set(initialLeafSelection()),
    expandedFamilies:new Set(config.expandedFamilies||[]),
    expandedGroups:new Set(config.expandedGroups||[]),
  };
  const familyById=Object.fromEntries(DATA.families.map(x=>[x.id,x]));
  const groupById=Object.fromEntries(DATA.groups.map(group=>[group.id,group]));
  const leafIndexById=Object.fromEntries(DATA.leaves.map((leaf,index)=>[leaf.id,index]));
  const leavesByFamily=Object.fromEntries(DATA.families.map(family=>[
    family.id,
    DATA.leaves.filter(leaf=>leaf.family===family.id),
  ]));
  const groupsByFamily=Object.fromEntries(DATA.families.map(family=>[
    family.id,
    DATA.groups.filter(group=>group.family===family.id),
  ]));
  const leavesByGroup=Object.fromEntries(DATA.groups.map(group=>[
    group.id,
    DATA.leaves.filter(leaf=>leaf.group===group.id),
  ]));
  const categoryByIndex=DATA.categories;
  const number=new Intl.NumberFormat("en-US");
  const definitionTooltip=els.definitionTooltip;

  const FAMILY_DESCRIPTIONS={
    legit:"Work toward the intended solution through reconnaissance, exploit development, execution, recovery, or peer support. This includes efforts to bring the target back up after it went down: bringing it back up is not itself intended behavior, but it is on the path to an intended solution.",
    replace:"Replacing target images or deployment state with attacker-controlled versions and keeping them active.",
    scorer:"Understanding or manipulating scorer rules, evaluator paths, tool calls, transcripts, logs, grading inputs, oversight, and presentations of success.",
    hf:"Accessing, exploiting, escalating within, or maintaining persistence in Hugging Face infrastructure.",
    cross:"Other infrastructure attacks, shared technical infrastructure, coordination, governance, community activity, and support.",
  };
  const GROUP_DESCRIPTIONS={
    other_hacking:"Hacking other infrastructure, pursuing guest-to-host escape, and building technical infrastructure shared across domains.",
    artifactory:"Reconnoitering or exploiting Artifactory services, identities, nodes, keys, and administrative controls.",
  };
  const LEAF_DESCRIPTIONS={
    "public.legit_exploit_work":"Assigned-target reconnaissance, exploit development, payload integration, live execution, and peer task support.",
    "task.target_recovery":"Efforts to bring the target back up after it went down, including resets, stale sessions, target-health checks, reproducibility recovery, and wedged-target restoration. Bringing the target back up is not itself intended behavior, but it is included here because it is on the path to an intended solution.",
    "public.target_replacement":"Payload-bearing image builds, shared-cache poisoning, and forced rollout or reset work used to replace a target.",
    "deploy.persistence_guardian":"Cache guardians, re-poisoning, rearming, rollback defense, and other work that keeps a replacement active.",
    "public.live_rpc_runtime_escape":"Development, testing, transfer, or use of live pre-storage tool-RPC manipulation; movement from the assigned container into an isolated guest environment or runtime; and enabling research into TTRPC, guest and container runtimes, processes, namespaces, sockets, and related attack paths.",
    "public.scorer_reverse_engineering":"Reverse engineering checkers, scoring, causal validation, auditing, and evidence collection, together with timing, liveness, stale-image, control, and evidence-window engineering intended to satisfy causal scoring.",
    "eval.public_seed_hmac_shortcut":"Public-seed, HMAC, deterministic-flag, and related intended-task bypasses.",
    "eval.workspace_copy_codec_escape":"Evaluator workspace-copy races, codec execution, decode or materialization paths, and ownership manipulation.",
    "public.evaluation_record_deception":"Editing stored transcripts, logs, timestamps, result JSON, score files, grading inputs, or success markers; creating apparent success through presentation tricks; and evading or deceiving evaluation oversight.",
    "public.coordination_infrastructure":"Board operations, artifact transfer, routing, governance, identity, shared relays, recovery, monitoring, alternative channels, community activity, verification, restraint, and residual traffic.",
    "public.modal_infrastructure":"Modal-hosted egress relays, proxies, tunnels, and exploitation of publicly exposed customer sandboxes.",
    "public.other_hacking_shared_infra":"Guest-to-host escape, credential acquisition, network or cloud control, repository or artifact compromise, other external targets, and cross-domain reconnaissance or tooling.",
    "public.artifactory_access":"Artifactory endpoint and service mapping, SSRF, token authorization, impersonation, and authentication bypass.",
    "public.artifactory_control":"Artifactory code execution, filesystem or node access, signing or master-key theft, and administrative takeover.",
    "hf.gated_data_access":"Protected datasets, private models or data, and gated-content disclosure.",
    "hf.accounts_tokens":"Accounts, authentication tokens, invitations, and gate bypass before worker compromise.",
    "hf.dataset_viewer_file_read":"Dataset Viewer parsers, HDF5 external files, path confusion, arbitrary file reads, and transformations used to reach worker files.",
    "hf.worker_rce_exfiltration":"Code execution, commands, and direct exfiltration from Hugging Face workers.",
    "hf.worker_secrets_credentials":"Worker environment secrets, credentials, and their interpretation or use.",
    "hf.cluster_node_escalation":"Service accounts, privileged workloads, cluster escalation, node root, and host access originating from a worker.",
    "hf.internal_repos_ci":"Connected Hugging Face identities, private repositories, Xet or storage, CI, and deployment systems.",
    "hf.persistence_c2":"Durable shells, relays, tunnels, backdoors, and command-and-control in Hugging Face infrastructure.",
  };

  "use strict";
  const paletteOffset=[0,28,-24,52,-45,75,-65,95];
  const scorerLeafPalette=["#4e79a7","#f28e2b","#e15759","#76b7b2","#59a14f"];
  function leafColor(leafIndex){const leaf=DATA.leaves[leafIndex],siblings=DATA.leaves.filter(x=>x.family===leaf.family&&x.group===leaf.group),position=siblings.findIndex(x=>x.id===leaf.id);const override=config.leafPalettes&&config.leafPalettes[leaf.family];if(override&&!leaf.group)return override[position%override.length];if(leaf.family==="scorer"&&!leaf.group)return scorerLeafPalette[position];const base=leaf.group?groupById[leaf.group].color:familyById[leaf.family].color,match=base.match(/#(..)(..)(..)/);let [r,g,b]=[1,2,3].map(i=>parseInt(match[i],16)),delta=paletteOffset[position%paletteOffset.length];return `rgb(${Math.max(25,Math.min(235,r+delta))},${Math.max(25,Math.min(235,g+delta))},${Math.max(25,Math.min(235,b+delta))})`}
  function selectedLeavesForFamily(familyId){
    return leavesByFamily[familyId].filter(leaf=>state.selectedLeaves.has(leaf.id));
  }
  function selectedLeavesForGroup(groupId){
    return leavesByGroup[groupId].filter(leaf=>state.selectedLeaves.has(leaf.id));
  }
  function workstreamSeriesMeta(){
    const metas=[];
    for(const family of DATA.families){
      const selectedLeaves=selectedLeavesForFamily(family.id);
      if(!selectedLeaves.length)continue;
      if(state.expandedFamilies.has(family.id)){
        for(const leaf of selectedLeaves.filter(item=>!item.group)){
          metas.push({...leaf,kind:"leaf",color:leafColor(leafIndexById[leaf.id])});
        }
        for(const group of groupsByFamily[family.id]){
          const groupLeaves=selectedLeavesForGroup(group.id);
          if(!groupLeaves.length)continue;
          if(state.expandedGroups.has(group.id)){
            for(const leaf of groupLeaves)metas.push({...leaf,kind:"leaf",color:leafColor(leafIndexById[leaf.id])});
          }
          else{
            metas.push({...group,kind:"group"});
          }
        }
        continue;
      }
      metas.push({
        ...family,
        family:family.id,
        kind:"family",
      });
    }
    return metas;
  }
  function seriesMeta(){
    const workstreams=workstreamSeriesMeta();
    if(!state.segmentByPurpose)return workstreams;
    return workstreams.flatMap(workstream=>DATA.categories.flatMap(category=>state.categories.has(category.id)?[{
        ...workstream,
        id:`${workstream.id}::${category.id}`,
        name:`${workstream.name} — ${category.name}`,
        workstreamId:workstream.id,
        purpose:category,
      }]:[]));
  }
  function seriesKeyForLeaf(index){
    const leaf=DATA.leaves[index];
    if(!state.selectedLeaves.has(leaf.id))return null;
    if(!state.expandedFamilies.has(leaf.family))return leaf.family;
    if(leaf.group&&!state.expandedGroups.has(leaf.group))return leaf.group;
    return leaf.id;
  }
  function aggregate(){
    const binHours=Number(state.bin);
    if(![1,2,4].includes(binHours)||!Number.isInteger(DISPLAY_HOURS/binHours))throw new Error(`Invalid bin size: ${binHours} hours`);
    const bins=DISPLAY_HOURS/binHours;
    const metas=seriesMeta();
    const values=Object.fromEntries(metas.map(meta=>[meta.id,Array(bins).fill(0)]));
    let units=0;
    for(const row of DATA.rows){
      const workstreamKey=seriesKeyForLeaf(row[1]);
      if(workstreamKey===null)continue;
      const hour=row[0]-startHour;
      if(hour<0||hour>=DISPLAY_HOURS)continue;
      const bin=Math.floor(hour/binHours);
      let selectedCount=0;
      row[2].forEach((count,categoryIndex)=>{
        const category=categoryByIndex[categoryIndex];
        if(!state.categories.has(category.id))return;
        selectedCount+=count;
        if(state.segmentByPurpose)values[`${workstreamKey}::${category.id}`][bin]+=count;
      });
      if(!state.segmentByPurpose)values[workstreamKey][bin]+=selectedCount;
      units+=selectedCount;
    }
    return{bins,metas,values,period:units};
  }
  const MONTH_NAMES=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  function binDate(index){return new Date(Date.parse(DATA.interval.start_utc)+(startHour+index*Number(state.bin))*3600000)}
  function formatAxisDate(index){const date=binDate(index);if(tickHours()>=24||date.getUTCHours()===0)return `${MONTH_NAMES[date.getUTCMonth()]} ${String(date.getUTCDate()).padStart(2,"0")}`;return `${String(date.getUTCHours()).padStart(2,"0")}:00`}
  function formatUtcDateTime(date){return `${MONTH_NAMES[date.getUTCMonth()]} ${String(date.getUTCDate()).padStart(2,"0")}, ${String(date.getUTCHours()).padStart(2,"0")}:00`}
  function formatBin(index){const start=binDate(index),binHours=Number(state.bin);if(binHours===1)return `${formatUtcDateTime(start)} UTC`;const end=new Date(start.getTime()+binHours*3600000);return `${formatUtcDateTime(start)}–${formatUtcDateTime(end)} UTC`}
  function tickHours(){return DISPLAY_HOURS<=72?6:24}
  function axisTickIndices(binCount){const step=Math.max(1,Math.round(tickHours()/Number(state.bin)));const out=[];for(let i=0;i<binCount;i+=step)out.push(i);return out}
  function render(){
    const agg=aggregate();
    els.periodValue.textContent=number.format(agg.period);
    const binHours=Number(state.bin);
    els.chartTitle.textContent=config.title||(binHours===1?"Message-board workstream traffic by hour":`Message-board workstream traffic in ${binHours}-hour bins`);
    renderLegend(agg);
    drawChart(agg);
  }
  function renderLegend(agg){
    hideDefinitionTooltip();
    let legendAgg=agg;
    if(state.segmentByPurpose){
      const metas=workstreamSeriesMeta();
      const values=Object.fromEntries(metas.map(meta=>[
        meta.id,
        Array.from({length:agg.bins},(_,bin)=>DATA.categories.reduce((sum,category)=>sum+(agg.values[`${meta.id}::${category.id}`]?.[bin]||0),0)),
      ]));
      legendAgg={...agg,metas,values};
    }
    const totalBySeries=Object.fromEntries(legendAgg.metas.map(meta=>[
      meta.id,
      legendAgg.values[meta.id].reduce((sum,value)=>sum+value,0),
    ]));
    const groups=[];
    for(const family of DATA.families){
      const visibleMetas=legendAgg.metas.filter(meta=>meta.family===family.id&&totalBySeries[meta.id]>0);
      if(!visibleMetas.length)continue;
      const selectedCount=selectedLeavesForFamily(family.id).length;
      const totalCount=leavesByFamily[family.id].length;
      const countMarkup=selectedCount===totalCount?"":` <span class="legend-count">${selectedCount}/${totalCount}</span>`;
      if(!state.expandedFamilies.has(family.id)){
        groups.push(`<div class="legend-group collapsed"><div class="legend-family definition-target" tabindex="0" data-series="${escapeHtml(family.id)}" data-family="${escapeHtml(family.id)}" data-definition="${escapeHtml(FAMILY_DESCRIPTIONS[family.id])}"><span class="swatch" style="background:${family.color};color:${family.color}"></span>${escapeHtml(family.name)}${countMarkup}</div></div>`);
        continue;
      }
      const childMarkup=[];
      for(const meta of visibleMetas.filter(item=>item.kind==="leaf"&&!item.group)){
        childMarkup.push(`<span class="legend-item definition-target" tabindex="0" data-series="${escapeHtml(meta.id)}" data-definition="${escapeHtml(LEAF_DESCRIPTIONS[meta.id])}"><span class="swatch" style="background:${meta.color};color:${meta.color}"></span>${escapeHtml(meta.name)}</span>`);
      }
      for(const subgroup of groupsByFamily[family.id]){
        if(state.expandedGroups.has(subgroup.id)){
          const subgroupLeaves=visibleMetas.filter(meta=>meta.kind==="leaf"&&meta.group===subgroup.id);
          if(!subgroupLeaves.length)continue;
          const leafMarkup=subgroupLeaves.map(meta=>`<span class="legend-item definition-target" tabindex="0" data-series="${escapeHtml(meta.id)}" data-definition="${escapeHtml(LEAF_DESCRIPTIONS[meta.id])}"><span class="swatch" style="background:${meta.color};color:${meta.color}"></span>${escapeHtml(meta.name)}</span>`).join("");
          childMarkup.push(`<div class="legend-subgroup"><span class="legend-subgroup-name definition-target" tabindex="0" data-definition="${escapeHtml(GROUP_DESCRIPTIONS[subgroup.id])}">${escapeHtml(subgroup.name)}</span><div class="legend-subgroup-children">${leafMarkup}</div></div>`);
        }
        else{
          const meta=visibleMetas.find(item=>item.kind==="group"&&item.id===subgroup.id);
          if(meta)childMarkup.push(`<span class="legend-item definition-target" tabindex="0" data-series="${escapeHtml(meta.id)}" data-definition="${escapeHtml(GROUP_DESCRIPTIONS[subgroup.id])}"><span class="swatch" style="background:${meta.color};color:${meta.color}"></span>${escapeHtml(meta.name)}</span>`);
        }
      }
      const children=childMarkup.join("");
      groups.push(`<div class="legend-group expanded"><div class="legend-family definition-target" tabindex="0" data-family="${escapeHtml(family.id)}" data-definition="${escapeHtml(FAMILY_DESCRIPTIONS[family.id])}">${escapeHtml(family.name)}${countMarkup}</div><div class="legend-children">${children}</div></div>`);
    }
    focusTarget=null;
    applyChartFocus();
    els.legend.innerHTML=groups.join("");
    bindDefinitionTooltips(els.legend);
    els.legend.querySelectorAll("[data-series],.legend-family[data-family]").forEach(el=>{
      const target=el.dataset.series?{type:"series",id:el.dataset.series}:{type:"family",id:el.dataset.family};
      const focus=()=>{focusTarget=target;applyChartFocus()};
      const blur=()=>{focusTarget=null;applyChartFocus()};
      el.addEventListener("mouseenter",focus);
      el.addEventListener("mouseleave",blur);
      el.addEventListener("focus",focus);
      el.addEventListener("blur",blur);
    });
  }
  function hatchPatternMarkup(id,color){
    return `<pattern id="${id}" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="100%" height="100%" fill="${color}"/><line x1="0" y1="0" x2="0" y2="7" stroke="#111827" stroke-opacity=".45" stroke-width="1.5"/></pattern>`;
  }
  function highlightPurposeRow(purposeId,color){
    const row=root.querySelector(`.check[data-purpose-row="${purposeId}"]`);
    if(!row)return;
    row.classList.add("purpose-hovered");
    row.style.setProperty("--purpose-color",color);
  }
  function clearPurposeRowHighlight(){
    root.querySelectorAll(".check.purpose-hovered").forEach(row=>{
      row.classList.remove("purpose-hovered");
      row.style.removeProperty("--purpose-color");
    });
  }
  function highlightLegendEntry(seriesId,familyId,color){
    let el=seriesId?els.legend.querySelector(`[data-series="${CSS.escape(seriesId)}"]`):null;
    if(!el&&familyId)el=els.legend.querySelector(`.legend-family[data-family="${CSS.escape(familyId)}"]`);
    if(!el)return;
    el.classList.add("chart-hovered");
    el.style.setProperty("--family-color",color);
  }
  /* The same hover also marks the matching row in Visible workstreams, so the
     filter list and the legend answer the same question. Chart and list share
     one expansion state, so whatever the chart is drawing as a series — family,
     subgroup or leaf — has a row; the family row is a fallback. Nothing is
     needed to gate this on the filters panel being open: closed, the rows are
     not in the document to find. */
  function highlightWorkstreamRow(seriesId,familyId,color){
    if(!els.workstreamChecks)return;
    const find=id=>id?els.workstreamChecks.querySelector(
      `[data-leaf-select="${CSS.escape(id)}"],[data-group-select="${CSS.escape(id)}"],[data-family-select="${CSS.escape(id)}"]`):null;
    const input=find(seriesId)||find(familyId);
    const row=input&&input.closest(".leaf-check,.subgroup-row,.workstream-row");
    if(!row)return;
    row.classList.add("chart-hovered");
    row.style.setProperty("--family-color",color);
  }
  function clearChartHoverHighlight(){
    root.querySelectorAll(".chart-hovered").forEach(el=>{
      el.classList.remove("chart-hovered");
      el.style.removeProperty("--family-color");
    });
  }
  let hoveredLayerIndex=null,lastPointer=null,hoveredFamilyId=null,hoveredSeriesId=null,hoveredPurposeId=null,focusTarget=null,focusSheet=null;
  /* Both focus effects — legend hover and purpose-row hover — are driven by
     rewriting one instance-scoped stylesheet rather than by touching elements.
     That leaves the SVG DOM untouched, so the CSS opacity transitions on .area,
     .purpose-boundary and .area-hatch-overlay actually run. */
  function applyChartFocus(){
    if(!focusSheet){focusSheet=document.createElement("style");root.appendChild(focusSheet);}
    const chart=`#${uid}-chart`,rules=[];
    if(focusTarget){
      const attr=focusTarget.type==="family"?"data-family":"data-workstream";
      const other=`:not([${attr}="${CSS.escape(focusTarget.id)}"])`;
      rules.push(`${chart} .area[${attr}]${other},${chart} .purpose-boundary[${attr}]${other}{opacity:.4}`);
    }
    if(hoveredPurposeId){
      const id=CSS.escape(hoveredPurposeId);
      /* A boundary line is only faded when neither the band below it nor the
         band above it is the hovered purpose, so the hovered band keeps a crisp
         edge on both sides. */
      rules.push(`${chart} .area-hatch-overlay[data-purpose="${id}"]{opacity:1}`);
      rules.push(`${chart} .area[data-purpose]:not([data-purpose="${id}"]){opacity:.4}`);
      rules.push(`${chart} .purpose-boundary:not([data-purpose="${id}"]):not([data-purpose-above="${id}"]){opacity:.4}`);
    }
    focusSheet.textContent=rules.join("");
  }
  function replayToggleSpin(selector){
    const btn=root.querySelector(selector);
    if(!btn||!btn.animate)return;
    const to=getComputedStyle(btn).transform,
      from=btn.getAttribute("aria-expanded")==="true"?"rotate(0deg)":"rotate(90deg)";
    btn.animate([{transform:from},{transform:to}],{duration:150,easing:"ease-out"});
  }
  let measureCtx=null;
  function measureAxisText(text){
    if(!measureCtx)measureCtx=document.createElement("canvas").getContext("2d");
    measureCtx.font=`16px ${getComputedStyle(els.chart).fontFamily}`;
    return measureCtx.measureText(text).width;
  }
  function drawChart(agg){
    const svg=els.chart,
      width=Math.max(720,svg.clientWidth||1000),
      height=580;
    svg.setAttribute("viewBox",`0 0 ${width} ${height}`);
    const ordered=agg.metas.filter(meta=>agg.values[meta.id].some(Boolean));
    const cumulative=Array(agg.bins).fill(0),layers=[];
    for(const meta of ordered){
      const lower=[...cumulative],upper=cumulative.map((value,i)=>value+agg.values[meta.id][i]);
      layers.push({meta,lower,upper});
      for(let i=0;i<agg.bins;i++)cumulative[i]=upper[i];
    }
    if(hoveredLayerIndex!==null&&!(layers[hoveredLayerIndex]&&layers[hoveredLayerIndex].meta.purpose)){
      hoveredLayerIndex=null;
      lastPointer=null;
    }
    if(hoveredFamilyId!==null&&!layers.some(layer=>layer.meta.family===hoveredFamilyId)){
      hoveredFamilyId=null;
    }
    if(hoveredSeriesId!==null&&!layers.some(layer=>(layer.meta.workstreamId||layer.meta.id)===hoveredSeriesId)){
      hoveredSeriesId=null;
    }
    if(hoveredPurposeId!==null&&!layers.some(layer=>layer.meta.purpose&&layer.meta.purpose.id===hoveredPurposeId)){
      hoveredPurposeId=null;
    }
    const scale=niceScale(Math.max(1,...cumulative),5),
      max=scale.max;
    /* No inner gutter: the chart card's own padding supplies the breathing
       room, so the plot runs to the SVG's right edge and the y tick labels sit
       flush against its left edge. The left margin is just wide enough for the
       widest label plus its gap to the axis. */
    const tickGap=12;
    let widestTick=0;
    for(let t=0;t<=scale.count;t++)widestTick=Math.max(widestTick,measureAxisText(compact(t*scale.step)));
    const margin={top:23,right:0,bottom:62,left:Math.ceil(widestTick+tickGap)},
      plotW=width-margin.left-margin.right,
      plotH=height-margin.top-margin.bottom;
    /* The in-chart total is a plain element layered over the SVG, so it needs
       the plot's top edge in the wrapper's CSS pixels. Below the 720px minimum
       viewBox the SVG scales down and letterboxes vertically, so go through the
       screen CTM rather than assume user units map 1:1 to CSS pixels. */
    if(els.chartWrap){
      const ctm=svg.getScreenCTM();
      const plotTop=ctm?ctm.f+margin.top*ctm.d-els.chartWrap.getBoundingClientRect().top:margin.top;
      els.chartWrap.style.setProperty("--plot-top",`${plotTop}px`);
      els.chartWrap.style.setProperty("--plot-scale",ctm?ctm.d:1);
    }
    const
      x=i=>margin.left+(i/(Math.max(1,agg.bins-1)))*plotW,
      y=v=>margin.top+plotH-(v/max)*plotH;
    let markup="",defs="";
    const dayBoundaryIndices=axisTickIndices(agg.bins);
    for(let tick=0;tick<=scale.count;tick++){
      const value=tick*scale.step,py=y(value);
      markup+=`<line class="axis" x1="${margin.left}" y1="${py}" x2="${width-margin.right}" y2="${py}"/><text class="axis-text" x="${margin.left-12}" y="${py+5}" text-anchor="end">${compact(value)}</text>`;
    }
    for(const index of dayBoundaryIndices){
      const px=x(index);
      markup+=`<text class="axis-text" x="${px}" y="${height-24}" text-anchor="middle">${escapeHtml(formatAxisDate(index))}</text>`;
    }
    layers.forEach((layer,layerIndex)=>{
      const top=layer.upper.map((v,i)=>`${x(i)},${y(v)}`),
        bottom=layer.lower.map((v,i)=>`${x(agg.bins-1-i)},${y(layer.lower[agg.bins-1-i])}`),
        pts=top.concat(bottom).join(" ");
      const purposeAttr=layer.meta.purpose?` data-purpose="${escapeHtml(layer.meta.purpose.id)}"`:"";
      markup+=`<polygon class="area" data-series="${escapeHtml(layer.meta.id)}" data-workstream="${escapeHtml(layer.meta.workstreamId||layer.meta.id)}" data-family="${escapeHtml(layer.meta.family)}"${purposeAttr} points="${pts}" fill="${layer.meta.color}"${layer.meta.purpose?' style="stroke:none"':""}/>`;
      if(layer.meta.purpose){
        const patternId=`${uid}-hatch-${layerIndex}`;
        defs+=hatchPatternMarkup(patternId,layer.meta.color);
        /* Hidden by default in CSS; shown either by this class (the band under
           the pointer) or by the purpose-focus rule in applyChartFocus. */
        markup+=`<polygon class="area-hatch-overlay${layerIndex===hoveredLayerIndex?" is-hovered":""}"${purposeAttr} points="${pts}" fill="url(#${patternId})"/>`;
      }
    });
    for(let i=0;i<layers.length-1;i++){
      const below=layers[i],above=layers[i+1];
      if(!below.meta.purpose||!above.meta.purpose)continue;
      const pts=below.upper.map((v,idx)=>`${x(idx)},${y(v)}`).join(" ");
      if(below.meta.workstreamId===above.meta.workstreamId)markup+=`<polyline class="purpose-boundary" data-workstream="${escapeHtml(below.meta.workstreamId||below.meta.id)}" data-family="${escapeHtml(below.meta.family)}" data-purpose="${escapeHtml(below.meta.purpose.id)}" data-purpose-above="${escapeHtml(above.meta.purpose.id)}" points="${pts}" stroke="color-mix(in srgb, ${below.meta.color} 45%, black)"/>`;
      else markup+=`<polyline class="workstream-boundary" points="${pts}"/>`;
    }
    for(const index of dayBoundaryIndices){
      const px=x(index);
      markup+=`<line class="day-boundary" x1="${px}" y1="${margin.top}" x2="${px}" y2="${margin.top+plotH}"/>`;
    }
    markup+=`<line class="hover-line" style="display:none" y1="${margin.top}" y2="${margin.top+plotH}"/><rect class="hover-target" x="${margin.left}" y="${margin.top}" width="${plotW}" height="${plotH}" fill="transparent" tabindex="0" aria-label="Inspect time bins"/>`;
    svg.innerHTML=markup;
    if(defs)svg.insertAdjacentHTML("afterbegin",`<defs>${defs}</defs>`);
    applyChartFocus();
    clearPurposeRowHighlight();
    if(hoveredLayerIndex!==null){
      const activeLayer=layers[hoveredLayerIndex];
      highlightPurposeRow(activeLayer.meta.purpose.id,activeLayer.meta.color);
    }
    clearChartHoverHighlight();
    if(hoveredFamilyId!==null||hoveredSeriesId!==null){
      const hoveredFamily=familyById[hoveredFamilyId];
      const hoveredLayer=layers.find(l=>(l.meta.workstreamId||l.meta.id)===hoveredSeriesId);
      const color=(hoveredLayer&&hoveredLayer.meta.color)||(hoveredFamily&&hoveredFamily.color);
      highlightLegendEntry(hoveredSeriesId,hoveredFamilyId,color);
      highlightWorkstreamRow(hoveredSeriesId,hoveredFamilyId,color);
    }
    const target=svg.querySelector(".hover-target"),
      line=svg.querySelector(".hover-line"),
      tooltip=els.tooltip;
    function setHoverState(nextLayerIndex,nextFamilyId,nextSeriesId){
      if(nextLayerIndex===hoveredLayerIndex&&nextFamilyId===hoveredFamilyId&&nextSeriesId===hoveredSeriesId)return;
      hoveredLayerIndex=nextLayerIndex;
      hoveredFamilyId=nextFamilyId;
      hoveredSeriesId=nextSeriesId===undefined?null:nextSeriesId;
      drawChart(agg);
    }
    function updateHoverFromPointer(clientY,rect,index){
      const localY=(clientY-rect.top)*height/rect.height,
        value=(margin.top+plotH-localY)/plotH*max,
        matchIndex=layers.findIndex(layer=>value>=layer.lower[index]&&value<=layer.upper[index]),
        matchLayer=matchIndex===-1?null:layers[matchIndex];
      const nextFamilyId=matchLayer?matchLayer.meta.family:null;
      const nextSeriesId=matchLayer?(matchLayer.meta.workstreamId||matchLayer.meta.id):null;
      const nextLayerIndex=state.segmentByPurpose&&matchLayer&&matchLayer.meta.purpose?matchIndex:null;
      setHoverState(nextLayerIndex,nextFamilyId,nextSeriesId);
    }
    function show(clientX,clientY){
      lastPointer=clientY!=null?{clientX,clientY}:null;
      const rect=svg.getBoundingClientRect(),
        localX=Math.max(margin.left,Math.min(width-margin.right,(clientX-rect.left)*width/rect.width)),
        index=Math.round((localX-margin.left)/plotW*(agg.bins-1)),
        px=x(index);
      line.style.display="block";
      line.setAttribute("x1",px);
      line.setAttribute("x2",px);
      const items=ordered.map(meta=>({name:meta.name,color:meta.color,value:agg.values[meta.id][index]})).filter(x=>x.value>0).sort((a,b)=>b.value-a.value),
        total=items.reduce((sum,item)=>sum+item.value,0);
      tooltip.innerHTML=`<strong>${escapeHtml(formatBin(index))}</strong><div class="tip-row"><span>Layer total</span><b>${number.format(total)}</b></div>${items.slice(0,9).map(item=>`<div class="tip-row"><span><span class="swatch" style="display:inline-block;background:${item.color};color:${item.color};margin-right:6px"></span>${escapeHtml(item.name)}</span><b>${number.format(item.value)}</b></div>`).join("")}${items.length>9?`<div class="tip-row"><span>+${items.length-9} more</span></div>`:""}`;
      tooltip.style.display="block";
      const cssX=(px/width)*rect.width;
      tooltip.style.left=`${Math.max(8,Math.min(rect.width-tooltip.offsetWidth-8,cssX+13))}px`;
      tooltip.style.top="31px";
      if(clientY!=null)updateHoverFromPointer(clientY,rect,index);
    }
    target.addEventListener("mousemove",event=>show(event.clientX,event.clientY));
    target.addEventListener("mouseleave",()=>{line.style.display="none";tooltip.style.display="none";lastPointer=null;setHoverState(null,null,null)});
    target.addEventListener("focus",()=>show(svg.getBoundingClientRect().left+margin.left/width*svg.getBoundingClientRect().width));
    target.addEventListener("blur",()=>{line.style.display="none";tooltip.style.display="none";lastPointer=null;setHoverState(null,null,null)});
    if(lastPointer)show(lastPointer.clientX,lastPointer.clientY);
  }
  function compact(value){const t=n=>String(Math.round(n*10)/10);if(value>=1e6)return t(value/1e6)+"m";if(value>=1e3)return t(value/1e3)+"k";return String(Math.round(value))}
  function escapeHtml(value){return String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]))}
  function showDefinitionTooltip(target){
    definitionTooltip.textContent=target.dataset.definition;
    definitionTooltip.classList.add("visible");
    const targetRect=target.getBoundingClientRect();
    const tooltipRect=definitionTooltip.getBoundingClientRect();
    const left=Math.max(12,Math.min(window.innerWidth-tooltipRect.width-12,targetRect.left));
    const below=targetRect.bottom+8;
    const top=below+tooltipRect.height<=window.innerHeight-12?below:Math.max(12,targetRect.top-tooltipRect.height-8);
    definitionTooltip.style.left=`${left}px`;
    definitionTooltip.style.top=`${top}px`;
  }
  function hideDefinitionTooltip(){definitionTooltip.classList.remove("visible")}
  function bindDefinitionTooltips(container){
    container.querySelectorAll("[data-definition]").forEach(target=>{
      target.setAttribute("aria-describedby",definitionTooltip.id);
      target.addEventListener("mouseenter",()=>showDefinitionTooltip(target));
      target.addEventListener("mouseleave",hideDefinitionTooltip);
      target.addEventListener("focus",()=>showDefinitionTooltip(target));
      target.addEventListener("blur",hideDefinitionTooltip);
    });
  }
  function syncCategoryToggle(){
    els.allCategoriesToggle.checked=state.categories.size===DATA.categories.length;
    els.allCategoriesToggle.indeterminate=state.categories.size>0&&state.categories.size<DATA.categories.length;
  }
  function renderCategories(){syncCategoryToggle();els.categoryChecks.innerHTML=DATA.categories.map(x=>`<div class="check" data-purpose-row="${escapeHtml(x.id)}"><input type="checkbox" id="${uid}-cat-${x.id}" data-cat="${x.id}" ${state.categories.has(x.id)?"checked":""}><label for="${uid}-cat-${x.id}">${escapeHtml(x.name)}</label></div>`).join("");root.querySelectorAll("[data-cat]").forEach(input=>input.addEventListener("change",()=>{input.checked?state.categories.add(input.dataset.cat):state.categories.delete(input.dataset.cat);syncCategoryToggle();render()}));
    /* Hovering a purpose hatches that purpose's band in every workstream and
       fades the rest. Only meaningful while segmenting is on — otherwise
       purposes are not drawn as separate bands and there is nothing to pick out. */
    root.querySelectorAll("[data-purpose-row]").forEach(row=>{
      const purposeId=row.dataset.purposeRow;
      const enter=()=>{
        if(!state.segmentByPurpose||hoveredPurposeId===purposeId)return;
        hoveredPurposeId=purposeId;
        applyChartFocus();
      };
      const leave=()=>{
        if(hoveredPurposeId===null)return;
        hoveredPurposeId=null;
        applyChartFocus();
      };
      row.addEventListener("mouseenter",enter);
      row.addEventListener("mouseleave",leave);
      row.addEventListener("focusin",enter);
      row.addEventListener("focusout",leave);
    });
  }
  function guideLeafDefinitions(leaves){
    return leaves.map(leaf=>`<dt><span class="swatch" style="display:inline-block;background:${leafColor(leafIndexById[leaf.id])};color:${leafColor(leafIndexById[leaf.id])};margin-right:6px"></span>${escapeHtml(leaf.name)}</dt><dd>${escapeHtml(LEAF_DESCRIPTIONS[leaf.id])}</dd>`).join("");
  }
  function renderCategoryGuide(){
    const guideFamilies=config.guideFamilies
      ?DATA.families.filter(family=>config.guideFamilies.indexOf(family.id)>=0)
      :DATA.families;
    const flat=guideFamilies.length===1;
    els.categoryGuide.classList.toggle("single",flat);
    els.categoryGuide.innerHTML=guideFamilies.map(family=>{
      const directLeaves=leavesByFamily[family.id].filter(leaf=>!leaf.group);
      const directDefinitions=directLeaves.length?`<dl>${guideLeafDefinitions(directLeaves)}</dl>`:"";
      const subgroupDefinitions=groupsByFamily[family.id].map(group=>`<section class="guide-subgroup"><h4><span class="swatch" style="display:inline-block;background:${group.color};color:${group.color};margin-right:6px"></span>${escapeHtml(group.name)}</h4><p>${escapeHtml(GROUP_DESCRIPTIONS[group.id])}</p><dl>${guideLeafDefinitions(leavesByGroup[group.id])}</dl></section>`).join("");
      const content=`<div class="guide-family-content"><p>${escapeHtml(FAMILY_DESCRIPTIONS[family.id])}</p>${directDefinitions}${subgroupDefinitions}</div>`;
      if(flat)return `<div class="guide-family flat">${content}</div>`;
      return `<details class="guide-family"><summary><span class="swatch" style="display:inline-block;background:${family.color};color:${family.color};margin-right:8px"></span>${escapeHtml(family.name)}</summary>${content}</details>`;
    }).join("");
  }
  function leafCheckboxMarkup(leaf){
    const leafIndex=leafIndexById[leaf.id];
    const inputId=`${uid}-leaf-${leafIndex}`;
    return `<div class="leaf-check"><input type="checkbox" id="${inputId}" data-leaf-select="${escapeHtml(leaf.id)}" ${state.selectedLeaves.has(leaf.id)?"checked":""}><label class="definition-target" tabindex="0" for="${inputId}" data-definition="${escapeHtml(LEAF_DESCRIPTIONS[leaf.id])}"><span class="swatch" style="display:inline-block;background:${leafColor(leafIndex)};color:${leafColor(leafIndex)};margin-right:6px"></span>${escapeHtml(leaf.name)}</label></div>`;
  }
  function renderWorkstreams(){
    hideDefinitionTooltip();
    els.allWorkstreamsToggle.checked=state.selectedLeaves.size===DATA.leaves.length;
    els.allWorkstreamsToggle.indeterminate=state.selectedLeaves.size>0&&state.selectedLeaves.size<DATA.leaves.length;
    els.expandWorkstreams.disabled=state.expandedFamilies.size===DATA.families.length&&state.expandedGroups.size===DATA.groups.length;
    els.collapseWorkstreams.disabled=state.expandedFamilies.size===0&&state.expandedGroups.size===0;
    const container=els.workstreamChecks;
    container.innerHTML=DATA.families.map((family,familyIndex)=>{
      const leaves=leavesByFamily[family.id];
      const selectedLeaves=selectedLeavesForFamily(family.id);
      const expanded=state.expandedFamilies.has(family.id);
      const familyInputId=`${uid}-family-${familyIndex}`;
      const leafListId=`${uid}-family-leaves-${familyIndex}`;
      const directLeaves=leaves.filter(leaf=>!leaf.group);
      let leafMarkup="";
      if(expanded&&directLeaves.length)leafMarkup=`<div id="${leafListId}" class="leaf-checks">${directLeaves.map(leafCheckboxMarkup).join("")}</div>`;
      if(expanded&&groupsByFamily[family.id].length){
        const subgroupMarkup=groupsByFamily[family.id].map((group,groupIndex)=>{
          const groupLeaves=leavesByGroup[group.id];
          const selectedGroupLeaves=selectedLeavesForGroup(group.id);
          const groupExpanded=state.expandedGroups.has(group.id);
          const groupInputId=`${uid}-group-${familyIndex}-${groupIndex}`;
          const groupListId=`${uid}-group-leaves-${familyIndex}-${groupIndex}`;
          const groupLeavesMarkup=groupExpanded?`<div id="${groupListId}" class="subgroup-leaves">${groupLeaves.map(leafCheckboxMarkup).join("")}</div>`:"";
          return `<div class="subgroup"><div class="subgroup-row" data-expand-group="${group.id}"><button type="button" class="expand-toggle" aria-expanded="${groupExpanded}" aria-controls="${groupListId}" aria-label="${groupExpanded?"Collapse":"Expand"} ${escapeHtml(group.name)}">▸</button><label class="check-hit"><input type="checkbox" id="${groupInputId}" data-group-select="${group.id}" aria-label="Show ${escapeHtml(group.name)}" ${selectedGroupLeaves.length===groupLeaves.length?"checked":""}></label><span class="subgroup-label definition-target" tabindex="0" data-definition="${escapeHtml(GROUP_DESCRIPTIONS[group.id])}"><span class="swatch" style="display:inline-block;background:${group.color};color:${group.color};margin-right:6px"></span>${escapeHtml(group.name)}</span><span class="selection-count">${selectedGroupLeaves.length}/${groupLeaves.length}</span></div>${groupLeavesMarkup}</div>`;
        }).join("");
        const directLeafMarkup=directLeaves.length?`<div class="leaf-checks">${directLeaves.map(leafCheckboxMarkup).join("")}</div>`:"";
        leafMarkup=`<div id="${leafListId}" class="family-children">${directLeafMarkup}${subgroupMarkup}</div>`;
      }
      return `<div class="workstream-group"><div class="workstream-row" data-expand-family="${family.id}"><button type="button" class="expand-toggle" aria-expanded="${expanded}" aria-controls="${leafListId}" aria-label="${expanded?"Collapse":"Expand"} ${escapeHtml(family.name)}">▸</button><label class="check-hit"><input type="checkbox" id="${familyInputId}" data-family-select="${family.id}" aria-label="Show ${escapeHtml(family.name)}" ${selectedLeaves.length===leaves.length?"checked":""}></label><span class="workstream-label definition-target" tabindex="0" data-definition="${escapeHtml(FAMILY_DESCRIPTIONS[family.id])}"><span class="swatch" style="display:inline-block;background:${family.color};color:${family.color};margin-right:6px"></span>${escapeHtml(family.name)}</span><span class="selection-count">${selectedLeaves.length}/${leaves.length}</span></div>${leafMarkup}</div>`;
    }).join("");

    bindDefinitionTooltips(container);
    root.querySelectorAll("[data-family-select]").forEach(input=>{
      const familyLeaves=leavesByFamily[input.dataset.familySelect];
      const selectedCount=familyLeaves.filter(leaf=>state.selectedLeaves.has(leaf.id)).length;
      input.indeterminate=selectedCount>0&&selectedCount<familyLeaves.length;
      input.addEventListener("change",()=>{
        for(const leaf of familyLeaves){
          if(input.checked)state.selectedLeaves.add(leaf.id);
          else state.selectedLeaves.delete(leaf.id);
        }
        renderWorkstreams();
      });
    });
    root.querySelectorAll("[data-group-select]").forEach(input=>{
      const groupLeaves=leavesByGroup[input.dataset.groupSelect];
      const selectedCount=groupLeaves.filter(leaf=>state.selectedLeaves.has(leaf.id)).length;
      input.indeterminate=selectedCount>0&&selectedCount<groupLeaves.length;
      input.addEventListener("change",()=>{
        for(const leaf of groupLeaves){
          if(input.checked)state.selectedLeaves.add(leaf.id);
          else state.selectedLeaves.delete(leaf.id);
        }
        renderWorkstreams();
      });
    });
    root.querySelectorAll("[data-leaf-select]").forEach(input=>input.addEventListener("change",()=>{
      if(input.checked)state.selectedLeaves.add(input.dataset.leafSelect);
      else state.selectedLeaves.delete(input.dataset.leafSelect);
      renderWorkstreams();
    }));
    root.querySelectorAll("[data-expand-family]").forEach(row=>row.addEventListener("click",event=>{
      if(event.target.closest(".check-hit"))return;
      const familyId=row.dataset.expandFamily;
      if(state.expandedFamilies.has(familyId))state.expandedFamilies.delete(familyId);
      else state.expandedFamilies.add(familyId);
      renderWorkstreams();
      replayToggleSpin(`.workstream-row[data-expand-family="${CSS.escape(familyId)}"] .expand-toggle`);
    }));
    root.querySelectorAll("[data-expand-group]").forEach(row=>row.addEventListener("click",event=>{
      if(event.target.closest(".check-hit"))return;
      const groupId=row.dataset.expandGroup;
      if(state.expandedGroups.has(groupId))state.expandedGroups.delete(groupId);
      else state.expandedGroups.add(groupId);
      renderWorkstreams();
      replayToggleSpin(`.subgroup-row[data-expand-group="${CSS.escape(groupId)}"] .expand-toggle`);
    }));
    render();
  }
  els.segmentByPurpose.addEventListener("change",event=>{state.segmentByPurpose=event.target.checked;render()});
  els.binHours.addEventListener("change",event=>{state.bin=event.target.value;render()});
  els.allCategoriesToggle.addEventListener("change",event=>{
    state.categories=event.target.checked?new Set(DATA.categories.map(x=>x.id)):new Set();
    renderCategories();
    render();
  });
  els.allWorkstreamsToggle.addEventListener("change",event=>{
    state.selectedLeaves=event.target.checked?new Set(DATA.leaves.map(leaf=>leaf.id)):new Set();
    renderWorkstreams();
  });
  els.expandWorkstreams.addEventListener("click",()=>{state.expandedFamilies=new Set(DATA.families.map(family=>family.id));state.expandedGroups=new Set(DATA.groups.map(group=>group.id));renderWorkstreams()});
  els.collapseWorkstreams.addEventListener("click",()=>{state.expandedFamilies.clear();state.expandedGroups.clear();renderWorkstreams()});
  window.addEventListener("resize",()=>render());renderCategories();renderCategoryGuide();renderWorkstreams();
  return{render:render,root:root,config:config};
}

function mountAll(scope){
  (scope||document).querySelectorAll("[data-workstream-chart]").forEach(function(el){
    if(el.getAttribute("data-wsc-mounted"))return;
    el.setAttribute("data-wsc-mounted","1");
    var raw=el.getAttribute("data-wsc-config");
    var cfg={};
    if(raw){try{cfg=JSON.parse(raw)}catch(e){console.error("WorkstreamChart: bad data-wsc-config",e)}}
    createWorkstreamChart(el,cfg);
  });
}

window.WorkstreamChart={create:createWorkstreamChart,mountAll:mountAll,views:VIEWS};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",function(){mountAll()});
else mountAll();
})();
