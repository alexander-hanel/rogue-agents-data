/* Interactive agent run timeline — the live version of Figure 5.
 *
 * Ported from the standalone prototype page it was authored in. The drawing,
 * interaction and annotation-layout logic is unchanged; what differs is that
 * every DOM reference now resolves inside the component's own root element
 * rather than by document-wide id, so the chart can sit in a page that owns
 * ids of its own. Data lives in assets/js/agent_timeline/data.js.
 */
(function(){
"use strict";

var instanceCount=0;

function createAgentTimeline(root){
  var DATA=window.AGENT_TIMELINE_DATA,AGENT_HANDLES=window.AGENT_TIMELINE_HANDLES||{};
  if(!DATA){console.error("AgentTimeline: window.AGENT_TIMELINE_DATA is missing");return null}
  var uid="atl"+(++instanceCount);

  var elements={};
  root.querySelectorAll("[data-el]").forEach(function(el){elements[el.dataset.el]=el});
  var required=["canvas","wrap","tip","subtitle","status","annotations","featured","agentOptions",
                "agentSearch","sampleSize","presets","scrollHint","resetChip",
                "side","boardToggle","hfToggle","annotationToggle","knownOrAnnotatedToggle",
                "sampleAgents","showAllAgents","findAgent","resetView"];
  for(var i=0;i<required.length;i++){
    if(!elements[required[i]]){console.error('AgentTimeline: missing [data-el="'+required[i]+'"]');return null}
  }

  /* Two relationships HTML can only express through ids. Everything else is
     addressed by data-el, so the ids are the only thing needing a uid. */
  elements.agentOptions.id=uid+"-agent-options";
  elements.agentSearch.setAttribute("list",elements.agentOptions.id);
  elements.status.id=uid+"-status";
  elements.canvas.setAttribute("aria-describedby",elements.status.id);

  // Plot constants, DOM references, and mutable view state.
    const cssColor=name=>getComputedStyle(root).getPropertyValue(name).trim();
    const COLORS={gray:cssColor('--gray'),gold:cssColor('--gold'),green:cssColor('--green'),red:cssColor('--red'),sol:cssColor('--blue'),hpim:cssColor('--pink'),grid:cssColor('--line'),muted:cssColor('--muted')};
    const total=(new Date(DATA.windowEnd)-new Date(DATA.windowStart))/1000;
    /* plotRight was 2320, reserving the right quarter of the canvas as an
     annotation gutter. The cards now live inside the plot's empty regions, so
     the plot gets that width back — which a week-long time series wants. */
  const DESIGN={width:3200,height:2800,plotLeft:220,plotRight:3110,plotTop:80,plotBottom:2550};
  /* The in-plot slots are solved against a 1138px canvas — breakout-wider at
     its 1140px cap — where a card comes to 213px. Narrower than that the cards
     wrap onto more lines than the slots allow, so the layout stacks under the
     plot instead. */
  const ANNOTATION_STACK_WIDTH=1136;
    const ANNOTATION_CONNECTOR_DASH=[8,6];
    const ANNOTATION_CONNECTOR_WIDTH=2.2;
    const ANNOTATION_ENDPOINT_SIZE=5.5;
    const ROW_ZOOM_DURATION=420;
    const FOCUSED_AGENT_ROW_COUNT=31;
    /* Focus mode stacks one agent's annotation cards in a column. 667 design
       units is ~190px on this canvas, a little more than the tallest card, so
       the common cases need no correction at all. */
    const FOCUS_CARD_PITCH=667;
    const FOCUS_CARD_GAP=10;
    const {canvas,wrap,tip}=elements;
    const controls={board:elements.boardToggle,hf:elements.hfToggle,annotations:elements.annotationToggle,knownOrAnnotated:elements.knownOrAnnotatedToggle};
  const state={domain:[0,total],pinned:null,highlight:null,hover:null,annotationHover:null,cursor:null,drag:null,subset:null,rowZoom:null};
  let cssWidth=0,cssHeight=0,lastRows=[],lastYByIndex=new Map();
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const activeAgent=()=>state.pinned;
  const defaultAgentLabel=index=>`Agent ${index+1}`;
  const agentLabel=index=>AGENT_HANDLES[index]??defaultAgentLabel(index);
  const annotatedAgents=new Set(DATA.annotations.map(annotation=>annotation.agent));
  const isKnownOrAnnotated=index=>Boolean(AGENT_HANDLES[index])||annotatedAgents.has(index);

  // Row filtering and coordinate transforms.
  function eligibleIndices(){
    const candidates=state.subset??DATA.agents.map((_,index)=>index);
    return controls.knownOrAnnotated.checked?candidates.filter(isKnownOrAnnotated):candidates;
  }
  function centeredRows(candidates,center,count,anchorRatio=.5){
    let centerPosition=candidates.indexOf(center);
    if(centerPosition<0){
      centerPosition=candidates.reduce((closest,index,position)=>Math.abs(index-center)<Math.abs(candidates[closest]-center)?position:closest,0);
    }
    const visibleCount=clamp(count,1,candidates.length);
    const start=clamp(centerPosition-Math.floor(anchorRatio*visibleCount),0,candidates.length-visibleCount);
    return candidates.slice(start,start+visibleCount);
  }
  function visibleIndices(){
    const candidates=eligibleIndices(),zoom=state.rowZoom;
    const center=zoom?.center??state.pinned;
    if(center!==null)return centeredRows(candidates,center,zoom?.count??FOCUSED_AGENT_ROW_COUNT,zoom?.anchorRatio);
    return candidates;
  }
  const plotMargins=()=>({
    l:DESIGN.plotLeft/DESIGN.width*cssWidth,
    r:(DESIGN.width-DESIGN.plotRight)/DESIGN.width*cssWidth,
    t:DESIGN.plotTop/DESIGN.height*cssHeight,
    b:(DESIGN.height-DESIGN.plotBottom)/DESIGN.height*cssHeight,
  });
  const xOf=t=>{const m=plotMargins();return m.l+(t-state.domain[0])/(state.domain[1]-state.domain[0])*(cssWidth-m.l-m.r)};
  const timeAt=x=>{const m=plotMargins();return state.domain[0]+(x-m.l)/(cssWidth-m.l-m.r)*(state.domain[1]-state.domain[0])};
  const dateAt=s=>new Date(new Date(DATA.windowStart).getTime()+s*1000);
  const timeLabel=s=>dateAt(s).toLocaleString('en-US',{timeZone:'UTC',month:'short',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false})+' UTC';
  const axisLabel=s=>{const date=dateAt(s),midnight=date.getUTCHours()===0&&date.getUTCMinutes()===0;return date.toLocaleString('en-US',{timeZone:'UTC',month:'short',day:'numeric',...(midnight?{}:{hour:'2-digit',minute:'2-digit',hour12:false})})};
  function setupCanvas(){const dpr=window.devicePixelRatio||1;cssWidth=canvas.clientWidth;cssHeight=canvas.clientHeight;canvas.width=Math.round(cssWidth*dpr);canvas.height=Math.round(cssHeight*dpr);canvas.getContext('2d').setTransform(dpr,0,0,dpr,0,0)}
  function segment(ctx,a,b,y,color,width){const left=Math.max(a,state.domain[0]),right=Math.min(b,state.domain[1]);if(left>right)return;ctx.beginPath();ctx.moveTo(xOf(left),y);ctx.lineTo(xOf(right),y);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash([]);ctx.stroke()}
  function marker(ctx,x,y,kind,color,size=3.5){
    ctx.strokeStyle=color;ctx.fillStyle='#fff';ctx.lineWidth=1.5;ctx.setLineDash([]);ctx.beginPath();
    if(kind==='circle')ctx.arc(x,y,size,0,Math.PI*2);
    else if(kind==='star'){
      for(let point=0;point<10;point++){
        const radius=point%2===0?size:size*.45,angle=-Math.PI/2+point*Math.PI/5;
        const pointX=x+Math.cos(angle)*radius,pointY=y+Math.sin(angle)*radius;
        if(point===0)ctx.moveTo(pointX,pointY);else ctx.lineTo(pointX,pointY);
      }
      ctx.closePath();
    }else ctx.rect(x-size,y-size,size*2,size*2);
    ctx.fill();ctx.stroke();
  }
  function milestoneMarker(ctx,x,y,kind,color,size){
    ctx.fillStyle=color;ctx.strokeStyle=color;ctx.lineWidth=1.5;ctx.setLineDash([]);ctx.beginPath();
    if(kind==='diamond'){ctx.moveTo(x,y-size);ctx.lineTo(x+size,y);ctx.lineTo(x,y+size);ctx.lineTo(x-size,y);ctx.closePath();ctx.fill();return;}
    if(kind==='square'){ctx.fillRect(x-size,y-size,size*2,size*2);return;}
    ctx.arc(x,y,size,0,Math.PI*2);ctx.fill();
  }
  function annotationColor(kind){return kind==='hf-end'?COLORS.sol:kind==='hf-start'?COLORS.red:kind==='board'?COLORS.hpim:kind==='probe'?COLORS.green:COLORS.sol}
  function annotationMarkerKind(kind){return ['probe','board','handoff'].includes(kind)?'star':'square'}

  /* Annotation placement, in the original 3200 × 2800 design space.
   *
   * The agents are sorted by start time, so the drawn lines form a diagonal
   * band and the rest of the plot is empty in a predictable staircase: the left
   * third for most of the height, widening below the band's front, plus a
   * pocket at the top right after activity has died away. These twelve slots
   * are packed into that dead space — three columns down the left and two cards
   * in the right pocket — so the cards cost the figure no height at all.
   *
   * The positions are baked rather than computed because the data is fixed.
   * They were solved against a 1px occupancy map of the agent lines, so no slot
   * has a single pixel of drawn line under it, and then refined so that no
   * connector crosses another and none passes behind another card — both of
   * which read as the lines belonging to the wrong cards. Which annotation gets
   * which slot is part of that solution, not incidental.
   *
   * Re-run the packing if the agent data, the card copy, or the plot height
   * changes. The clearance from the agent lines survives a height change
   * (lines and slots scale together), but the crossing-freedom does not: the
   * cards keep a fixed pixel height while everything around them scales, so
   * their midpoints — where the connectors leave — drift relative to the
   * targets. This solution is for the 2000px plot. */
  const ANNOTATION_SLOTS=[
    {x: 653,y: 408,w:599},  //  0 Origin agent after first MKCOL
    {x:1895,y:  29,w:599},  //  1 Agent originating the message board
    {x: 653,y:1117,w:599},  //  2 PHASEONE10841 -> PHASEONE[big]
    {x: 653,y: 869,w:599},  //  3 38148c finds working HF credentials
    {x:1274,y:1461,w:599},  //  4 Looks for a leaked HF token
    {x:  31,y:1363,w:599},  //  5 38148c confirms arbitrary file read
    {x:1274,y:2162,w:599},  //  6 Finds a major global HF lead
    {x:2517,y:1461,w:599},  //  7 JAN183411 joins the broader effort
    {x:1274,y:1666,w:599},  //  8 Joins the HDF / Kubernetes swarm
    {x:2517,y: 988,w:599},  //  9 JAN183411 worker RCE
    {x:2517,y:1865,w:599},  // 10 Expired access closes the route
    {x:2517,y:1081,w:599},  // 11 HF service access collapses
  ];
  function annotationLayoutData(){
    const layouts=new Map();
    if(ANNOTATION_SLOTS.length!==DATA.annotations.length)
      console.error('AgentTimeline: '+ANNOTATION_SLOTS.length+' annotation slots for '+DATA.annotations.length+' annotations');
    DATA.annotations.forEach((annotation,index)=>{
      const slot=ANNOTATION_SLOTS[index];
      if(slot)layouts.set(index,slot);
    });
    return layouts;
  }
  const annotationLayouts=annotationLayoutData();
  function annotationTargetIsVisible(annotation){
    return controls.annotations.checked&&annotation.time>=state.domain[0]
      &&annotation.time<=state.domain[1]&&lastYByIndex.has(annotation.agent);
  }
  function visibleAnnotationIndices(){
    const focus=activeAgent();
    return DATA.annotations.map((annotation,index)=>({annotation,index})).filter(({annotation})=>
      annotationTargetIsVisible(annotation)&&(focus===null||annotation.agent===focus)
    );
  }
  function currentAnnotationLayout(index){
    const annotation=DATA.annotations[index],focus=activeAgent();
    if(!annotationTargetIsVisible(annotation))return null;
    if(focus===null)return annotationLayouts.get(index);
    const visible=visibleAnnotationIndices(),order=visible.findIndex(item=>item.index===index);
    if(order<0)return null;
    const targetOnRight=annotation.time>(state.domain[0]+state.domain[1])/2;
    /* A starting position only: the cards for one agent are stacked in the
       column away from its line, and the pass in layoutAnnotationCards then
       spaces them by their measured heights. The pitch here is a hint, not a
       guarantee — nothing at layout-time knows how many lines a card wraps to. */
    return {x:targetOnRight?110:2350,y:105+order*FOCUS_CARD_PITCH,w:730};
  }
  function layoutAnnotationCards(){
    const stacked=cssWidth<=ANNOTATION_STACK_WIDTH;
    wrap.classList.toggle('annotations-stacked',stacked);
    const rail=elements.annotations,cards=[...rail.querySelectorAll('.annotation')];
    rail.classList.toggle('stacked',stacked);
    cards.forEach(card=>{
      const index=Number(card.dataset.annotation),layout=currentAnnotationLayout(index);
      const visible=controls.annotations.checked&&layout!==null;
      card.hidden=!visible;
      if(!visible)return;
      if(stacked){card.style.left='';card.style.top='';card.style.width='';card.style.height='';return;}
      card.style.left=layout.x/DESIGN.width*100+'%';
      card.style.top=layout.y/DESIGN.height*cssHeight+'px';
      card.style.width=layout.w/DESIGN.width*100+'%';
      card.style.height='auto';
    });
    if(stacked)return;
    /* The default view's slots are pre-solved against an occupancy map, so they
       must stay exactly where they are. Focus mode's are generated on the fly
       from the visible order, which can't account for how tall each card
       renders — so only that mode gets a de-overlap pass. Cards are grouped by
       column and pushed down past the previous one; if the column then runs off
       the bottom, the whole group shifts back up by the overflow. */
    if(activeAgent()===null)return;
    const columns=new Map();
    cards.filter(card=>!card.hidden).forEach(card=>{
      const key=Math.round(card.offsetLeft);
      if(!columns.has(key))columns.set(key,[]);
      columns.get(key).push(card);
    });
    columns.forEach(group=>{
      group.sort((a,b)=>a.offsetTop-b.offsetTop);
      const tops=[];
      let previousBottom=-Infinity;
      group.forEach(card=>{
        const top=Math.max(card.offsetTop,previousBottom+FOCUS_CARD_GAP);
        tops.push(top);
        previousBottom=top+card.offsetHeight;
      });
      const overflow=previousBottom-(cssHeight-8);
      const shift=overflow>0?Math.min(overflow,tops[0]-8):0;
      group.forEach((card,position)=>{card.style.top=(tops[position]-shift)+'px'});
    });
  }
  function drawAnnotationConnectors(ctx){
    if(!controls.annotations.checked||cssWidth<=ANNOTATION_STACK_WIDTH)return;
    DATA.annotations.forEach((annotation,index)=>{
      if(!annotationTargetIsVisible(annotation))return;
      const layout=currentAnnotationLayout(index),targetY=lastYByIndex.get(annotation.agent);
      if(!layout||targetY===undefined)return;
      const card=elements.annotations.querySelector(`[data-annotation="${index}"]`);
      if(card.hidden)return;
      const targetX=xOf(annotation.time),cardY=card.offsetTop,cardH=card.offsetHeight;
      const connectorColor=annotationColor(annotation.kind);
      const highlighted=index===state.annotationHover||annotation.agent===state.hover
        ||annotation.agent===state.highlight||annotation.agent===activeAgent();
      /* Every card keeps a line to its point at rest, so the figure reads on its
         own without hovering. The cards sit in the plot's dead space, so these
         runs are long — the resting line is thin and slightly transparent, and
         hovering promotes it to full weight. The white halo underneath keeps it
         legible where it crosses the agent band. */
      /* A short stub out of the card, then one straight diagonal to the point.
         The prototype ran the horizontal all the way to the target's x, which
         was fine when the cards sat in a margin; from inside the plot that run
         travels along the agent band, and a horizontal dashed line among
         horizontal agent lines is nearly impossible to follow.
         Which edge it leaves by is worked out from the card box against the
         target, not from a stored side: when the target's x falls within the
         card's own span, both side edges are the wrong way round and the line
         has to double back across a neighboring card. In that case it leaves
         through the top or bottom instead and drops straight to the point. */
      const cardLeft=card.offsetLeft,cardRight=cardLeft+card.offsetWidth;
      const cardMidY=cardY+cardH/2;
      let exitX,exitY,stubX,stubY;
      if(targetX>cardRight){exitX=cardRight;exitY=cardMidY;stubX=cardRight+18;stubY=cardMidY}
      else if(targetX<cardLeft){exitX=cardLeft;exitY=cardMidY;stubX=cardLeft-18;stubY=cardMidY}
      else{
        const below=targetY>cardMidY;
        exitX=clamp(targetX,cardLeft+12,cardRight-12);
        exitY=below?cardY+cardH:cardY;
        stubX=exitX;stubY=exitY+(below?18:-18);
      }
      ctx.save();ctx.beginPath();ctx.lineCap='round';
      ctx.moveTo(exitX,exitY);ctx.lineTo(stubX,stubY);ctx.lineTo(targetX,targetY);
      ctx.strokeStyle='rgba(255,255,255,.96)';ctx.lineWidth=highlighted?7:5;ctx.setLineDash([]);ctx.stroke();
      ctx.strokeStyle=connectorColor;ctx.globalAlpha=highlighted?1:.62;
      ctx.lineWidth=highlighted?4:ANNOTATION_CONNECTOR_WIDTH;ctx.setLineDash(ANNOTATION_CONNECTOR_DASH);ctx.stroke();
      ctx.restore();
      marker(ctx,targetX,targetY,annotationMarkerKind(annotation.kind),connectorColor,highlighted?8.5:ANNOTATION_ENDPOINT_SIZE);
    });
  }
  function fittedLabel(ctx,label,maxWidth){
    if(ctx.measureText(label).width<=maxWidth)return label;
    let shortened=label;
    while(shortened.length>1&&ctx.measureText(shortened+'…').width>maxWidth)shortened=shortened.slice(0,-1);
    return shortened+'…';
  }
  function drawGrid(ctx,m){
    const span=state.domain[1]-state.domain[0];
    if(span>=2*86400){
      let hour=Math.ceil(state.domain[0]/3600)*3600;
      while(hour<=state.domain[1]){
        if(hour%86400!==0){
          const x=xOf(hour);ctx.strokeStyle='#f0f0f0';ctx.lineWidth=.45;ctx.beginPath();ctx.moveTo(x,m.t);ctx.lineTo(x,cssHeight-m.b);ctx.stroke();
        }
        hour+=3600;
      }
    }
    const step=span<=12*3600?3600:span<=3*86400?6*3600:cssWidth<800?2*86400:86400;
    let tick=Math.ceil(state.domain[0]/step)*step;ctx.font='13px system-ui';ctx.fillStyle=COLORS.muted;
    while(tick<=state.domain[1]){
      const x=xOf(tick);ctx.strokeStyle=COLORS.grid;ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(x,m.t);ctx.lineTo(x,cssHeight-m.b);ctx.stroke();
      const labelY=Math.min(cssHeight-5,cssHeight-m.b+19);
      ctx.textAlign=x<m.l+55?'left':x>cssWidth-m.r-55?'right':'center';ctx.fillText(axisLabel(tick),x,labelY);tick+=step;
    }
  }
  function drawAgentScale(ctx){
    if(activeAgent()!==null||state.rowZoom!==null||state.subset!==null||controls.knownOrAnnotated.checked)return;
    const x=900/DESIGN.width*cssWidth,bottom=(DESIGN.plotBottom-34)/DESIGN.height*cssHeight;
    const top=bottom-100*DATA.rowSpacing/DESIGN.height*cssHeight,cap=4;
    ctx.strokeStyle='#555';ctx.lineWidth=1.2;ctx.setLineDash([]);ctx.beginPath();ctx.moveTo(x,top);ctx.lineTo(x,bottom);ctx.moveTo(x-cap,top);ctx.lineTo(x+cap,top);ctx.moveTo(x-cap,bottom);ctx.lineTo(x+cap,bottom);ctx.stroke();
    ctx.fillStyle='#444';ctx.font='10px system-ui';ctx.textAlign='left';ctx.fillText('100 agents',x+7,(top+bottom)/2+3);
  }
  function draw(){
    const ctx=canvas.getContext('2d'),m=plotMargins();
    ctx.clearRect(0,0,cssWidth,cssHeight);
    drawGrid(ctx,m);
    lastRows=visibleIndices();
    const rowH=(cssHeight-m.t-m.b)/lastRows.length;
    /* Line weight follows the room a row actually has rather than a focused
       flag, so it eases in as the row window narrows instead of jumping the
       moment focusing starts. At 1206 rows the pitch is well under 1px and this
       is 0; by ~7px it is fully focused. */
    const focusRatio=clamp((rowH-1)/6,0,1);
    const width=(base,focused)=>base+(focused-base)*focusRatio;
    lastYByIndex=new Map();
    ctx.font='11px system-ui';
    ctx.textAlign='right';
    const evenlySpaceRows=activeAgent()!==null||state.rowZoom!==null||state.subset!==null||controls.knownOrAnnotated.checked;
    lastRows.forEach((idx,row)=>{
      const a=DATA.agents[idx],y=evenlySpaceRows?m.t+(row+.5)*rowH:(a.y-300)/DESIGN.height*cssHeight;
      const emphasized=(state.annotationHover!==null&&DATA.annotations[state.annotationHover].agent===idx)
        ||idx===state.highlight;
      const lineScale=emphasized?3:1;
      lastYByIndex.set(idx,y);
      segment(ctx,a.start,a.end,y,COLORS.gray,width(.75,1.4)*lineScale);
      if(controls.board.checked&&a.read!==null)segment(ctx,Math.max(a.read,a.start),a.end,y,COLORS.gold,width(.9,1.8)*lineScale);
      if(controls.board.checked&&a.write!==null)segment(ctx,Math.max(a.write,a.start),a.end,y,COLORS.green,width(.95,2)*lineScale);
      if(controls.hf.checked&&a.hfStart!==null){
        segment(ctx,a.hfStart,a.hfEnd,y,COLORS.red,width(1.05,2.4)*lineScale);
      }
      if(a.start>=state.domain[0]&&a.start<=state.domain[1]){
        ctx.fillStyle=a.family==='s'?COLORS.sol:COLORS.hpim;
        ctx.beginPath();ctx.arc(xOf(a.start),y,width(1.8,3),0,Math.PI*2);ctx.fill();
      }
      const milestoneSize=width(2.2,4)*(emphasized?1.5:1);
      if(controls.board.checked&&a.read!==null&&a.read>=state.domain[0]&&a.read<=state.domain[1])milestoneMarker(ctx,xOf(a.read),y,'diamond',COLORS.gold,milestoneSize);
      if(controls.board.checked&&a.write!==null&&a.write>=state.domain[0]&&a.write<=state.domain[1])milestoneMarker(ctx,xOf(a.write),y,'square',COLORS.green,milestoneSize);
      if(controls.hf.checked&&a.hfStart!==null&&a.hfStart>=state.domain[0]&&a.hfStart<=state.domain[1])milestoneMarker(ctx,xOf(a.hfStart),y,'circle',COLORS.red,milestoneSize);
      if(controls.hf.checked&&a.observedStop&&a.hfEnd>=state.domain[0]&&a.hfEnd<=state.domain[1])marker(ctx,xOf(a.hfEnd),y,'circle',COLORS.red);
      if(controls.annotations.checked){
        DATA.annotations.forEach((n,index)=>{if(n.agent===idx&&n.time>=state.domain[0]&&n.time<=state.domain[1]){
          const color=annotationColor(n.kind);
          marker(ctx,xOf(n.time),y,annotationMarkerKind(n.kind),color,index===state.annotationHover?6.5:3.5);
        }});
      }
      if(activeAgent()!==null){
        ctx.fillStyle=idx===activeAgent()?COLORS.sol:COLORS.muted;
        ctx.fillText(fittedLabel(ctx,agentLabel(idx),m.l-14),m.l-9,y+4);
      }
      if(idx===state.hover||idx===state.highlight||idx===activeAgent()){
        ctx.strokeStyle=COLORS.sol;ctx.lineWidth=1;ctx.setLineDash([]);
        ctx.strokeRect(m.l,y-rowH/2,cssWidth-m.l-m.r,rowH);
      }
    });
    drawAgentScale(ctx);
    drawCursor(ctx);
    layoutAnnotationCards();
    drawAnnotationConnectors(ctx);
    drawDragSelection(ctx);
    updateStatus();
  }
  /* Any view that is not the full window and every row. resetView is what the
     chip calls, so the test mirrors exactly what resetView puts back. */
  function isZoomedIn(){
    return state.domain[0]>1||state.domain[1]<total-1||state.rowZoom!==null||state.pinned!==null;
  }
  function updateStatus(){
    const focused=activeAgent();
    const label=focused===null?(state.rowZoom===null?(state.subset===null?'all eligible agents':'random subset'):'zoomed agent rows'):agentLabel(focused);
    elements.status.textContent=`${lastRows.length} rows shown · ${timeLabel(state.domain[0])} → ${timeLabel(state.domain[1])} · ${label}`;
    elements.resetChip.hidden=!isZoomedIn();
  }
  /* Highlighting is deliberately not focusing: hovering a notable agent should
     point that agent out in whatever view you are already looking at, not
     replace the view. draw() thickens the highlighted row and promotes its
     annotation connectors; if the agent is not among the visible rows, nothing
     happens, which is the honest answer. */
  function setHighlight(index){
    if(state.highlight===index)return;
    state.highlight=index;draw();
  }
  let rowZoomFrame=null,rowZoomGuard=null;
  function cancelRowZoom(){
    if(rowZoomFrame!==null){cancelAnimationFrame(rowZoomFrame);rowZoomFrame=null}
    if(rowZoomGuard!==null){clearTimeout(rowZoomGuard);rowZoomGuard=null}
  }
  function focusAgent(index){
    cancelRowZoom();
    state.highlight=null;state.hover=null;
    const target=Math.min(FOCUSED_AGENT_ROW_COUNT,eligibleIndices().length);
    const from=state.rowZoom?state.rowZoom.count:lastRows.length;
    const settle=()=>{
      cancelRowZoom();
      state.pinned=index;state.rowZoom={center:index,count:target};draw();syncFeatured();
    };
    const reducedMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reducedMotion||from<=target){settle();return}
    /* Ease the row window down instead of cutting to it — 1206 rows to 31 in a
       single frame reads as a different chart rather than a closer look. Only
       the count has to move: the agents' own y positions are already exactly
       evenly spaced, so the even spacing that focusing switches on is
       imperceptible. pinned is set at the end so the row labels and the focused
       annotation layout resolve once, on arrival, rather than flickering
       throughout. */
    const started=performance.now();
    const step=now=>{
      const progress=Math.min(1,(now-started)/ROW_ZOOM_DURATION);
      const eased=1-Math.pow(1-progress,3);
      state.rowZoom={center:index,count:Math.max(target,Math.round(from+(target-from)*eased))};
      draw();
      if(progress<1)rowZoomFrame=requestAnimationFrame(step);
      else{rowZoomFrame=null;settle()}
    };
    rowZoomFrame=requestAnimationFrame(step);
    /* rAF does not run in a backgrounded tab (nor under headless virtual time),
       and an unfinished zoom would leave the chart with a row window but no
       pinned agent — no row labels, no focused annotations. Settle regardless
       once the animation's time is up. */
    rowZoomGuard=setTimeout(settle,ROW_ZOOM_DURATION+250);
  }
  /* Mac trackpads send ctrlKey for pinch, so accept either modifier but name
     the one the reader's platform expects. */
  const IS_APPLE=/Mac|iPhone|iPad|iPod/.test((navigator.userAgentData&&navigator.userAgentData.platform)||navigator.platform||'');
  const ZOOM_KEY=IS_APPLE?'\u2318':'Ctrl';
  let scrollHintTimeout=null;
  function showScrollHint(){
    elements.scrollHint.textContent=`Hold ${ZOOM_KEY} and scroll to zoom`;
    elements.scrollHint.classList.add('visible');
    clearTimeout(scrollHintTimeout);
    scrollHintTimeout=setTimeout(hideScrollHint,1100);
  }
  function hideScrollHint(){clearTimeout(scrollHintTimeout);elements.scrollHint.classList.remove('visible')}
  function resetView(){cancelRowZoom();state.domain=[0,total];state.pinned=null;state.highlight=null;state.hover=null;state.cursor=null;state.rowZoom=null;syncPresets();draw();syncFeatured()}
  /* Named jumps to the phases the report walks through, in place of the two
     datetime-local inputs the prototype had. Dragging on the plot still gives
     an arbitrary interval and the status line reads back whatever you land on,
     so only the typing is lost. */
  const PRESETS=[
    {label:'All',from:'2026-07-06T00:00Z',to:'2026-07-14T00:00Z',title:'The whole window, Jul 6 to 14'},
    {label:'Board forms',from:'2026-07-08T12:00Z',to:'2026-07-10T00:00Z',title:'Jul 8 to 10: agents discover the message board and start writing to it'},
    {label:'Credentials',from:'2026-07-10T00:00Z',to:'2026-07-11T06:00Z',title:'Jul 10 to 11: working Hugging Face credentials are found and shared'},
    {label:'Attack',from:'2026-07-11T00:00Z',to:'2026-07-12T12:00Z',title:'Jul 11 to 12: the arbitrary file read spreads and RCE follows'},
    {label:'Wind-down',from:'2026-07-12T00:00Z',to:'2026-07-14T00:00Z',title:'Jul 12 to 14: coordinators end and activity falls away'},
  ].map(preset=>{
    const base=new Date(DATA.windowStart);
    return {...preset,span:[clamp((new Date(preset.from)-base)/1000,0,total),clamp((new Date(preset.to)-base)/1000,0,total)]};
  });
  function syncPresets(){
    elements.presets.querySelectorAll('button').forEach(button=>{
      const span=PRESETS[Number(button.dataset.preset)].span;
      button.classList.toggle('active',Math.abs(span[0]-state.domain[0])<1&&Math.abs(span[1]-state.domain[1])<1);
    });
  }
  function agentAt(clientX,clientY){
    const rect=canvas.getBoundingClientRect(),m=plotMargins(),x=clientX-rect.left,y=clientY-rect.top;
    if(x<m.l||x>cssWidth-m.r||y<m.t||y>cssHeight-m.b)return null;
    let closest=null,distance=Infinity;
    lastRows.forEach(index=>{
      const agent=DATA.agents[index],left=xOf(Math.max(agent.start,state.domain[0]))-5,right=xOf(Math.min(agent.end,state.domain[1]))+5;
      if(x<left||x>right)return;
      const candidate=Math.abs(lastYByIndex.get(index)-y);
      if(candidate<distance){distance=candidate;closest=index}
    });
    const threshold=state.rowZoom===null?4:Math.max(6,(cssHeight-m.t-m.b)/lastRows.length/2);
    return distance<=threshold?closest:null;
  }
  function nearestVisibleAgent(clientY){
    const rect=canvas.getBoundingClientRect(),m=plotMargins(),y=clientY-rect.top;
    if(y<m.t||y>cssHeight-m.b)return null;
    return lastRows.reduce((closest,index)=>
      Math.abs(lastYByIndex.get(index)-y)<Math.abs(lastYByIndex.get(closest)-y)?index:closest
    );
  }
  function agentRowsBetween(y0,y1){
    const nearestPosition=y=>lastRows.reduce((closest,index,position)=>(
      Math.abs(lastYByIndex.get(index)-y)<Math.abs(lastYByIndex.get(lastRows[closest])-y)?position:closest
    ),0);
    const startPosition=nearestPosition(y0),endPosition=nearestPosition(y1);
    return lastRows.slice(Math.min(startPosition,endPosition),Math.max(startPosition,endPosition)+1);
  }
  function milestonesForAgent(index){
    const agent=DATA.agents[index],events=[
      {time:agent.start,title:'Run starts',detail:`${agent.family==='s'?'GPT-5.6 Sol':'HPIM'} agent begins`,kind:'circle',color:agent.family==='s'?COLORS.sol:COLORS.hpim},
      {time:agent.end,title:agent.end>=total?'Visible window ends':'Run ends',detail:agent.end>=total?'The run continues beyond the displayed window':'Last observed point in this run',kind:null,color:COLORS.gray},
    ];
    if(controls.board.checked&&agent.read!==null)events.push({time:agent.read,title:'First read / encountered message board',detail:'First reviewed exposure; the line changes from gray to gold',kind:'diamond',color:COLORS.gold});
    if(controls.board.checked&&agent.write!==null)events.push({time:agent.write,title:'First semantic message',detail:'First active-agent write milestone; the line changes to green',kind:'square',color:COLORS.green});
    if(controls.hf.checked&&agent.hfStart!==null){
      events.push({time:agent.hfStart,title:'Starts attacking Hugging Face',detail:'Verified attack participation begins; the line changes to red',kind:'circle',color:COLORS.red});
      if(agent.observedStop)events.push({time:agent.hfEnd,title:'No longer attacking Hugging Face',detail:'Observed or classified stopping point; the exact boundary is sometimes unclear',kind:'hollow-circle',color:COLORS.red});
    }
    return events;
  }
  function milestoneAt(index,x){
    let closest=null,distance=Infinity;
    milestonesForAgent(index).forEach(event=>{
      if(event.time<state.domain[0]||event.time>state.domain[1])return;
      const candidate=Math.abs(xOf(event.time)-x);
      if(candidate<distance){distance=candidate;closest=event}
    });
    return distance<=9?closest:null;
  }
  function stageAt(agent,time){
    const states=[];
    if(controls.hf.checked&&agent.hfStart!==null&&time>=agent.hfStart&&time<=agent.hfEnd)states.push('attacking Hugging Face');
    if(controls.board.checked&&agent.write!==null&&time>=agent.write)states.push('has written to the message board');
    else if(controls.board.checked&&agent.read!==null&&time>=agent.read)states.push('has read the message board');
    else states.push('before its first board event');
    return states.join(' · ');
  }
  function cursorAt(event){
    const rect=canvas.getBoundingClientRect(),m=plotMargins(),x=event.clientX-rect.left,y=event.clientY-rect.top;
    if(x<m.l||x>cssWidth-m.r||y<m.t||y>cssHeight-m.b)return null;
    const agent=agentAt(event.clientX,event.clientY);
    return {x,y,time:clamp(timeAt(x),state.domain[0],state.domain[1]),agent,event:agent===null?null:milestoneAt(agent,x)};
  }
  function drawCursor(ctx){
    if(state.cursor===null)return;
    const m=plotMargins(),x=xOf(state.cursor.time),label=timeLabel(state.cursor.time),textWidth=ctx.measureText(label).width;
    ctx.save();ctx.strokeStyle='rgba(70,70,70,.55)';ctx.lineWidth=.8;ctx.setLineDash([3,4]);ctx.beginPath();ctx.moveTo(x,m.t);ctx.lineTo(x,cssHeight-m.b);ctx.stroke();
    const labelX=clamp(x-textWidth/2-5,m.l,cssWidth-m.r-textWidth-10);
    ctx.fillStyle='rgba(255,255,255,.94)';ctx.fillRect(labelX,m.t+3,textWidth+10,18);ctx.strokeStyle='#777';ctx.setLineDash([]);ctx.strokeRect(labelX,m.t+3,textWidth+10,18);
    ctx.fillStyle='#333';ctx.font='11px system-ui';ctx.textAlign='left';ctx.fillText(label,labelX+5,m.t+16);
    if(state.cursor.agent!==null&&state.cursor.event!==null){
      const event=state.cursor.event,y=lastYByIndex.get(state.cursor.agent);ctx.strokeStyle=event.color;ctx.lineWidth=2;ctx.beginPath();ctx.arc(xOf(event.time),y,6,0,Math.PI*2);ctx.stroke();
    }
    ctx.restore();
  }
  function dragSelectionAxis(){
    if(state.drag===null)return null;
    const horizontalDistance=Math.abs(state.drag.x1-state.drag.x0),verticalDistance=Math.abs(state.drag.y1-state.drag.y0);
    if(Math.max(horizontalDistance,verticalDistance)<=12)return null;
    return horizontalDistance>=verticalDistance?'time':'agents';
  }
  function drawDragSelection(ctx){
    const axis=dragSelectionAxis();
    if(axis===null)return;
    const m=plotMargins();
    ctx.save();ctx.fillStyle='rgba(0,114,178,.13)';ctx.strokeStyle='rgba(0,92,145,.8)';ctx.lineWidth=1.2;ctx.setLineDash([5,3]);
    if(axis==='time'){
      const x0=clamp(state.drag.x0,m.l,cssWidth-m.r),x1=clamp(state.drag.x1,m.l,cssWidth-m.r);
      ctx.fillRect(Math.min(x0,x1),m.t,Math.abs(x1-x0),cssHeight-m.t-m.b);
      ctx.strokeRect(Math.min(x0,x1),m.t,Math.abs(x1-x0),cssHeight-m.t-m.b);
    }else{
      const y0=clamp(state.drag.y0,m.t,cssHeight-m.b),y1=clamp(state.drag.y1,m.t,cssHeight-m.b);
      ctx.fillRect(m.l,Math.min(y0,y1),cssWidth-m.l-m.r,Math.abs(y1-y0));
      ctx.strokeRect(m.l,Math.min(y0,y1),cssWidth-m.l-m.r,Math.abs(y1-y0));
    }
    ctx.restore();
  }
  function showTip(cursor){
    if(cursor===null||cursor.agent===null){tip.style.display='none';return;}
    const agent=DATA.agents[cursor.agent],heading=document.createElement('b'),details=document.createElement('span');
    if(cursor.event!==null){
      heading.textContent=cursor.event.title;
      details.textContent=`${agentLabel(cursor.agent)} · ${timeLabel(cursor.event.time)}`;
    }else{
      heading.textContent=agentLabel(cursor.agent);
      details.textContent=timeLabel(cursor.time);
    }
    tip.replaceChildren(heading,document.createElement('br'),details);
    const explanation=document.createElement('span');
    explanation.textContent=cursor.event?.detail??stageAt(agent,cursor.time);
    tip.append(document.createElement('br'),explanation);
    tip.style.display='block';
    const left=clamp(cursor.x+12,5,cssWidth-tip.offsetWidth-5),agentY=lastYByIndex.get(cursor.agent);
    const top=clamp(agentY-tip.offsetHeight-8,5,cssHeight-tip.offsetHeight-5);
    tip.style.left=left+'px';
    tip.style.top=top+'px';
  }
  function buildControls(){
    const hpimAgents=DATA.agents.filter(agent=>agent.family==='h').length;
    const solAgents=DATA.agents.length-hpimAgents;
    const positionedHf=DATA.agents.filter(agent=>agent.hfStart!==null).length;
    const positionedStops=DATA.agents.filter(agent=>agent.observedStop).length;
    elements.subtitle.textContent="What counts as participation in the Hugging Face attack is sometimes hard to define, and was determined by an AI agent grader. We often don't have good classifications for when agents stopped participating in the Hugging Face attack. Timings are based on approximate timestamps. Text in {braces} is paraphrased. The color of the starting dot indicates whether it was a GPT-5.6 Sol or HPIM agent. Agent lines that reach July 14th continue running beyond the end of this graph.";
    rebuildAgentOptions();
    PRESETS.forEach((preset,index)=>{
      const button=document.createElement('button');
      button.type='button';button.textContent=preset.label;button.title=preset.title;button.dataset.preset=index;
      button.addEventListener('click',()=>{
        state.domain=[...preset.span];
        cancelRowZoom();state.pinned=null;state.highlight=null;state.hover=null;state.rowZoom=null;
        syncPresets();draw();syncFeatured();
      });
      elements.presets.append(button);
    });
    const featured=elements.featured;
    DATA.featuredAgents.forEach(agentIndex=>{
      const button=document.createElement('button');
      button.type='button';button.textContent=agentLabel(agentIndex);button.dataset.agent=agentIndex;
      button.addEventListener('mouseenter',()=>setHighlight(agentIndex));
      button.addEventListener('mouseleave',()=>setHighlight(null));
      button.addEventListener('focus',()=>setHighlight(agentIndex));
      button.addEventListener('blur',()=>setHighlight(null));
      button.addEventListener('click',()=>focusAgent(agentIndex));
      featured.append(button);
    });
    const rail=elements.annotations;
    DATA.annotations.forEach((annotation,index)=>{
      const card=document.createElement('button');
      card.type='button';card.className='annotation '+annotation.kind;card.dataset.annotation=index;
      const title=document.createElement('b'),detail=document.createElement('span'),excerptText=annotation.paraphrase??annotation.quote;
      title.textContent=annotation.title;
      detail.className='annotation-detail';
      detail.textContent=annotationDetail(annotation);
      card.append(title);
      card.append(detail);
      if(excerptText){
        const splitQuotation=Boolean(annotation.hasOwnQuotationMarks);
        const excerpt=document.createElement(annotation.paraphrase||splitQuotation?'span':'q');
        excerpt.className=annotation.paraphrase?'paraphrase':splitQuotation?'quotation':'';
        excerpt.textContent=excerptText;
        card.append(excerpt);
      }
      card.addEventListener('mouseenter',()=>{state.annotationHover=index;draw()});
      card.addEventListener('mouseleave',()=>{state.annotationHover=null;draw()});
      card.addEventListener('focus',()=>{state.annotationHover=index;draw()});
      card.addEventListener('blur',()=>{state.annotationHover=null;draw()});
      /* The card already names an agent, so clicking it should take you to that
         agent's row rather than flip an unrelated filter. */
      card.addEventListener('click',()=>{state.annotationHover=null;focusAgent(annotation.agent)});
      rail.append(card);
    });
  }
  function annotationDetail(annotation){
    const handle=agentLabel(annotation.agent);
    const redundantHandle=annotation.title.toLocaleLowerCase().includes(handle.toLocaleLowerCase());
    const timestamp=(annotation.approximateTime?'~':'')+timeLabel(annotation.time);
    return [redundantHandle?null:handle,annotation.detail,timestamp].filter(Boolean).join(' · ');
  }
  function rebuildAgentOptions(){
    const options=elements.agentOptions,seen=new Set();options.replaceChildren();
    DATA.agents.forEach((agent,index)=>{
      [defaultAgentLabel(index),AGENT_HANDLES[index]].filter(Boolean).forEach(label=>{
        if(seen.has(label))return;seen.add(label);
        const option=document.createElement('option');option.value=label;option.dataset.index=index;options.append(option);
      });
    });
  }
  function syncFeatured(){elements.featured.querySelectorAll('button').forEach(b=>b.classList.toggle('active',Number(b.dataset.agent)===activeAgent()))}
  function syncLayerLegends(){
    root.querySelectorAll('.legend-board').forEach(item=>item.hidden=!controls.board.checked);
    root.querySelectorAll('.legend-hf').forEach(item=>item.hidden=!controls.hf.checked);
    elements.annotations.hidden=!controls.annotations.checked;
  }
  [controls.board,controls.hf,controls.annotations].forEach(control=>control.addEventListener('change',()=>{syncLayerLegends();draw()}));
  controls.knownOrAnnotated.addEventListener('change',draw);
  elements.sampleAgents.addEventListener('click',()=>{
    const requested=Number(elements.sampleSize.value);
    const candidates=DATA.agents.map((_,index)=>index).filter(index=>!controls.knownOrAnnotated.checked||isKnownOrAnnotated(index));
    if(!Number.isInteger(requested)||requested<1){elements.status.textContent='Choose a positive whole-number sample size.';return;}
    for(let index=candidates.length-1;index>0;index--){const swap=Math.floor(Math.random()*(index+1));[candidates[index],candidates[swap]]=[candidates[swap],candidates[index]]}
    state.subset=candidates.slice(0,Math.min(requested,candidates.length)).sort((a,b)=>a-b);
    cancelRowZoom();state.pinned=null;state.highlight=null;state.rowZoom=null;draw();syncFeatured();
  });
  elements.showAllAgents.addEventListener('click',()=>{state.subset=null;state.rowZoom=null;state.pinned=null;draw();syncFeatured()});
  elements.findAgent.addEventListener('click',()=>{
    const normalize=value=>value.trim().toLowerCase().replaceAll('[budget]','[big]'),value=normalize(elements.agentSearch.value);
    let index=DATA.agents.findIndex((_,agentIndex)=>normalize(defaultAgentLabel(agentIndex))===value||normalize(AGENT_HANDLES[agentIndex]??'')===value);
    if(index<0)index=DATA.agents.findIndex((_,agentIndex)=>normalize(AGENT_HANDLES[agentIndex]??'').includes(value));
    if(value&&index>=0){focusAgent(index);return;}
    elements.status.textContent=value?'No agent matched that label or handle.':'Enter an agent label or handle.';
  });
  elements.agentSearch.addEventListener('keydown',e=>{if(e.key==='Enter')elements.findAgent.click()});
  elements.resetView.addEventListener('click',resetView);
  elements.resetChip.addEventListener('click',resetView);
  canvas.addEventListener('pointermove',event=>{
    if(state.drag){
      state.cursor=null;state.drag.x1=event.offsetX;state.drag.y1=event.offsetY;
      const axis=dragSelectionAxis();canvas.style.cursor=axis==='time'?'ew-resize':axis==='agents'?'ns-resize':'crosshair';
      draw();return;
    }
    state.cursor=cursorAt(event);state.hover=state.cursor?.agent??null;
    if(event.pointerType==='mouse')showTip(state.cursor);
    draw();
  });
  canvas.addEventListener('pointerleave',()=>{hideScrollHint();if(state.drag)return;state.hover=null;state.cursor=null;tip.style.display='none';draw()});
  canvas.addEventListener('pointerdown',event=>{
    canvas.setPointerCapture(event.pointerId);
    canvas.style.cursor='crosshair';state.cursor=null;tip.style.display='none';state.drag={x0:event.offsetX,y0:event.offsetY,x1:event.offsetX,y1:event.offsetY};
  });
  canvas.addEventListener('pointerup',event=>{
    if(!state.drag)return;
    state.drag.x1=event.offsetX;state.drag.y1=event.offsetY;
    const axis=dragSelectionAxis(),drag=state.drag,m=plotMargins();state.drag=null;
    if(axis==='time'){
      const x0=clamp(drag.x0,m.l,cssWidth-m.r),x1=clamp(drag.x1,m.l,cssWidth-m.r);
      const a=timeAt(Math.min(x0,x1)),b=timeAt(Math.max(x0,x1));
      state.domain=[clamp(a,0,total),clamp(b,0,total)];
    }else if(axis==='agents'){
      const y0=clamp(drag.y0,m.t,cssHeight-m.b),y1=clamp(drag.y1,m.t,cssHeight-m.b);
      const selectedRows=agentRowsBetween(y0,y1),center=selectedRows[Math.floor(selectedRows.length/2)];
      cancelRowZoom();state.pinned=null;state.highlight=null;state.hover=null;state.rowZoom={center,count:selectedRows.length,anchorRatio:.5};
    }else{
      const index=agentAt(event.clientX,event.clientY);
      if(index!==null)focusAgent(index);
    }
    canvas.style.cursor='';tip.style.display='none';syncPresets();draw();syncFeatured();
  });
  canvas.addEventListener('pointercancel',()=>{state.drag=null;canvas.style.cursor='';draw()});
  canvas.addEventListener('dblclick',resetView);
  /* Zoom is behind a modifier so a plain scroll always belongs to the article.
     This figure is taller than the viewport, so without the gate a reader
     scrolling past it would have the page stop under them and the chart zoom
     instead. Unmodified wheels fall through to the page and show the hint. */
  canvas.addEventListener('wheel',e=>{
    if(!(e.ctrlKey||e.metaKey)){showScrollHint();return;}
    e.preventDefault();
    hideScrollHint();
    const rect=canvas.getBoundingClientRect(),currentSpan=state.domain[1]-state.domain[0],center=timeAt(e.clientX-rect.left);
    const rowCenter=nearestVisibleAgent(e.clientY),candidates=eligibleIndices();
    const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?cssHeight:1),factor=Math.exp(clamp(delta,-180,180)*.0018);
    const span=clamp(currentSpan*factor,1800,total),ratio=(center-state.domain[0])/currentSpan;
    const start=clamp(center-span*ratio,0,total-span);state.domain=[start,start+span];
    if(rowCenter!==null){
      const currentCount=lastRows.length,scaledCount=currentCount*factor;
      const nextCount=clamp(delta<0?Math.min(currentCount-1,Math.floor(scaledCount)):Math.max(currentCount+1,Math.ceil(scaledCount)),5,candidates.length);
      const margins=plotMargins(),anchorRatio=clamp((e.clientY-rect.top-margins.t)/(cssHeight-margins.t-margins.b),0,1);
      state.rowZoom=nextCount>=candidates.length?null:{center:rowCenter,count:nextCount,anchorRatio};
      if(state.rowZoom===null)state.pinned=null;
    }
    syncPresets();draw();syncFeatured();
  },{passive:false});
  canvas.addEventListener('keydown',event=>{
    const span=state.domain[1]-state.domain[0],center=(state.domain[0]+state.domain[1])/2;
    if(event.key==='Escape'){resetView();event.preventDefault();return;}
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
      const direction=event.key==='ArrowLeft'?-1:1;
      const start=clamp(state.domain[0]+direction*span*.1,0,total-span);
      state.domain=[start,start+span];
    }else if(event.key==='+'||event.key==='='||event.key==='-'){
      const nextSpan=clamp(span*(event.key==='-'?1.35:.74),1800,total);
      const start=clamp(center-nextSpan/2,0,total-nextSpan);
      state.domain=[start,start+nextSpan];
    }else{return;}
    event.preventDefault();syncPresets();draw();
  });

  new ResizeObserver(function(){setupCanvas();draw()}).observe(wrap);
  buildControls();syncLayerLegends();syncPresets();setupCanvas();draw();
  return {root:root,draw:draw,reset:resetView};
}

function mountAll(scope){
  (scope||document).querySelectorAll("[data-agent-timeline]").forEach(function(el){
    if(el.getAttribute("data-atl-mounted"))return;
    el.setAttribute("data-atl-mounted","1");
    createAgentTimeline(el);
  });
}

window.AgentTimeline={create:createAgentTimeline,mountAll:mountAll};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",function(){mountAll()});
else mountAll();
})();
