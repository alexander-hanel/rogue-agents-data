/*!
  * Bootstrap v5.3.8 (https://getbootstrap.com/)
  * Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e(require("@popperjs/core")):"function"==typeof define&&define.amd?define(["@popperjs/core"],e):(t="undefined"!=typeof globalThis?globalThis:t||self).bootstrap=e(t.Popper)}(this,function(t){"use strict";function e(t){const e=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(t)for(const i in t)if("default"!==i){const s=Object.getOwnPropertyDescriptor(t,i);Object.defineProperty(e,i,s.get?s:{enumerable:!0,get:()=>t[i]})}return e.default=t,Object.freeze(e)}const i=e(t),s=new Map,n={set(t,e,i){s.has(t)||s.set(t,new Map);const n=s.get(t);n.has(e)||0===n.size?n.set(e,i):console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(n.keys())[0]}.`)},get:(t,e)=>s.has(t)&&s.get(t).get(e)||null,remove(t,e){if(!s.has(t))return;const i=s.get(t);i.delete(e),0===i.size&&s.delete(t)}},o="transitionend",r=t=>(t&&window.CSS&&window.CSS.escape&&(t=t.replace(/#([^\s"#']+)/g,(t,e)=>`#${CSS.escape(e)}`)),t),a=t=>null==t?`${t}`:Object.prototype.toString.call(t).match(/\s([a-z]+)/i)[1].toLowerCase(),l=t=>{t.dispatchEvent(new Event(o))},c=t=>!(!t||"object"!=typeof t)&&(void 0!==t.jquery&&(t=t[0]),void 0!==t.nodeType),h=t=>c(t)?t.jquery?t[0]:t:"string"==typeof t&&t.length>0?document.querySelector(r(t)):null,d=t=>{if(!c(t)||0===t.getClientRects().length)return!1;const e="visible"===getComputedStyle(t).getPropertyValue("visibility"),i=t.closest("details:not([open])");if(!i)return e;if(i!==t){const e=t.closest("summary");if(e&&e.parentNode!==i)return!1;if(null===e)return!1}return e},u=t=>!t||t.nodeType!==Node.ELEMENT_NODE||!!t.classList.contains("disabled")||(void 0!==t.disabled?t.disabled:t.hasAttribute("disabled")&&"false"!==t.getAttribute("disabled")),_=t=>{if(!document.documentElement.attachShadow)return null;if("function"==typeof t.getRootNode){const e=t.getRootNode();return e instanceof ShadowRoot?e:null}return t instanceof ShadowRoot?t:t.parentNode?_(t.parentNode):null},g=()=>{},f=t=>{t.offsetHeight},m=()=>window.jQuery&&!document.body.hasAttribute("data-bs-no-jquery")?window.jQuery:null,p=[],b=()=>"rtl"===document.documentElement.dir,v=t=>{var e;e=()=>{const e=m();if(e){const i=t.NAME,s=e.fn[i];e.fn[i]=t.jQueryInterface,e.fn[i].Constructor=t,e.fn[i].noConflict=()=>(e.fn[i]=s,t.jQueryInterface)}},"loading"===document.readyState?(p.length||document.addEventListener("DOMContentLoaded",()=>{for(const t of p)t()}),p.push(e)):e()},y=(t,e=[],i=t)=>"function"==typeof t?t.call(...e):i,w=(t,e,i=!0)=>{if(!i)return void y(t);const s=(t=>{if(!t)return 0;let{transitionDuration:e,transitionDelay:i}=window.getComputedStyle(t);const s=Number.parseFloat(e),n=Number.parseFloat(i);return s||n?(e=e.split(",")[0],i=i.split(",")[0],1e3*(Number.parseFloat(e)+Number.parseFloat(i))):0})(e)+5;let n=!1;const r=({target:i})=>{i===e&&(n=!0,e.removeEventListener(o,r),y(t))};e.addEventListener(o,r),setTimeout(()=>{n||l(e)},s)},A=(t,e,i,s)=>{const n=t.length;let o=t.indexOf(e);return-1===o?!i&&s?t[n-1]:t[0]:(o+=i?1:-1,s&&(o=(o+n)%n),t[Math.max(0,Math.min(o,n-1))])},E=/[^.]*(?=\..*)\.|.*/,C=/\..*/,T=/::\d+$/,k={};let $=1;const S={mouseenter:"mouseover",mouseleave:"mouseout"},L=new Set(["click","dblclick","mouseup","mousedown","contextmenu","mousewheel","DOMMouseScroll","mouseover","mouseout","mousemove","selectstart","selectend","keydown","keypress","keyup","orientationchange","touchstart","touchmove","touchend","touchcancel","pointerdown","pointermove","pointerup","pointerleave","pointercancel","gesturestart","gesturechange","gestureend","focus","blur","change","reset","select","submit","focusin","focusout","load","unload","beforeunload","resize","move","DOMContentLoaded","readystatechange","error","abort","scroll"]);function O(t,e){return e&&`${e}::${$++}`||t.uidEvent||$++}function I(t){const e=O(t);return t.uidEvent=e,k[e]=k[e]||{},k[e]}function D(t,e,i=null){return Object.values(t).find(t=>t.callable===e&&t.delegationSelector===i)}function N(t,e,i){const s="string"==typeof e,n=s?i:e||i;let o=j(t);return L.has(o)||(o=t),[s,n,o]}function P(t,e,i,s,n){if("string"!=typeof e||!t)return;let[o,r,a]=N(e,i,s);if(e in S){const t=t=>function(e){if(!e.relatedTarget||e.relatedTarget!==e.delegateTarget&&!e.delegateTarget.contains(e.relatedTarget))return t.call(this,e)};r=t(r)}const l=I(t),c=l[a]||(l[a]={}),h=D(c,r,o?i:null);if(h)return void(h.oneOff=h.oneOff&&n);const d=O(r,e.replace(E,"")),u=o?function(t,e,i){return function s(n){const o=t.querySelectorAll(e);for(let{target:r}=n;r&&r!==this;r=r.parentNode)for(const a of o)if(a===r)return z(n,{delegateTarget:r}),s.oneOff&&F.off(t,n.type,e,i),i.apply(r,[n])}}(t,i,r):function(t,e){return function i(s){return z(s,{delegateTarget:t}),i.oneOff&&F.off(t,s.type,e),e.apply(t,[s])}}(t,r);u.delegationSelector=o?i:null,u.callable=r,u.oneOff=n,u.uidEvent=d,c[d]=u,t.addEventListener(a,u,o)}function x(t,e,i,s,n){const o=D(e[i],s,n);o&&(t.removeEventListener(i,o,Boolean(n)),delete e[i][o.uidEvent])}function M(t,e,i,s){const n=e[i]||{};for(const[o,r]of Object.entries(n))o.includes(s)&&x(t,e,i,r.callable,r.delegationSelector)}function j(t){return t=t.replace(C,""),S[t]||t}const F={on(t,e,i,s){P(t,e,i,s,!1)},one(t,e,i,s){P(t,e,i,s,!0)},off(t,e,i,s){if("string"!=typeof e||!t)return;const[n,o,r]=N(e,i,s),a=r!==e,l=I(t),c=l[r]||{},h=e.startsWith(".");if(void 0===o){if(h)for(const i of Object.keys(l))M(t,l,i,e.slice(1));for(const[i,s]of Object.entries(c)){const n=i.replace(T,"");a&&!e.includes(n)||x(t,l,r,s.callable,s.delegationSelector)}}else{if(!Object.keys(c).length)return;x(t,l,r,o,n?i:null)}},trigger(t,e,i){if("string"!=typeof e||!t)return null;const s=m();let n=null,o=!0,r=!0,a=!1;e!==j(e)&&s&&(n=s.Event(e,i),s(t).trigger(n),o=!n.isPropagationStopped(),r=!n.isImmediatePropagationStopped(),a=n.isDefaultPrevented());const l=z(new Event(e,{bubbles:o,cancelable:!0}),i);return a&&l.preventDefault(),r&&t.dispatchEvent(l),l.defaultPrevented&&n&&n.preventDefault(),l}};function z(t,e={}){for(const[i,s]of Object.entries(e))try{t[i]=s}catch(e){Object.defineProperty(t,i,{configurable:!0,get:()=>s})}return t}function H(t){if("true"===t)return!0;if("false"===t)return!1;if(t===Number(t).toString())return Number(t);if(""===t||"null"===t)return null;if("string"!=typeof t)return t;try{return JSON.parse(decodeURIComponent(t))}catch(e){return t}}function B(t){return t.replace(/[A-Z]/g,t=>`-${t.toLowerCase()}`)}const q={setDataAttribute(t,e,i){t.setAttribute(`data-bs-${B(e)}`,i)},removeDataAttribute(t,e){t.removeAttribute(`data-bs-${B(e)}`)},getDataAttributes(t){if(!t)return{};const e={},i=Object.keys(t.dataset).filter(t=>t.startsWith("bs")&&!t.startsWith("bsConfig"));for(const s of i){let i=s.replace(/^bs/,"");i=i.charAt(0).toLowerCase()+i.slice(1),e[i]=H(t.dataset[s])}return e},getDataAttribute:(t,e)=>H(t.getAttribute(`data-bs-${B(e)}`))};class W{static get Default(){return{}}static get DefaultType(){return{}}static get NAME(){throw new Error('You have to implement the static method "NAME", for each component!')}_getConfig(t){return t=this._mergeConfigObj(t),t=this._configAfterMerge(t),this._typeCheckConfig(t),t}_configAfterMerge(t){return t}_mergeConfigObj(t,e){const i=c(e)?q.getDataAttribute(e,"config"):{};return{...this.constructor.Default,..."object"==typeof i?i:{},...c(e)?q.getDataAttributes(e):{},..."object"==typeof t?t:{}}}_typeCheckConfig(t,e=this.constructor.DefaultType){for(const[i,s]of Object.entries(e)){const e=t[i],n=c(e)?"element":a(e);if(!new RegExp(s).test(n))throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${i}" provided type "${n}" but expected type "${s}".`)}}}class R extends W{constructor(t,e){super(),(t=h(t))&&(this._element=t,this._config=this._getConfig(e),n.set(this._element,this.constructor.DATA_KEY,this))}dispose(){n.remove(this._element,this.constructor.DATA_KEY),F.off(this._element,this.constructor.EVENT_KEY);for(const t of Object.getOwnPropertyNames(this))this[t]=null}_queueCallback(t,e,i=!0){w(t,e,i)}_getConfig(t){return t=this._mergeConfigObj(t,this._element),t=this._configAfterMerge(t),this._typeCheckConfig(t),t}static getInstance(t){return n.get(h(t),this.DATA_KEY)}static getOrCreateInstance(t,e={}){return this.getInstance(t)||new this(t,"object"==typeof e?e:null)}static get VERSION(){return"5.3.8"}static get DATA_KEY(){return`bs.${this.NAME}`}static get EVENT_KEY(){return`.${this.DATA_KEY}`}static eventName(t){return`${t}${this.EVENT_KEY}`}}const K=t=>{let e=t.getAttribute("data-bs-target");if(!e||"#"===e){let i=t.getAttribute("href");if(!i||!i.includes("#")&&!i.startsWith("."))return null;i.includes("#")&&!i.startsWith("#")&&(i=`#${i.split("#")[1]}`),e=i&&"#"!==i?i.trim():null}return e?e.split(",").map(t=>r(t)).join(","):null},V={find:(t,e=document.documentElement)=>[].concat(...Element.prototype.querySelectorAll.call(e,t)),findOne:(t,e=document.documentElement)=>Element.prototype.querySelector.call(e,t),children:(t,e)=>[].concat(...t.children).filter(t=>t.matches(e)),parents(t,e){const i=[];let s=t.parentNode.closest(e);for(;s;)i.push(s),s=s.parentNode.closest(e);return i},prev(t,e){let i=t.previousElementSibling;for(;i;){if(i.matches(e))return[i];i=i.previousElementSibling}return[]},next(t,e){let i=t.nextElementSibling;for(;i;){if(i.matches(e))return[i];i=i.nextElementSibling}return[]},focusableChildren(t){const e=["a","button","input","textarea","select","details","[tabindex]",'[contenteditable="true"]'].map(t=>`${t}:not([tabindex^="-"])`).join(",");return this.find(e,t).filter(t=>!u(t)&&d(t))},getSelectorFromElement(t){const e=K(t);return e&&V.findOne(e)?e:null},getElementFromSelector(t){const e=K(t);return e?V.findOne(e):null},getMultipleElementsFromSelector(t){const e=K(t);return e?V.find(e):[]}},Q=(t,e="hide")=>{const i=`click.dismiss${t.EVENT_KEY}`,s=t.NAME;F.on(document,i,`[data-bs-dismiss="${s}"]`,function(i){if(["A","AREA"].includes(this.tagName)&&i.preventDefault(),u(this))return;const n=V.getElementFromSelector(this)||this.closest(`.${s}`);t.getOrCreateInstance(n)[e]()})},X=".bs.alert",Y=`close${X}`,U=`closed${X}`;class G extends R{static get NAME(){return"alert"}close(){if(F.trigger(this._element,Y).defaultPrevented)return;this._element.classList.remove("show");const t=this._element.classList.contains("fade");this._queueCallback(()=>this._destroyElement(),this._element,t)}_destroyElement(){this._element.remove(),F.trigger(this._element,U),this.dispose()}static jQueryInterface(t){return this.each(function(){const e=G.getOrCreateInstance(this);if("string"==typeof t){if(void 0===e[t]||t.startsWith("_")||"constructor"===t)throw new TypeError(`No method named "${t}"`);e[t](this)}})}}Q(G,"close"),v(G);const J='[data-bs-toggle="button"]';class Z extends R{static get NAME(){return"button"}toggle(){this._element.setAttribute("aria-pressed",this._element.classList.toggle("active"))}static jQueryInterface(t){return this.each(function(){const e=Z.getOrCreateInstance(this);"toggle"===t&&e[t]()})}}F.on(document,"click.bs.button.data-api",J,t=>{t.preventDefault();const e=t.target.closest(J);Z.getOrCreateInstance(e).toggle()}),v(Z);const tt=".bs.swipe",et=`touchstart${tt}`,it=`touchmove${tt}`,st=`touchend${tt}`,nt=`pointerdown${tt}`,ot=`pointerup${tt}`,rt={endCallback:null,leftCallback:null,rightCallback:null},at={endCallback:"(function|null)",leftCallback:"(function|null)",rightCallback:"(function|null)"};class lt extends W{constructor(t,e){super(),this._element=t,t&&lt.isSupported()&&(this._config=this._getConfig(e),this._deltaX=0,this._supportPointerEvents=Boolean(window.PointerEvent),this._initEvents())}static get Default(){return rt}static get DefaultType(){return at}static get NAME(){return"swipe"}dispose(){F.off(this._element,tt)}_start(t){this._supportPointerEvents?this._eventIsPointerPenTouch(t)&&(this._deltaX=t.clientX):this._deltaX=t.touches[0].clientX}_end(t){this._eventIsPointerPenTouch(t)&&(this._deltaX=t.clientX-this._deltaX),this._handleSwipe(),y(this._config.endCallback)}_move(t){this._deltaX=t.touches&&t.touches.length>1?0:t.touches[0].clientX-this._deltaX}_handleSwipe(){const t=Math.abs(this._deltaX);if(t<=40)return;const e=t/this._deltaX;this._deltaX=0,e&&y(e>0?this._config.rightCallback:this._config.leftCallback)}_initEvents(){this._supportPointerEvents?(F.on(this._element,nt,t=>this._start(t)),F.on(this._element,ot,t=>this._end(t)),this._element.classList.add("pointer-event")):(F.on(this._element,et,t=>this._start(t)),F.on(this._element,it,t=>this._move(t)),F.on(this._element,st,t=>this._end(t)))}_eventIsPointerPenTouch(t){return this._supportPointerEvents&&("pen"===t.pointerType||"touch"===t.pointerType)}static isSupported(){return"ontouchstart"in document.documentElement||navigator.maxTouchPoints>0}}const ct=".bs.carousel",ht=".data-api",dt="ArrowLeft",ut="ArrowRight",_t="next",gt="prev",ft="left",mt="right",pt=`slide${ct}`,bt=`slid${ct}`,vt=`keydown${ct}`,yt=`mouseenter${ct}`,wt=`mouseleave${ct}`,At=`dragstart${ct}`,Et=`load${ct}${ht}`,Ct=`click${ct}${ht}`,Tt="carousel",kt="active",$t=".active",St=".carousel-item",Lt=$t+St,Ot={[dt]:mt,[ut]:ft},It={interval:5e3,keyboard:!0,pause:"hover",ride:!1,touch:!0,wrap:!0},Dt={interval:"(number|boolean)",keyboard:"boolean",pause:"(string|boolean)",ride:"(boolean|string)",touch:"boolean",wrap:"boolean"};class Nt extends R{constructor(t,e){super(t,e),this._interval=null,this._activeElement=null,this._isSliding=!1,this.touchTimeout=null,this._swipeHelper=null,this._indicatorsElement=V.findOne(".carousel-indicators",this._element),this._addEventListeners(),this._config.ride===Tt&&this.cycle()}static get Default(){return It}static get DefaultType(){return Dt}static get NAME(){return"carousel"}next(){this._slide(_t)}nextWhenVisible(){!document.hidden&&d(this._element)&&this.next()}prev(){this._slide(gt)}pause(){this._isSliding&&l(this._element),this._clearInterval()}cycle(){this._clearInterval(),this._updateInterval(),this._interval=setInterval(()=>this.nextWhenVisible(),this._config.interval)}_maybeEnableCycle(){this._config.ride&&(this._isSliding?F.one(this._element,bt,()=>this.cycle()):this.cycle())}to(t){const e=this._getItems();if(t>e.length-1||t<0)return;if(this._isSliding)return void F.one(this._element,bt,()=>this.to(t));const i=this._getItemIndex(this._getActive());if(i===t)return;const s=t>i?_t:gt;this._slide(s,e[t])}dispose(){this._swipeHelper&&this._swipeHelper.dispose(),super.dispose()}_configAfterMerge(t){return t.defaultInterval=t.interval,t}_addEventListeners(){this._config.keyboard&&F.on(this._element,vt,t=>this._keydown(t)),"hover"===this._config.pause&&(F.on(this._element,yt,()=>this.pause()),F.on(this._element,wt,()=>this._maybeEnableCycle())),this._config.touch&&lt.isSupported()&&this._addTouchEventListeners()}_addTouchEventListeners(){for(const t of V.find(".carousel-item img",this._element))F.on(t,At,t=>t.preventDefault());const t={leftCallback:()=>this._slide(this._directionToOrder(ft)),rightCallback:()=>this._slide(this._directionToOrder(mt)),endCallback:()=>{"hover"===this._config.pause&&(this.pause(),this.touchTimeout&&clearTimeout(this.touchTimeout),this.touchTimeout=setTimeout(()=>this._maybeEnableCycle(),500+this._config.interval))}};this._swipeHelper=new lt(this._element,t)}_keydown(t){if(/input|textarea/i.test(t.target.tagName))return;const e=Ot[t.key];e&&(t.preventDefault(),this._slide(this._directionToOrder(e)))}_getItemIndex(t){return this._getItems().indexOf(t)}_setActiveIndicatorElement(t){if(!this._indicatorsElement)return;const e=V.findOne($t,this._indicatorsElement);e.classList.remove(kt),e.removeAttribute("aria-current");const i=V.findOne(`[data-bs-slide-to="${t}"]`,this._indicatorsElement);i&&(i.classList.add(kt),i.setAttribute("aria-current","true"))}_updateInterval(){const t=this._activeElement||this._getActive();if(!t)return;const e=Number.parseInt(t.getAttribute("data-bs-interval"),10);this._config.interval=e||this._config.defaultInterval}_slide(t,e=null){if(this._isSliding)return;const i=this._getActive(),s=t===_t,n=e||A(this._getItems(),i,s,this._config.wrap);if(n===i)return;const o=this._getItemIndex(n),r=e=>F.trigger(this._element,e,{relatedTarget:n,direction:this._orderToDirection(t),from:this._getItemIndex(i),to:o});if(r(pt).defaultPrevented)return;if(!i||!n)return;const a=Boolean(this._interval);this.pause(),this._isSliding=!0,this._setActiveIndicatorElement(o),this._activeElement=n;const l=s?"carousel-item-start":"carousel-item-end",c=s?"carousel-item-next":"carousel-item-prev";n.classList.add(c),f(n),i.classList.add(l),n.classList.add(l),this._queueCallback(()=>{n.classList.remove(l,c),n.classList.add(kt),i.classList.remove(kt,c,l),this._isSliding=!1,r(bt)},i,this._isAnimated()),a&&this.cycle()}_isAnimated(){return this._element.classList.contains("slide")}_getActive(){return V.findOne(Lt,this._element)}_getItems(){return V.find(St,this._element)}_clearInterval(){this._interval&&(clearInterval(this._interval),this._interval=null)}_directionToOrder(t){return b()?t===ft?gt:_t:t===ft?_t:gt}_orderToDirection(t){return b()?t===gt?ft:mt:t===gt?mt:ft}static jQueryInterface(t){return this.each(function(){const e=Nt.getOrCreateInstance(this,t);if("number"!=typeof t){if("string"==typeof t){if(void 0===e[t]||t.startsWith("_")||"constructor"===t)throw new TypeError(`No method named "${t}"`);e[t]()}}else e.to(t)})}}F.on(document,Ct,"[data-bs-slide], [data-bs-slide-to]",function(t){const e=V.getElementFromSelector(this);if(!e||!e.classList.contains(Tt))return;t.preventDefault();const i=Nt.getOrCreateInstance(e),s=this.getAttribute("data-bs-slide-to");return s?(i.to(s),void i._maybeEnableCycle()):"next"===q.getDataAttribute(this,"slide")?(i.next(),void i._maybeEnableCycle()):(i.prev(),void i._maybeEnableCycle())}),F.on(window,Et,()=>{const t=V.find('[data-bs-ride="carousel"]');for(const e of t)Nt.getOrCreateInstance(e)}),v(Nt);const Pt=".bs.collapse",xt=`show${Pt}`,Mt=`shown${Pt}`,jt=`hide${Pt}`,Ft=`hidden${Pt}`,zt=`click${Pt}.data-api`,Ht="show",Bt="collapse",qt="collapsing",Wt=`:scope .${Bt} .${Bt}`,Rt='[data-bs-toggle="collapse"]',Kt={parent:null,toggle:!0},Vt={parent:"(null|element)",toggle:"boolean"};class Qt extends R{constructor(t,e){super(t,e),this._isTransitioning=!1,this._triggerArray=[];const i=V.find(Rt);for(const t of i){const e=V.getSelectorFromElement(t),i=V.find(e).filter(t=>t===this._element);null!==e&&i.length&&this._triggerArray.push(t)}this._initializeChildren(),this._config.parent||this._addAriaAndCollapsedClass(this._triggerArray,this._isShown()),this._config.toggle&&this.toggle()}static get Default(){return Kt}static get DefaultType(){return Vt}static get NAME(){return"collapse"}toggle(){this._isShown()?this.hide():this.show()}show(){if(this._isTransitioning||this._isShown())return;let t=[];if(this._config.parent&&(t=this._getFirstLevelChildren(".collapse.show, .collapse.collapsing").filter(t=>t!==this._element).map(t=>Qt.getOrCreateInstance(t,{toggle:!1}))),t.length&&t[0]._isTransitioning)return;if(F.trigger(this._element,xt).defaultPrevented)return;for(const e of t)e.hide();const e=this._getDimension();this._element.classList.remove(Bt),this._element.classList.add(qt),this._element.style[e]=0,this._addAriaAndCollapsedClass(this._triggerArray,!0),this._isTransitioning=!0;const i=`scroll${e[0].toUpperCase()+e.slice(1)}`;this._queueCallback(()=>{this._isTransitioning=!1,this._element.classList.remove(qt),this._element.classList.add(Bt,Ht),this._element.style[e]="",F.trigger(this._element,Mt)},this._element,!0),this._element.style[e]=`${this._element[i]}px`}hide(){if(this._isTransitioning||!this._isShown())return;if(F.trigger(this._element,jt).defaultPrevented)return;const t=this._getDimension();this._element.style[t]=`${this._element.getBoundingClientRect()[t]}px`,f(this._element),this._element.classList.add(qt),this._element.classList.remove(Bt,Ht);for(const t of this._triggerArray){const e=V.getElementFromSelector(t);e&&!this._isShown(e)&&this._addAriaAndCollapsedClass([t],!1)}this._isTransitioning=!0,this._element.style[t]="",this._queueCallback(()=>{this._isTransitioning=!1,this._element.classList.remove(qt),this._element.classList.add(Bt),F.trigger(this._element,Ft)},this._element,!0)}_isShown(t=this._element){return t.classList.contains(Ht)}_configAfterMerge(t){return t.toggle=Boolean(t.toggle),t.parent=h(t.parent),t}_getDimension(){return this._element.classList.contains("collapse-horizontal")?"width":"height"}_initializeChildren(){if(!this._config.parent)return;const t=this._getFirstLevelChildren(Rt);for(const e of t){const t=V.getElementFromSelector(e);t&&this._addAriaAndCollapsedClass([e],this._isShown(t))}}_getFirstLevelChildren(t){const e=V.find(Wt,this._config.parent);return V.find(t,this._config.parent).filter(t=>!e.includes(t))}_addAriaAndCollapsedClass(t,e){if(t.length)for(const i of t)i.classList.toggle("collapsed",!e),i.setAttribute("aria-expanded",e)}static jQueryInterface(t){const e={};return"string"==typeof t&&/show|hide/.test(t)&&(e.toggle=!1),this.each(function(){const i=Qt.getOrCreateInstance(this,e);if("string"==typeof t){if(void 0===i[t])throw new TypeError(`No method named "${t}"`);i[t]()}})}}F.on(document,zt,Rt,function(t){("A"===t.target.tagName||t.delegateTarget&&"A"===t.delegateTarget.tagName)&&t.preventDefault();for(const t of V.getMultipleElementsFromSelector(this))Qt.getOrCreateInstance(t,{toggle:!1}).toggle()}),v(Qt);const Xt="dropdown",Yt=".bs.dropdown",Ut=".data-api",Gt="ArrowUp",Jt="ArrowDown",Zt=`hide${Yt}`,te=`hidden${Yt}`,ee=`show${Yt}`,ie=`shown${Yt}`,se=`click${Yt}${Ut}`,ne=`keydown${Yt}${Ut}`,oe=`keyup${Yt}${Ut}`,re="show",ae='[data-bs-toggle="dropdown"]:not(.disabled):not(:disabled)',le=`${ae}.${re}`,ce=".dropdown-menu",he=b()?"top-end":"top-start",de=b()?"top-start":"top-end",ue=b()?"bottom-end":"bottom-start",_e=b()?"bottom-start":"bottom-end",ge=b()?"left-start":"right-start",fe=b()?"right-start":"left-start",me={autoClose:!0,boundary:"clippingParents",display:"dynamic",offset:[0,2],popperConfig:null,reference:"toggle"},pe={autoClose:"(boolean|string)",boundary:"(string|element)",display:"string",offset:"(array|string|function)",popperConfig:"(null|object|function)",reference:"(string|element|object)"};class be extends R{constructor(t,e){super(t,e),this._popper=null,this._parent=this._element.parentNode,this._menu=V.next(this._element,ce)[0]||V.prev(this._element,ce)[0]||V.findOne(ce,this._parent),this._inNavbar=this._detectNavbar()}static get Default(){return me}static get DefaultType(){return pe}static get NAME(){return Xt}toggle(){return this._isShown()?this.hide():this.show()}show(){if(u(this._element)||this._isShown())return;const t={relatedTarget:this._element};if(!F.trigger(this._element,ee,t).defaultPrevented){if(this._createPopper(),"ontouchstart"in document.documentElement&&!this._parent.closest(".navbar-nav"))for(const t of[].concat(...document.body.children))F.on(t,"mouseover",g);this._element.focus(),this._element.setAttribute("aria-expanded",!0),this._menu.classList.add(re),this._element.classList.add(re),F.trigger(this._element,ie,t)}}hide(){if(u(this._element)||!this._isShown())return;const t={relatedTarget:this._element};this._completeHide(t)}dispose(){this._popper&&this._popper.destroy(),super.dispose()}update(){this._inNavbar=this._detectNavbar(),this._popper&&this._popper.update()}_completeHide(t){if(!F.trigger(this._element,Zt,t).defaultPrevented){if("ontouchstart"in document.documentElement)for(const t of[].concat(...document.body.children))F.off(t,"mouseover",g);this._popper&&this._popper.destroy(),this._menu.classList.remove(re),this._element.classList.remove(re),this._element.setAttribute("aria-expanded","false"),q.removeDataAttribute(this._menu,"popper"),F.trigger(this._element,te,t)}}_getConfig(t){if("object"==typeof(t=super._getConfig(t)).reference&&!c(t.reference)&&"function"!=typeof t.reference.getBoundingClientRect)throw new TypeError(`${Xt.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);return t}_createPopper(){if(void 0===i)throw new TypeError("Bootstrap's dropdowns require Popper (https://popper.js.org/docs/v2/)");let t=this._element;"parent"===this._config.reference?t=this._parent:c(this._config.reference)?t=h(this._config.reference):"object"==typeof this._config.reference&&(t=this._config.reference);const e=this._getPopperConfig();this._popper=i.createPopper(t,this._menu,e)}_isShown(){return this._menu.classList.contains(re)}_getPlacement(){const t=this._parent;if(t.classList.contains("dropend"))return ge;if(t.classList.contains("dropstart"))return fe;if(t.classList.contains("dropup-center"))return"top";if(t.classList.contains("dropdown-center"))return"bottom";const e="end"===getComputedStyle(this._menu).getPropertyValue("--bs-position").trim();return t.classList.contains("dropup")?e?de:he:e?_e:ue}_detectNavbar(){return null!==this._element.closest(".navbar")}_getOffset(){const{offset:t}=this._config;return"string"==typeof t?t.split(",").map(t=>Number.parseInt(t,10)):"function"==typeof t?e=>t(e,this._element):t}_getPopperConfig(){const t={placement:this._getPlacement(),modifiers:[{name:"preventOverflow",options:{boundary:this._config.boundary}},{name:"offset",options:{offset:this._getOffset()}}]};return(this._inNavbar||"static"===this._config.display)&&(q.setDataAttribute(this._menu,"popper","static"),t.modifiers=[{name:"applyStyles",enabled:!1}]),{...t,...y(this._config.popperConfig,[void 0,t])}}_selectMenuItem({key:t,target:e}){const i=V.find(".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)",this._menu).filter(t=>d(t));i.length&&A(i,e,t===Jt,!i.includes(e)).focus()}static jQueryInterface(t){return this.each(function(){const e=be.getOrCreateInstance(this,t);if("string"==typeof t){if(void 0===e[t])throw new TypeError(`No method named "${t}"`);e[t]()}})}static clearMenus(t){if(2===t.button||"keyup"===t.type&&"Tab"!==t.key)return;const e=V.find(le);for(const i of e){const e=be.getInstance(i);if(!e||!1===e._config.autoClose)continue;const s=t.composedPath(),n=s.includes(e._menu);if(s.includes(e._element)||"inside"===e._config.autoClose&&!n||"outside"===e._config.autoClose&&n)continue;if(e._menu.contains(t.target)&&("keyup"===t.type&&"Tab"===t.key||/input|select|option|textarea|form/i.test(t.target.tagName)))continue;const o={relatedTarget:e._element};"click"===t.type&&(o.clickEvent=t),e._completeHide(o)}}static dataApiKeydownHandler(t){const e=/input|textarea/i.test(t.target.tagName),i="Escape"===t.key,s=[Gt,Jt].includes(t.key);if(!s&&!i)return;if(e&&!i)return;t.preventDefault();const n=this.matches(ae)?this:V.prev(this,ae)[0]||V.next(this,ae)[0]||V.findOne(ae,t.delegateTarget.parentNode),o=be.getOrCreateInstance(n);if(s)return t.stopPropagation(),o.show(),void o._selectMenuItem(t);o._isShown()&&(t.stopPropagation(),o.hide(),n.focus())}}F.on(document,ne,ae,be.dataApiKeydownHandler),F.on(document,ne,ce,be.dataApiKeydownHandler),F.on(document,se,be.clearMenus),F.on(document,oe,be.clearMenus),F.on(document,se,ae,function(t){t.preventDefault(),be.getOrCreateInstance(this).toggle()}),v(be);const ve="backdrop",ye="show",we=`mousedown.bs.${ve}`,Ae={className:"modal-backdrop",clickCallback:null,isAnimated:!1,isVisible:!0,rootElement:"body"},Ee={className:"string",clickCallback:"(function|null)",isAnimated:"boolean",isVisible:"boolean",rootElement:"(element|string)"};class Ce extends W{constructor(t){super(),this._config=this._getConfig(t),this._isAppended=!1,this._element=null}static get Default(){return Ae}static get DefaultType(){return Ee}static get NAME(){return ve}show(t){if(!this._config.isVisible)return void y(t);this._append();const e=this._getElement();this._config.isAnimated&&f(e),e.classList.add(ye),this._emulateAnimation(()=>{y(t)})}hide(t){this._config.isVisible?(this._getElement().classList.remove(ye),this._emulateAnimation(()=>{this.dispose(),y(t)})):y(t)}dispose(){this._isAppended&&(F.off(this._element,we),this._element.remove(),this._isAppended=!1)}_getElement(){if(!this._element){const t=document.createElement("div");t.className=this._config.className,this._config.isAnimated&&t.classList.add("fade"),this._element=t}return this._element}_configAfterMerge(t){return t.rootElement=h(t.rootElement),t}_append(){if(this._isAppended)return;const t=this._getElement();this._config.rootElement.append(t),F.on(t,we,()=>{y(this._config.clickCallback)}),this._isAppended=!0}_emulateAnimation(t){w(t,this._getElement(),this._config.isAnimated)}}const Te=".bs.focustrap",ke=`focusin${Te}`,$e=`keydown.tab${Te}`,Se="backward",Le={autofocus:!0,trapElement:null},Oe={autofocus:"boolean",trapElement:"element"};class Ie extends W{constructor(t){super(),this._config=this._getConfig(t),this._isActive=!1,this._lastTabNavDirection=null}static get Default(){return Le}static get DefaultType(){return Oe}static get NAME(){return"focustrap"}activate(){this._isActive||(this._config.autofocus&&this._config.trapElement.focus(),F.off(document,Te),F.on(document,ke,t=>this._handleFocusin(t)),F.on(document,$e,t=>this._handleKeydown(t)),this._isActive=!0)}deactivate(){this._isActive&&(this._isActive=!1,F.off(document,Te))}_handleFocusin(t){const{trapElement:e}=this._config;if(t.target===document||t.target===e||e.contains(t.target))return;const i=V.focusableChildren(e);0===i.length?e.focus():this._lastTabNavDirection===Se?i[i.length-1].focus():i[0].focus()}_handleKeydown(t){"Tab"===t.key&&(this._lastTabNavDirection=t.shiftKey?Se:"forward")}}const De=".fixed-top, .fixed-bottom, .is-fixed, .sticky-top",Ne=".sticky-top",Pe="padding-right",xe="margin-right";class Me{constructor(){this._element=document.body}getWidth(){const t=document.documentElement.clientWidth;return Math.abs(window.innerWidth-t)}hide(){const t=this.getWidth();this._disableOverFlow(),this._setElementAttributes(this._element,Pe,e=>e+t),this._setElementAttributes(De,Pe,e=>e+t),this._setElementAttributes(Ne,xe,e=>e-t)}reset(){this._resetElementAttributes(this._element,"overflow"),this._resetElementAttributes(this._element,Pe),this._resetElementAttributes(De,Pe),this._resetElementAttributes(Ne,xe)}isOverflowing(){return this.getWidth()>0}_disableOverFlow(){this._saveInitialAttribute(this._element,"overflow"),this._element.style.overflow="hidden"}_setElementAttributes(t,e,i){const s=this.getWidth();this._applyManipulationCallback(t,t=>{if(t!==this._element&&window.innerWidth>t.clientWidth+s)return;this._saveInitialAttribute(t,e);const n=window.getComputedStyle(t).getPropertyValue(e);t.style.setProperty(e,`${i(Number.parseFloat(n))}px`)})}_saveInitialAttribute(t,e){const i=t.style.getPropertyValue(e);i&&q.setDataAttribute(t,e,i)}_resetElementAttributes(t,e){this._applyManipulationCallback(t,t=>{const i=q.getDataAttribute(t,e);null!==i?(q.removeDataAttribute(t,e),t.style.setProperty(e,i)):t.style.removeProperty(e)})}_applyManipulationCallback(t,e){if(c(t))e(t);else for(const i of V.find(t,this._element))e(i)}}const je=".bs.modal",Fe=`hide${je}`,ze=`hidePrevented${je}`,He=`hidden${je}`,Be=`show${je}`,qe=`shown${je}`,We=`resize${je}`,Re=`click.dismiss${je}`,Ke=`mousedown.dismiss${je}`,Ve=`keydown.dismiss${je}`,Qe=`click${je}.data-api`,Xe="modal-open",Ye="show",Ue="modal-static",Ge={backdrop:!0,focus:!0,keyboard:!0},Je={backdrop:"(boolean|string)",focus:"boolean",keyboard:"boolean"};class Ze extends R{constructor(t,e){super(t,e),this._dialog=V.findOne(".modal-dialog",this._element),this._backdrop=this._initializeBackDrop(),this._focustrap=this._initializeFocusTrap(),this._isShown=!1,this._isTransitioning=!1,this._scrollBar=new Me,this._addEventListeners()}static get Default(){return Ge}static get DefaultType(){return Je}static get NAME(){return"modal"}toggle(t){return this._isShown?this.hide():this.show(t)}show(t){this._isShown||this._isTransitioning||F.trigger(this._element,Be,{relatedTarget:t}).defaultPrevented||(this._isShown=!0,this._isTransitioning=!0,this._scrollBar.hide(),document.body.classList.add(Xe),this._adjustDialog(),this._backdrop.show(()=>this._showElement(t)))}hide(){this._isShown&&!this._isTransitioning&&(F.trigger(this._element,Fe).defaultPrevented||(this._isShown=!1,this._isTransitioning=!0,this._focustrap.deactivate(),this._element.classList.remove(Ye),this._queueCallback(()=>this._hideModal(),this._element,this._isAnimated())))}dispose(){F.off(window,je),F.off(this._dialog,je),this._backdrop.dispose(),this._focustrap.deactivate(),super.dispose()}handleUpdate(){this._adjustDialog()}_initializeBackDrop(){return new Ce({isVisible:Boolean(this._config.backdrop),isAnimated:this._isAnimated()})}_initializeFocusTrap(){return new Ie({trapElement:this._element})}_showElement(t){document.body.contains(this._element)||document.body.append(this._element),this._element.style.display="block",this._element.removeAttribute("aria-hidden"),this._element.setAttribute("aria-modal",!0),this._element.setAttribute("role","dialog"),this._element.scrollTop=0;const e=V.findOne(".modal-body",this._dialog);e&&(e.scrollTop=0),f(this._element),this._element.classList.add(Ye),this._queueCallback(()=>{this._config.focus&&this._focustrap.activate(),this._isTransitioning=!1,F.trigger(this._element,qe,{relatedTarget:t})},this._dialog,this._isAnimated())}_addEventListeners(){F.on(this._element,Ve,t=>{"Escape"===t.key&&(this._config.keyboard?this.hide():this._triggerBackdropTransition())}),F.on(window,We,()=>{this._isShown&&!this._isTransitioning&&this._adjustDialog()}),F.on(this._element,Ke,t=>{F.one(this._element,Re,e=>{this._element===t.target&&this._element===e.target&&("static"!==this._config.backdrop?this._config.backdrop&&this.hide():this._triggerBackdropTransition())})})}_hideModal(){this._element.style.display="none",this._element.setAttribute("aria-hidden",!0),this._element.removeAttribute("aria-modal"),this._element.removeAttribute("role"),this._isTransitioning=!1,this._backdrop.hide(()=>{document.body.classList.remove(Xe),this._resetAdjustments(),this._scrollBar.reset(),F.trigger(this._element,He)})}_isAnimated(){return this._element.classList.contains("fade")}_triggerBackdropTransition(){if(F.trigger(this._element,ze).defaultPrevented)return;const t=this._element.scrollHeight>document.documentElement.clientHeight,e=this._element.style.overflowY;"hidden"===e||this._element.classList.contains(Ue)||(t||(this._element.style.overflowY="hidden"),this._element.classList.add(Ue),this._queueCallback(()=>{this._element.classList.remove(Ue),this._queueCallback(()=>{this._element.style.overflowY=e},this._dialog)},this._dialog),this._element.focus())}_adjustDialog(){const t=this._element.scrollHeight>document.documentElement.clientHeight,e=this._scrollBar.getWidth(),i=e>0;if(i&&!t){const t=b()?"paddingLeft":"paddingRight";this._element.style[t]=`${e}px`}if(!i&&t){const t=b()?"paddingRight":"paddingLeft";this._element.style[t]=`${e}px`}}_resetAdjustments(){this._element.style.paddingLeft="",this._element.style.paddingRight=""}static jQueryInterface(t,e){return this.each(function(){const i=Ze.getOrCreateInstance(this,t);if("string"==typeof t){if(void 0===i[t])throw new TypeError(`No method named "${t}"`);i[t](e)}})}}F.on(document,Qe,'[data-bs-toggle="modal"]',function(t){const e=V.getElementFromSelector(this);["A","AREA"].includes(this.tagName)&&t.preventDefault(),F.one(e,Be,t=>{t.defaultPrevented||F.one(e,He,()=>{d(this)&&this.focus()})});const i=V.findOne(".modal.show");i&&Ze.getInstance(i).hide(),Ze.getOrCreateInstance(e).toggle(this)}),Q(Ze),v(Ze);const ti=".bs.offcanvas",ei=".data-api",ii=`load${ti}${ei}`,si="show",ni="showing",oi="hiding",ri=".offcanvas.show",ai=`show${ti}`,li=`shown${ti}`,ci=`hide${ti}`,hi=`hidePrevented${ti}`,di=`hidden${ti}`,ui=`resize${ti}`,_i=`click${ti}${ei}`,gi=`keydown.dismiss${ti}`,fi={backdrop:!0,keyboard:!0,scroll:!1},mi={backdrop:"(boolean|string)",keyboard:"boolean",scroll:"boolean"};class pi extends R{constructor(t,e){super(t,e),this._isShown=!1,this._backdrop=this._initializeBackDrop(),this._focustrap=this._initializeFocusTrap(),this._addEventListeners()}static get Default(){return fi}static get DefaultType(){return mi}static get NAME(){return"offcanvas"}toggle(t){return this._isShown?this.hide():this.show(t)}show(t){this._isShown||F.trigger(this._element,ai,{relatedTarget:t}).defaultPrevented||(this._isShown=!0,this._backdrop.show(),this._config.scroll||(new Me).hide(),this._element.setAttribute("aria-modal",!0),this._element.setAttribute("role","dialog"),this._element.classList.add(ni),this._queueCallback(()=>{this._config.scroll&&!this._config.backdrop||this._focustrap.activate(),this._element.classList.add(si),this._element.classList.remove(ni),F.trigger(this._element,li,{relatedTarget:t})},this._element,!0))}hide(){this._isShown&&(F.trigger(this._element,ci).defaultPrevented||(this._focustrap.deactivate(),this._element.blur(),this._isShown=!1,this._element.classList.add(oi),this._backdrop.hide(),this._queueCallback(()=>{this._element.classList.remove(si,oi),this._element.removeAttribute("aria-modal"),this._element.removeAttribute("role"),this._config.scroll||(new Me).reset(),F.trigger(this._element,di)},this._element,!0)))}dispose(){this._backdrop.dispose(),this._focustrap.deactivate(),super.dispose()}_initializeBackDrop(){const t=Boolean(this._config.backdrop);return new Ce({className:"offcanvas-backdrop",isVisible:t,isAnimated:!0,rootElement:this._element.parentNode,clickCallback:t?()=>{"static"!==this._config.backdrop?this.hide():F.trigger(this._element,hi)}:null})}_initializeFocusTrap(){return new Ie({trapElement:this._element})}_addEventListeners(){F.on(this._element,gi,t=>{"Escape"===t.key&&(this._config.keyboard?this.hide():F.trigger(this._element,hi))})}static jQueryInterface(t){return this.each(function(){const e=pi.getOrCreateInstance(this,t);if("string"==typeof t){if(void 0===e[t]||t.startsWith("_")||"constructor"===t)throw new TypeError(`No method named "${t}"`);e[t](this)}})}}F.on(document,_i,'[data-bs-toggle="offcanvas"]',function(t){const e=V.getElementFromSelector(this);if(["A","AREA"].includes(this.tagName)&&t.preventDefault(),u(this))return;F.one(e,di,()=>{d(this)&&this.focus()});const i=V.findOne(ri);i&&i!==e&&pi.getInstance(i).hide(),pi.getOrCreateInstance(e).toggle(this)}),F.on(window,ii,()=>{for(const t of V.find(ri))pi.getOrCreateInstance(t).show()}),F.on(window,ui,()=>{for(const t of V.find("[aria-modal][class*=show][class*=offcanvas-]"))"fixed"!==getComputedStyle(t).position&&pi.getOrCreateInstance(t).hide()}),Q(pi),v(pi);const bi={"*":["class","dir","id","lang","role",/^aria-[\w-]*$/i],a:["target","href","title","rel"],area:[],b:[],br:[],col:[],code:[],dd:[],div:[],dl:[],dt:[],em:[],hr:[],h1:[],h2:[],h3:[],h4:[],h5:[],h6:[],i:[],img:["src","srcset","alt","title","width","height"],li:[],ol:[],p:[],pre:[],s:[],small:[],span:[],sub:[],sup:[],strong:[],u:[],ul:[]},vi=new Set(["background","cite","href","itemtype","longdesc","poster","src","xlink:href"]),yi=/^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:/?#]*(?:[/?#]|$))/i,wi=(t,e)=>{const i=t.nodeName.toLowerCase();return e.includes(i)?!vi.has(i)||Boolean(yi.test(t.nodeValue)):e.filter(t=>t instanceof RegExp).some(t=>t.test(i))},Ai={allowList:bi,content:{},extraClass:"",html:!1,sanitize:!0,sanitizeFn:null,template:"<div></div>"},Ei={allowList:"object",content:"object",extraClass:"(string|function)",html:"boolean",sanitize:"boolean",sanitizeFn:"(null|function)",template:"string"},Ci={entry:"(string|element|function|null)",selector:"(string|element)"};class Ti extends W{constructor(t){super(),this._config=this._getConfig(t)}static get Default(){return Ai}static get DefaultType(){return Ei}static get NAME(){return"TemplateFactory"}getContent(){return Object.values(this._config.content).map(t=>this._resolvePossibleFunction(t)).filter(Boolean)}hasContent(){return this.getContent().length>0}changeContent(t){return this._checkContent(t),this._config.content={...this._config.content,...t},this}toHtml(){const t=document.createElement("div");t.innerHTML=this._maybeSanitize(this._config.template);for(const[e,i]of Object.entries(this._config.content))this._setContent(t,i,e);const e=t.children[0],i=this._resolvePossibleFunction(this._config.extraClass);return i&&e.classList.add(...i.split(" ")),e}_typeCheckConfig(t){super._typeCheckConfig(t),this._checkContent(t.content)}_checkContent(t){for(const[e,i]of Object.entries(t))super._typeCheckConfig({selector:e,entry:i},Ci)}_setContent(t,e,i){const s=V.findOne(i,t);s&&((e=this._resolvePossibleFunction(e))?c(e)?this._putElementInTemplate(h(e),s):this._config.html?s.innerHTML=this._maybeSanitize(e):s.textContent=e:s.remove())}_maybeSanitize(t){return this._config.sanitize?function(t,e,i){if(!t.length)return t;if(i&&"function"==typeof i)return i(t);const s=(new window.DOMParser).parseFromString(t,"text/html"),n=[].concat(...s.body.querySelectorAll("*"));for(const t of n){const i=t.nodeName.toLowerCase();if(!Object.keys(e).includes(i)){t.remove();continue}const s=[].concat(...t.attributes),n=[].concat(e["*"]||[],e[i]||[]);for(const e of s)wi(e,n)||t.removeAttribute(e.nodeName)}return s.body.innerHTML}(t,this._config.allowList,this._config.sanitizeFn):t}_resolvePossibleFunction(t){return y(t,[void 0,this])}_putElementInTemplate(t,e){if(this._config.html)return e.innerHTML="",void e.append(t);e.textContent=t.textContent}}const ki=new Set(["sanitize","allowList","sanitizeFn"]),$i="fade",Si="show",Li=".tooltip-inner",Oi=".modal",Ii="hide.bs.modal",Di="hover",Ni="focus",Pi="click",xi={AUTO:"auto",TOP:"top",RIGHT:b()?"left":"right",BOTTOM:"bottom",LEFT:b()?"right":"left"},Mi={allowList:bi,animation:!0,boundary:"clippingParents",container:!1,customClass:"",delay:0,fallbackPlacements:["top","right","bottom","left"],html:!1,offset:[0,6],placement:"top",popperConfig:null,sanitize:!0,sanitizeFn:null,selector:!1,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',title:"",trigger:"hover focus"},ji={allowList:"object",animation:"boolean",boundary:"(string|element)",container:"(string|element|boolean)",customClass:"(string|function)",delay:"(number|object)",fallbackPlacements:"array",html:"boolean",offset:"(array|string|function)",placement:"(string|function)",popperConfig:"(null|object|function)",sanitize:"boolean",sanitizeFn:"(null|function)",selector:"(string|boolean)",template:"string",title:"(string|element|function)",trigger:"string"};class Fi extends R{constructor(t,e){if(void 0===i)throw new TypeError("Bootstrap's tooltips require Popper (https://popper.js.org/docs/v2/)");super(t,e),this._isEnabled=!0,this._timeout=0,this._isHovered=null,this._activeTrigger={},this._popper=null,this._templateFactory=null,this._newContent=null,this.tip=null,this._setListeners(),this._config.selector||this._fixTitle()}static get Default(){return Mi}static get DefaultType(){return ji}static get NAME(){return"tooltip"}enable(){this._isEnabled=!0}disable(){this._isEnabled=!1}toggleEnabled(){this._isEnabled=!this._isEnabled}toggle(){this._isEnabled&&(this._isShown()?this._leave():this._enter())}dispose(){clearTimeout(this._timeout),F.off(this._element.closest(Oi),Ii,this._hideModalHandler),this._element.getAttribute("data-bs-original-title")&&this._element.setAttribute("title",this._element.getAttribute("data-bs-original-title")),this._disposePopper(),super.dispose()}show(){if("none"===this._element.style.display)throw new Error("Please use show on visible elements");if(!this._isWithContent()||!this._isEnabled)return;const t=F.trigger(this._element,this.constructor.eventName("show")),e=(_(this._element)||this._element.ownerDocument.documentElement).contains(this._element);if(t.defaultPrevented||!e)return;this._disposePopper();const i=this._getTipElement();this._element.setAttribute("aria-describedby",i.getAttribute("id"));const{container:s}=this._config;if(this._element.ownerDocument.documentElement.contains(this.tip)||(s.append(i),F.trigger(this._element,this.constructor.eventName("inserted"))),this._popper=this._createPopper(i),i.classList.add(Si),"ontouchstart"in document.documentElement)for(const t of[].concat(...document.body.children))F.on(t,"mouseover",g);this._queueCallback(()=>{F.trigger(this._element,this.constructor.eventName("shown")),!1===this._isHovered&&this._leave(),this._isHovered=!1},this.tip,this._isAnimated())}hide(){if(this._isShown()&&!F.trigger(this._element,this.constructor.eventName("hide")).defaultPrevented){if(this._getTipElement().classList.remove(Si),"ontouchstart"in document.documentElement)for(const t of[].concat(...document.body.children))F.off(t,"mouseover",g);this._activeTrigger[Pi]=!1,this._activeTrigger[Ni]=!1,this._activeTrigger[Di]=!1,this._isHovered=null,this._queueCallback(()=>{this._isWithActiveTrigger()||(this._isHovered||this._disposePopper(),this._element.removeAttribute("aria-describedby"),F.trigger(this._element,this.constructor.eventName("hidden")))},this.tip,this._isAnimated())}}update(){this._popper&&this._popper.update()}_isWithContent(){return Boolean(this._getTitle())}_getTipElement(){return this.tip||(this.tip=this._createTipElement(this._newContent||this._getContentForTemplate())),this.tip}_createTipElement(t){const e=this._getTemplateFactory(t).toHtml();if(!e)return null;e.classList.remove($i,Si),e.classList.add(`bs-${this.constructor.NAME}-auto`);const i=(t=>{do{t+=Math.floor(1e6*Math.random())}while(document.getElementById(t));return t})(this.constructor.NAME).toString();return e.setAttribute("id",i),this._isAnimated()&&e.classList.add($i),e}setContent(t){this._newContent=t,this._isShown()&&(this._disposePopper(),this.show())}_getTemplateFactory(t){return this._templateFactory?this._templateFactory.changeContent(t):this._templateFactory=new Ti({...this._config,content:t,extraClass:this._resolvePossibleFunction(this._config.customClass)}),this._templateFactory}_getContentForTemplate(){return{[Li]:this._getTitle()}}_getTitle(){return this._resolvePossibleFunction(this._config.title)||this._element.getAttribute("data-bs-original-title")}_initializeOnDelegatedTarget(t){return this.constructor.getOrCreateInstance(t.delegateTarget,this._getDelegateConfig())}_isAnimated(){return this._config.animation||this.tip&&this.tip.classList.contains($i)}_isShown(){return this.tip&&this.tip.classList.contains(Si)}_createPopper(t){const e=y(this._config.placement,[this,t,this._element]),s=xi[e.toUpperCase()];return i.createPopper(this._element,t,this._getPopperConfig(s))}_getOffset(){const{offset:t}=this._config;return"string"==typeof t?t.split(",").map(t=>Number.parseInt(t,10)):"function"==typeof t?e=>t(e,this._element):t}_resolvePossibleFunction(t){return y(t,[this._element,this._element])}_getPopperConfig(t){const e={placement:t,modifiers:[{name:"flip",options:{fallbackPlacements:this._config.fallbackPlacements}},{name:"offset",options:{offset:this._getOffset()}},{name:"preventOverflow",options:{boundary:this._config.boundary}},{name:"arrow",options:{element:`.${this.constructor.NAME}-arrow`}},{name:"preSetPlacement",enabled:!0,phase:"beforeMain",fn:t=>{this._getTipElement().setAttribute("data-popper-placement",t.state.placement)}}]};return{...e,...y(this._config.popperConfig,[void 0,e])}}_setListeners(){const t=this._config.trigger.split(" ");for(const e of t)if("click"===e)F.on(this._element,this.constructor.eventName("click"),this._config.selector,t=>{const e=this._initializeOnDelegatedTarget(t);e._activeTrigger[Pi]=!(e._isShown()&&e._activeTrigger[Pi]),e.toggle()});else if("manual"!==e){const t=e===Di?this.constructor.eventName("mouseenter"):this.constructor.eventName("focusin"),i=e===Di?this.constructor.eventName("mouseleave"):this.constructor.eventName("focusout");F.on(this._element,t,this._config.selector,t=>{const e=this._initializeOnDelegatedTarget(t);e._activeTrigger["focusin"===t.type?Ni:Di]=!0,e._enter()}),F.on(this._element,i,this._config.selector,t=>{const e=this._initializeOnDelegatedTarget(t);e._activeTrigger["focusout"===t.type?Ni:Di]=e._element.contains(t.relatedTarget),e._leave()})}this._hideModalHandler=()=>{this._element&&this.hide()},F.on(this._element.closest(Oi),Ii,this._hideModalHandler)}_fixTitle(){const t=this._element.getAttribute("title");t&&(this._element.getAttribute("aria-label")||this._element.textContent.trim()||this._element.setAttribute("aria-label",t),this._element.setAttribute("data-bs-original-title",t),this._element.removeAttribute("title"))}_enter(){this._isShown()||this._isHovered?this._isHovered=!0:(this._isHovered=!0,this._setTimeout(()=>{this._isHovered&&this.show()},this._config.delay.show))}_leave(){this._isWithActiveTrigger()||(this._isHovered=!1,this._setTimeout(()=>{this._isHovered||this.hide()},this._config.delay.hide))}_setTimeout(t,e){clearTimeout(this._timeout),this._timeout=setTimeout(t,e)}_isWithActiveTrigger(){return Object.values(this._activeTrigger).includes(!0)}_getConfig(t){const e=q.getDataAttributes(this._element);for(const t of Object.keys(e))ki.has(t)&&delete e[t];return t={...e,..."object"==typeof t&&t?t:{}},t=this._mergeConfigObj(t),t=this._configAfterMerge(t),this._typeCheckConfig(t),t}_configAfterMerge(t){return t.container=!1===t.container?document.body:h(t.container),"number"==typeof t.delay&&(t.delay={show:t.delay,hide:t.delay}),"number"==typeof t.title&&(t.title=t.title.toString()),"number"==typeof t.content&&(t.content=t.content.toString()),t}_getDelegateConfig(){const t={};for(const[e,i]of Object.entries(this._config))this.constructor.Default[e]!==i&&(t[e]=i);return t.selector=!1,t.trigger="manual",t}_disposePopper(){this._popper&&(this._popper.destroy(),this._popper=null),this.tip&&(this.tip.remove(),this.tip=null)}static jQueryInterface(t){return this.each(function(){const e=Fi.getOrCreateInstance(this,t);if("string"==typeof t){if(void 0===e[t])throw new TypeError(`No method named "${t}"`);e[t]()}})}}v(Fi);const zi=".popover-header",Hi=".popover-body",Bi={...Fi.Default,content:"",offset:[0,8],placement:"right",template:'<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',trigger:"click"},qi={...Fi.DefaultType,content:"(null|string|element|function)"};class Wi extends Fi{static get Default(){return Bi}static get DefaultType(){return qi}static get NAME(){return"popover"}_isWithContent(){return this._getTitle()||this._getContent()}_getContentForTemplate(){return{[zi]:this._getTitle(),[Hi]:this._getContent()}}_getContent(){return this._resolvePossibleFunction(this._config.content)}static jQueryInterface(t){return this.each(function(){const e=Wi.getOrCreateInstance(this,t);if("string"==typeof t){if(void 0===e[t])throw new TypeError(`No method named "${t}"`);e[t]()}})}}v(Wi);const Ri=".bs.scrollspy",Ki=`activate${Ri}`,Vi=`click${Ri}`,Qi=`load${Ri}.data-api`,Xi="active",Yi="[href]",Ui=".nav-link",Gi=`${Ui}, .nav-item > ${Ui}, .list-group-item`,Ji={offset:null,rootMargin:"0px 0px -25%",smoothScroll:!1,target:null,threshold:[.1,.5,1]},Zi={offset:"(number|null)",rootMargin:"string",smoothScroll:"boolean",target:"element",threshold:"array"};class ts extends R{constructor(t,e){super(t,e),this._targetLinks=new Map,this._observableSections=new Map,this._rootElement="visible"===getComputedStyle(this._element).overflowY?null:this._element,this._activeTarget=null,this._observer=null,this._previousScrollData={visibleEntryTop:0,parentScrollTop:0},this.refresh()}static get Default(){return Ji}static get DefaultType(){return Zi}static get NAME(){return"scrollspy"}refresh(){this._initializeTargetsAndObservables(),this._maybeEnableSmoothScroll(),this._observer?this._observer.disconnect():this._observer=this._getNewObserver();for(const t of this._observableSections.values())this._observer.observe(t)}dispose(){this._observer.disconnect(),super.dispose()}_configAfterMerge(t){return t.target=h(t.target)||document.body,t.rootMargin=t.offset?`${t.offset}px 0px -30%`:t.rootMargin,"string"==typeof t.threshold&&(t.threshold=t.threshold.split(",").map(t=>Number.parseFloat(t))),t}_maybeEnableSmoothScroll(){this._config.smoothScroll&&(F.off(this._config.target,Vi),F.on(this._config.target,Vi,Yi,t=>{const e=this._observableSections.get(t.target.hash);if(e){t.preventDefault();const i=this._rootElement||window,s=e.offsetTop-this._element.offsetTop;if(i.scrollTo)return void i.scrollTo({top:s,behavior:"smooth"});i.scrollTop=s}}))}_getNewObserver(){const t={root:this._rootElement,threshold:this._config.threshold,rootMargin:this._config.rootMargin};return new IntersectionObserver(t=>this._observerCallback(t),t)}_observerCallback(t){const e=t=>this._targetLinks.get(`#${t.target.id}`),i=t=>{this._previousScrollData.visibleEntryTop=t.target.offsetTop,this._process(e(t))},s=(this._rootElement||document.documentElement).scrollTop,n=s>=this._previousScrollData.parentScrollTop;this._previousScrollData.parentScrollTop=s;for(const o of t){if(!o.isIntersecting){this._activeTarget=null,this._clearActiveClass(e(o));continue}const t=o.target.offsetTop>=this._previousScrollData.visibleEntryTop;if(n&&t){if(i(o),!s)return}else n||t||i(o)}}_initializeTargetsAndObservables(){this._targetLinks=new Map,this._observableSections=new Map;const t=V.find(Yi,this._config.target);for(const e of t){if(!e.hash||u(e))continue;const t=V.findOne(decodeURI(e.hash),this._element);d(t)&&(this._targetLinks.set(decodeURI(e.hash),e),this._observableSections.set(e.hash,t))}}_process(t){this._activeTarget!==t&&(this._clearActiveClass(this._config.target),this._activeTarget=t,t.classList.add(Xi),this._activateParents(t),F.trigger(this._element,Ki,{relatedTarget:t}))}_activateParents(t){if(t.classList.contains("dropdown-item"))V.findOne(".dropdown-toggle",t.closest(".dropdown")).classList.add(Xi);else for(const e of V.parents(t,".nav, .list-group"))for(const t of V.prev(e,Gi))t.classList.add(Xi)}_clearActiveClass(t){t.classList.remove(Xi);const e=V.find(`${Yi}.${Xi}`,t);for(const t of e)t.classList.remove(Xi)}static jQueryInterface(t){return this.each(function(){const e=ts.getOrCreateInstance(this,t);if("string"==typeof t){if(void 0===e[t]||t.startsWith("_")||"constructor"===t)throw new TypeError(`No method named "${t}"`);e[t]()}})}}F.on(window,Qi,()=>{for(const t of V.find('[data-bs-spy="scroll"]'))ts.getOrCreateInstance(t)}),v(ts);const es=".bs.tab",is=`hide${es}`,ss=`hidden${es}`,ns=`show${es}`,os=`shown${es}`,rs=`click${es}`,as=`keydown${es}`,ls=`load${es}`,cs="ArrowLeft",hs="ArrowRight",ds="ArrowUp",us="ArrowDown",_s="Home",gs="End",fs="active",ms="fade",ps="show",bs=".dropdown-toggle",vs=`:not(${bs})`,ys='[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]',ws=`.nav-link${vs}, .list-group-item${vs}, [role="tab"]${vs}, ${ys}`,As=`.${fs}[data-bs-toggle="tab"], .${fs}[data-bs-toggle="pill"], .${fs}[data-bs-toggle="list"]`;class Es extends R{constructor(t){super(t),this._parent=this._element.closest('.list-group, .nav, [role="tablist"]'),this._parent&&(this._setInitialAttributes(this._parent,this._getChildren()),F.on(this._element,as,t=>this._keydown(t)))}static get NAME(){return"tab"}show(){const t=this._element;if(this._elemIsActive(t))return;const e=this._getActiveElem(),i=e?F.trigger(e,is,{relatedTarget:t}):null;F.trigger(t,ns,{relatedTarget:e}).defaultPrevented||i&&i.defaultPrevented||(this._deactivate(e,t),this._activate(t,e))}_activate(t,e){t&&(t.classList.add(fs),this._activate(V.getElementFromSelector(t)),this._queueCallback(()=>{"tab"===t.getAttribute("role")?(t.removeAttribute("tabindex"),t.setAttribute("aria-selected",!0),this._toggleDropDown(t,!0),F.trigger(t,os,{relatedTarget:e})):t.classList.add(ps)},t,t.classList.contains(ms)))}_deactivate(t,e){t&&(t.classList.remove(fs),t.blur(),this._deactivate(V.getElementFromSelector(t)),this._queueCallback(()=>{"tab"===t.getAttribute("role")?(t.setAttribute("aria-selected",!1),t.setAttribute("tabindex","-1"),this._toggleDropDown(t,!1),F.trigger(t,ss,{relatedTarget:e})):t.classList.remove(ps)},t,t.classList.contains(ms)))}_keydown(t){if(![cs,hs,ds,us,_s,gs].includes(t.key))return;t.stopPropagation(),t.preventDefault();const e=this._getChildren().filter(t=>!u(t));let i;if([_s,gs].includes(t.key))i=e[t.key===_s?0:e.length-1];else{const s=[hs,us].includes(t.key);i=A(e,t.target,s,!0)}i&&(i.focus({preventScroll:!0}),Es.getOrCreateInstance(i).show())}_getChildren(){return V.find(ws,this._parent)}_getActiveElem(){return this._getChildren().find(t=>this._elemIsActive(t))||null}_setInitialAttributes(t,e){this._setAttributeIfNotExists(t,"role","tablist");for(const t of e)this._setInitialAttributesOnChild(t)}_setInitialAttributesOnChild(t){t=this._getInnerElement(t);const e=this._elemIsActive(t),i=this._getOuterElement(t);t.setAttribute("aria-selected",e),i!==t&&this._setAttributeIfNotExists(i,"role","presentation"),e||t.setAttribute("tabindex","-1"),this._setAttributeIfNotExists(t,"role","tab"),this._setInitialAttributesOnTargetPanel(t)}_setInitialAttributesOnTargetPanel(t){const e=V.getElementFromSelector(t);e&&(this._setAttributeIfNotExists(e,"role","tabpanel"),t.id&&this._setAttributeIfNotExists(e,"aria-labelledby",`${t.id}`))}_toggleDropDown(t,e){const i=this._getOuterElement(t);if(!i.classList.contains("dropdown"))return;const s=(t,s)=>{const n=V.findOne(t,i);n&&n.classList.toggle(s,e)};s(bs,fs),s(".dropdown-menu",ps),i.setAttribute("aria-expanded",e)}_setAttributeIfNotExists(t,e,i){t.hasAttribute(e)||t.setAttribute(e,i)}_elemIsActive(t){return t.classList.contains(fs)}_getInnerElement(t){return t.matches(ws)?t:V.findOne(ws,t)}_getOuterElement(t){return t.closest(".nav-item, .list-group-item")||t}static jQueryInterface(t){return this.each(function(){const e=Es.getOrCreateInstance(this);if("string"==typeof t){if(void 0===e[t]||t.startsWith("_")||"constructor"===t)throw new TypeError(`No method named "${t}"`);e[t]()}})}}F.on(document,rs,ys,function(t){["A","AREA"].includes(this.tagName)&&t.preventDefault(),u(this)||Es.getOrCreateInstance(this).show()}),F.on(window,ls,()=>{for(const t of V.find(As))Es.getOrCreateInstance(t)}),v(Es);const Cs=".bs.toast",Ts=`mouseover${Cs}`,ks=`mouseout${Cs}`,$s=`focusin${Cs}`,Ss=`focusout${Cs}`,Ls=`hide${Cs}`,Os=`hidden${Cs}`,Is=`show${Cs}`,Ds=`shown${Cs}`,Ns="hide",Ps="show",xs="showing",Ms={animation:"boolean",autohide:"boolean",delay:"number"},js={animation:!0,autohide:!0,delay:5e3};class Fs extends R{constructor(t,e){super(t,e),this._timeout=null,this._hasMouseInteraction=!1,this._hasKeyboardInteraction=!1,this._setListeners()}static get Default(){return js}static get DefaultType(){return Ms}static get NAME(){return"toast"}show(){F.trigger(this._element,Is).defaultPrevented||(this._clearTimeout(),this._config.animation&&this._element.classList.add("fade"),this._element.classList.remove(Ns),f(this._element),this._element.classList.add(Ps,xs),this._queueCallback(()=>{this._element.classList.remove(xs),F.trigger(this._element,Ds),this._maybeScheduleHide()},this._element,this._config.animation))}hide(){this.isShown()&&(F.trigger(this._element,Ls).defaultPrevented||(this._element.classList.add(xs),this._queueCallback(()=>{this._element.classList.add(Ns),this._element.classList.remove(xs,Ps),F.trigger(this._element,Os)},this._element,this._config.animation)))}dispose(){this._clearTimeout(),this.isShown()&&this._element.classList.remove(Ps),super.dispose()}isShown(){return this._element.classList.contains(Ps)}_maybeScheduleHide(){this._config.autohide&&(this._hasMouseInteraction||this._hasKeyboardInteraction||(this._timeout=setTimeout(()=>{this.hide()},this._config.delay)))}_onInteraction(t,e){switch(t.type){case"mouseover":case"mouseout":this._hasMouseInteraction=e;break;case"focusin":case"focusout":this._hasKeyboardInteraction=e}if(e)return void this._clearTimeout();const i=t.relatedTarget;this._element===i||this._element.contains(i)||this._maybeScheduleHide()}_setListeners(){F.on(this._element,Ts,t=>this._onInteraction(t,!0)),F.on(this._element,ks,t=>this._onInteraction(t,!1)),F.on(this._element,$s,t=>this._onInteraction(t,!0)),F.on(this._element,Ss,t=>this._onInteraction(t,!1))}_clearTimeout(){clearTimeout(this._timeout),this._timeout=null}static jQueryInterface(t){return this.each(function(){const e=Fs.getOrCreateInstance(this,t);if("string"==typeof t){if(void 0===e[t])throw new TypeError(`No method named "${t}"`);e[t](this)}})}}return Q(Fs),v(Fs),{Alert:G,Button:Z,Carousel:Nt,Collapse:Qt,Dropdown:be,Modal:Ze,Offcanvas:pi,Popover:Wi,ScrollSpy:ts,Tab:Es,Toast:Fs,Tooltip:Fi}});
//# sourceMappingURL=bootstrap.min.js.map
(function () {
  var menuTrigger = document.querySelector("#toggle-menu-main-mobile");

  if (menuTrigger !== null) {
    var body = document.querySelector("body");
    var menuContainer = document.querySelector("#menu-main-mobile");
    var menuContainerCenter = document.querySelector(".menu-main-mobile-center");
    var closeIcon = document.querySelector("#close-overlay");
    var hamburgerIcons = document.querySelectorAll(".hamburger");

    function toggleMobileMenu(e) {
      menuContainer.classList.toggle("open");
      hamburgerIcons.forEach((icon) => icon.classList.toggle("is-active"));
      menuTrigger.classList.toggle("open");
      body.classList.toggle("lock-scroll");
    }

    menuTrigger.addEventListener("click", (e) => toggleMobileMenu(e));

    function closeOverlay(e) {
      if (e.target === e.currentTarget) {
        toggleMobileMenu();
      }
    }

    menuContainerCenter.addEventListener("click", (e) => closeOverlay(e));
    closeIcon.addEventListener("click", (e) => toggleMobileMenu(e));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" || e.key == "Esc") {
        //if esc key was not pressed in combination with ctrl or alt or shift
        const isNotCombinedKey = !(e.ctrlKey || e.altKey || e.shiftKey);
        const menuIsOpen = menuContainer.classList.contains("open");
        if (isNotCombinedKey && menuIsOpen) {
          toggleMobileMenu(e);
        }
      }
    });
  }

  // Dropdown parent links with href="#" should not navigate
  document.querySelectorAll(".menu-main .dropdown-toggle-link").forEach((link) => {
    link.addEventListener("click", (e) => e.preventDefault());
  });

  // Auto-detect when nav items overflow and switch to hamburger menu
  var navContainer = document.querySelector(".nav-container");
  var menuMain = document.querySelector(".menu-main");

  if (navContainer && menuMain) {
    var flexContainer = navContainer.querySelector(".container-xxl");

    function checkNavOverflow() {
      // Switching modes changes the bar's height, and _header.scss eases height
      // changes. That easing is for the scroll shrink; on a resize it makes the
      // bar lag the layout and drag its bottom edge down across the page. Drop
      // the transition for the duration so the new height snaps in, the way it
      // did before height was animated.
      //
      // It has to come off before the measurement below, not after: that block
      // clears .nav-use-hamburger and then reads clientWidth, and the forced
      // layout is enough to start the transition then and there.
      var wasTransitioning = navContainer.classList.contains("nav-container-transitioner");
      if (wasTransitioning) {
        navContainer.classList.remove("nav-container-transitioner");
      }

      // Temporarily force desktop menu visible to measure it
      navContainer.classList.remove("nav-use-hamburger");
      menuMain.style.display = "block";
      menuMain.style.visibility = "hidden";
      menuMain.style.position = "absolute";

      var containerWidth = flexContainer.clientWidth;
      var contentWidth = 0;
      for (var i = 0; i < flexContainer.children.length; i++) {
        if (flexContainer.children[i].classList.contains("hamburger-trigger")) continue;
        contentWidth += flexContainer.children[i].offsetWidth;
      }

      // Clean up temporary styles
      menuMain.style.display = "";
      menuMain.style.visibility = "";
      menuMain.style.position = "";

      if (contentWidth + 40 > containerWidth) {
        navContainer.classList.add("nav-use-hamburger");
      }

      // --header-height should reflect the bar's resting height, not its
      // scrolled height — strip .nav-container-scrolled here too, or a resize
      // while scrolled would bake the shorter height in until the next resize.
      var wasScrolled = navContainer.classList.contains("nav-container-scrolled");
      if (wasScrolled) {
        navContainer.classList.remove("nav-container-scrolled");
      }
      document.documentElement.style.setProperty(
        "--header-height",
        navContainer.getBoundingClientRect().height + "px"
      );
      if (wasScrolled) {
        navContainer.classList.add("nav-container-scrolled");
      }

      if (wasTransitioning) {
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            navContainer.classList.add("nav-container-transitioner");
          });
        });
      }
    }

    checkNavOverflow();

    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(checkNavOverflow).observe(flexContainer);
    } else {
      window.addEventListener("resize", checkNavOverflow);
    }
  }
})();

const navContainer = document.querySelector(".nav-container");
if (navContainer) {
  // Read before any class is applied, so this is the tall (unscrolled) height.
  // hamburger.js runs ahead of this file, so the mobile/desktop mode is already
  // settled by now.
  let navHeight = navContainer.offsetHeight;

  // hamburger.js can swap the bar between its desktop and mobile heights when
  // the nav links stop fitting, so the threshold can't stay a load-time
  // measurement. Re-measuring in the resize handler would race it — that runs
  // off a ResizeObserver, which fires after the resize event — so just mark the
  // value stale and re-read it on the next scroll, by which point the mode has
  // settled. That also keeps it to one forced layout per resize rather than one
  // per scroll event.
  let navHeightStale = false;
  window.addEventListener("resize", function () { navHeightStale = true; }, { passive: true });

  // The thresholds are deliberately asymmetric: the bar shrinks once you've
  // scrolled past its own height, but only grows back at the very top of the
  // page. _header.scss animates that height change, so the grow-back sweeps
  // the bar's bottom edge down through the 60-90px band — and anywhere except
  // scrollY 0, that band holds page content the edge would cut through
  // mid-line. Restoring the tall bar only at 0 keeps the sweep over page
  // background.
  let toggleNavClass = function () {
    const scrollpos = window.scrollY;
    // Only readable while the bar is at full height; when it's shrunk we're
    // already past any threshold either mode would give, and it gets re-read on
    // the way back to the top.
    if (navHeightStale && !navContainer.classList.contains("nav-container-scrolled")) {
      navHeight = navContainer.offsetHeight;
      navHeightStale = false;
    }
    if (scrollpos >= navHeight) {
      navContainer.classList.add("nav-container-scrolled");
    } else if (scrollpos <= 0) {
      navContainer.classList.remove("nav-container-scrolled");
    }
  };

  window.addEventListener("scroll", toggleNavClass, { passive: true });
  toggleNavClass();

  // Enable transitions only once the initial state has been painted. Adding
  // the class in the same frame as `nav-container-scrolled` would let a page
  // loaded mid-scroll animate its height and color in from the tall state.
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      navContainer.classList.add("nav-container-transitioner");
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // toggle the search bar when the search trigger is pressed
  const searchTrigger = document.querySelector(".search-trigger");

  // add listener that toggles .active on .search-form
  if (searchTrigger) {
    searchTrigger.addEventListener("click", function () {
      const searchForm = document.querySelector(".search-form");
      searchForm.classList.toggle("active");
      if (searchForm.classList.contains("active")) {
        searchForm.querySelector('input[type="text"]').focus();
      }
    });
  }

  // Citation popup functionality
  const citationTrigger = document.querySelector(".citation-popup-trigger");
  const citationPopup = document.querySelector(".citation-popup");

  if (citationTrigger && citationPopup) {
    const closeBtn = citationPopup.querySelector(".citation-popup-close");
    const copyBtn = citationPopup.querySelector(".citation-copy-btn");
    const codeBlock = citationPopup.querySelector("code");

    function openPopup() {
      citationPopup.classList.add("active");
      citationTrigger.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }

    function closePopup() {
      citationPopup.classList.remove("active");
      citationTrigger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    // Open popup on trigger click
    citationTrigger.addEventListener("click", openPopup);

    // Close on close button click
    if (closeBtn) {
      closeBtn.addEventListener("click", closePopup);
    }

    // Close on backdrop click
    citationPopup.addEventListener("click", function (e) {
      if (e.target === citationPopup) {
        closePopup();
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && citationPopup.classList.contains("active")) {
        closePopup();
      }
    });

    // Copy functionality
    if (copyBtn && codeBlock) {
      copyBtn.addEventListener("click", function () {
        navigator.clipboard.writeText(codeBlock.innerText).then(function () {
          const icon = copyBtn.querySelector("i");
          icon.classList.replace("fa-clipboard", "fa-clipboard-check");
          copyBtn.classList.add("copied");

          setTimeout(function () {
            icon.classList.replace("fa-clipboard-check", "fa-clipboard");
            copyBtn.classList.remove("copied");
          }, 2000);
        }).catch(function () {});
      });
    }
  }

  const copyLinkBtn = document.querySelector(".copy-link-btn");
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener("click", function () {
      navigator.clipboard.writeText(window.location.href).then(function () {
        const icon = copyLinkBtn.querySelector("i");
        icon.classList.replace("fa-link", "fa-check");
        copyLinkBtn.classList.add("copied");

        setTimeout(function () {
          icon.classList.replace("fa-check", "fa-link");
          copyLinkBtn.classList.remove("copied");
        }, 2000);
      }).catch(function () {});
    });
  }

  // '/' keyboard shortcut for search
  const siteSearchInput = document.querySelector(".search-form input");
  const blogSearchInput = document.getElementById("blog-search-input");
  const searchTriggerForShortcut = document.querySelector(".search-trigger");

  document.addEventListener("keydown", function (e) {
    if (e.key !== "/") return;

    // Don't interfere with other input fields (except our search inputs)
    const activeEl = document.activeElement;
    const isInSiteSearch = siteSearchInput && activeEl === siteSearchInput;
    const isInBlogSearch = blogSearchInput && activeEl === blogSearchInput;
    const isInOtherInput = activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA" || activeEl.isContentEditable);

    if (isInOtherInput && !isInSiteSearch && !isInBlogSearch) {
      // User is typing in some other input, let '/' through
      return;
    }

    if (isInSiteSearch) {
      // Currently in site search
      if (siteSearchInput.value === "" && blogSearchInput) {
        // Empty and blog search exists - switch to blog search
        e.preventDefault();
        blogSearchInput.focus();
      }
      // If has content, let '/' type normally (don't prevent default)
      return;
    }

    if (isInBlogSearch) {
      // Currently in blog search
      if (blogSearchInput.value === "" && siteSearchInput && searchTriggerForShortcut) {
        // Empty and site search exists - switch to site search
        e.preventDefault();
        const searchForm = document.querySelector(".search-form");
        if (!searchForm.classList.contains("active")) {
          searchForm.classList.add("active");
        }
        siteSearchInput.focus();
      }
      // If has content, let '/' type normally (don't prevent default)
      return;
    }

    // Not in any search input - activate site search
    e.preventDefault();
    if (searchTriggerForShortcut) {
      searchTriggerForShortcut.click();
    }
  });
});

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).littlefoot={})}(this,(function(t){"use strict";var e=function(){return e=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var i in e=arguments[n])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t},e.apply(this,arguments)};function n(t,e){t.classList.add(e)}function r(t,e){t.classList.remove(e)}function i(t,e){return t.classList.contains(e)}"function"==typeof SuppressedError&&SuppressedError;var o,u={};function c(){if(o)return u;return o=1,Object.defineProperty(u,"__esModule",{value:!0}),u.getStyle=void 0,u.getStyle=function(t,e){var n,r=((null===(n=t.ownerDocument)||void 0===n?void 0:n.defaultView)||window).getComputedStyle(t);return r.getPropertyValue(e)||r[e]},u}var a,l=c(),s={};function f(){if(a)return s;a=1,Object.defineProperty(s,"__esModule",{value:!0}),s.pixels=void 0;var t=c(),e=96,n=25.4;function r(e){return e?(0,t.getStyle)(e,"fontSize")||r(e.parentElement):(0,t.getStyle)(window.document.documentElement,"fontSize")}return s.pixels=function t(i,o){var u,c,a=null!==(c=null===(u=null==o?void 0:o.ownerDocument)||void 0===u?void 0:u.defaultView)&&void 0!==c?c:window,l=a.document.documentElement||a.document.body,s=function(t){var e,n=t||"0",r=parseFloat(n),i=n.match(/[\d-.]+(\w+)$/);return[r,(null!==(e=null==i?void 0:i[1])&&void 0!==e?e:"").toLowerCase()]}(i),f=s[0];switch(s[1]){case"rem":return f*t(r(window.document.documentElement));case"em":return f*t(r(o),null==o?void 0:o.parentElement);case"in":return f*e;case"q":return f*e/n/4;case"mm":return f*e/n;case"cm":return f*e*10/n;case"pt":return f*e/72;case"pc":return f*e/6;case"vh":return(f*a.innerHeight||l.clientWidth)/100;case"vw":return(f*a.innerWidth||l.clientHeight)/100;case"vmin":return f*Math.min(a.innerWidth||l.clientWidth,a.innerHeight||l.clientHeight)/100;case"vmax":return f*Math.max(a.innerWidth||l.clientWidth,a.innerHeight||l.clientHeight)/100;default:return f}},s}var d=f(),v="littlefoot__tooltip";function m(t){var e=Number.parseFloat(l.getStyle(t,"marginLeft")),n=t.offsetWidth-e;return(t.getBoundingClientRect().left+n/2)/window.innerWidth}function p(t,e,i){var o=function(t,e){var n=Number.parseInt(l.getStyle(e,"marginTop"),10),r=2*n+e.offsetHeight,i=t.getBoundingClientRect().top+t.offsetHeight/2,o=window.innerHeight-i;return o>=r||o>=i?["below",o-n-15]:["above",i-n-15]}(e,t),u=o[0],c=o[1];if(i!==u){r(t,"is-"+i),n(t,"is-"+u);var a=100*m(e)+"%",s="above"===u?"100%":"0";t.style.transformOrigin=a+" "+s}return[u,c]}var h="is-active",g="is-changing",y="is-scrollable",b=function(t){return document.body.contains(t)};function w(t){var e=t.id,o=t.button,u=t.content,c=t.host,a=t.popover,s=t.wrapper,f=0,w="above";return{id:e,activate:function(t){var e;o.setAttribute("aria-expanded","true"),n(o,g),n(o,h),o.insertAdjacentElement("afterend",a),a.style.maxWidth=document.body.clientWidth+"px",e=u,f=Math.round(d.pixels(l.getStyle(e,"maxHeight"),e)),null==t||t(a,o)},dismiss:function(t){o.setAttribute("aria-expanded","false"),n(o,g),r(o,h),r(a,h),null==t||t(a,o)},isActive:function(){return i(o,h)},isReady:function(){return!i(o,g)},ready:function(){n(a,h),r(o,g)},remove:function(){a.remove(),r(o,g)},reposition:function(){if(b(a)){var t=p(a,o,w),e=t[0],i=t[1];w=e,u.style.maxHeight=Math.min(f,i)+"px",a.offsetHeight<u.scrollHeight?(n(a,y),u.setAttribute("tabindex","0")):(r(a,y),u.removeAttribute("tabindex"))}},resize:function(){b(a)&&(a.style.left=function(t,e){var n=t.offsetWidth;return-m(e)*n+Number.parseInt(l.getStyle(e,"marginLeft"),10)+e.offsetWidth/2}(u,o)+"px",s.style.maxWidth=u.offsetWidth+"px",function(t,e){var n=t.querySelector("."+v);n&&(n.style.left=100*m(e)+"%")}(a,o))},destroy:function(){return c.remove()}}}var E,S={};function x(){if(E)return S;return E=1,Object.defineProperty(S,"__esModule",{value:!0}),S.throttle=void 0,S.throttle=function(t,e){void 0===e&&(e=0);var n,r=0;return Object.assign((function(){for(var i=[],o=0;o<arguments.length;o++)i[o]=arguments[o];var u=Math.max(0,r+e-Date.now());u?(clearTimeout(n),n=setTimeout((function(){r=Date.now(),t.apply(void 0,i)}),u)):(r=Date.now(),t.apply(void 0,i))}),{cancel:function(){r=0,clearTimeout(n)}})},S}var D=x(),H="is-fully-scrolled",A=function(t){return function(e){var i=e.currentTarget,o=-e.deltaY;o>0&&r(t,H),i&&o<=0&&o<i.clientHeight+i.scrollTop-i.scrollHeight&&n(t,H)}};var T="littlefoot__content",_="littlefoot__wrapper",M="littlefoot--print",O=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];return t.forEach((function(t){return n(t,M)}))};function W(t,e){return Array.from(t.querySelectorAll(e))}function L(t,e){return t.querySelector("."+e)||t.firstElementChild||t}function C(t){var e=document.createElement("div");e.innerHTML=t;var n=e.firstElementChild;return n.remove(),n}function P(t){return void 0!==t}function j(t){var e=t.parentElement,n=W(e,":scope > :not(."+M+")"),r=n.filter((function(t){return"HR"===t.tagName}));n.length===r.length&&(O.apply(void 0,r.concat(e)),j(e))}function R(t,e){var n=t.parentElement;t.remove(),n&&n!==e&&!n.innerHTML.replace(/(\[\]|&nbsp;|\s)/g,"")&&R(n,e)}function z(t,e){var n=t[0],r=t[1],i=t[2],o=C(i.outerHTML);W(o,'[href$="#'+n+'"]').forEach((function(t){return R(t,o)}));var u=o.innerHTML.trim();return[r,i,{id:String(e+1),number:e+1,reference:"lf-"+n,content:u.startsWith("<")?u:"<p>"+u+"</p>"}]}function k(t){return function(e){return t.replace(/<%=?\s*(\w+?)\s*%>/g,(function(t,n){var r;return String(null!==(r=e[n])&&void 0!==r?r:"")}))}}function I(t,e){var n=k(t),r=k(e);return function(t){var e=t[0],i=t[1],o=i.id,u=C('<span class="littlefoot">'+n(i)+"</span>"),c=u.firstElementChild;c.setAttribute("aria-expanded","false"),c.dataset.footnoteButton="",c.dataset.footnoteId=o;var a=C(r(i));a.dataset.footnotePopover="",a.dataset.footnoteId=o;var l=L(a,_),s=L(a,T);return function(t,e){t.addEventListener("wheel",D.throttle(A(e),16))}(s,a),e.insertAdjacentElement("beforebegin",u),{id:o,button:c,host:u,popover:a,content:s,wrapper:l}}}function q(t){var n,i,o,u=t.allowDuplicates,c=t.anchorParentSelector,a=t.anchorPattern,l=t.buttonTemplate,s=t.contentTemplate,f=t.footnoteSelector,d=t.numberResetSelector,v=t.scope,m=function(t,e,n){return W(t,n+' a[href*="#"]').filter((function(t){return(t.href+t.rel).match(e)}))}(document,a,v).map(function(t,e,n,r){var i=[];return function(o){var u=o.href.split("#")[1],c=u?W(t,"#"+window.CSS.escape(u)).find((function(t){return e||!i.includes(t)})):void 0,a=null==c?void 0:c.closest(r);if(a){i.push(a);var l=o.closest(n)||o;return[l.id||o.id,l,a]}}}(document,u,c,f)).filter(P).map(z).map(d?(n=d,i=0,o=null,function(t){var r=t[0],u=t[1],c=t[2],a=r.closest(n);return i=o===a?i+1:1,o=a,[r,u,e(e({},c),{number:i})]}):function(t){return t}).map((function(t){var e=t[0],n=t[1],r=t[2];return O(e,n),j(n),[e,r]})).map(I(l,s)).map(w);return{footnotes:m,unmount:function(){m.forEach((function(t){return t.destroy()})),W(document,"."+M).forEach((function(t){return r(t,M)}))}}}var F="[data-footnote-id]",N=function(t,e){return t.target.closest(e)},B=function(t){return null==t?void 0:t.dataset.footnoteId},V=function(t){return function(e){e.preventDefault();var n=N(e,F),r=B(n);r&&t(r)}},U=document.addEventListener,Y=window.addEventListener,$=function(t,e,n,r){return U(t,(function(t){var r=t.target;(null==r?void 0:r.closest(e))&&n.call(r,t)}),r)};var G={activateDelay:100,activateOnHover:!1,allowDuplicates:!0,allowMultiple:!1,anchorParentSelector:"sup",anchorPattern:/(fn|footnote|note)[:\-_\d]/gi,dismissDelay:100,dismissOnUnhover:!1,dismissOnDocumentTouch:!0,footnoteSelector:"li",hoverDelay:250,numberResetSelector:"",scope:"",contentTemplate:'<aside class="littlefoot__popover" id="fncontent:<% id %>"><div class="'.concat(_,'"><div class="').concat(T,'"><% content %></div></div><div class="').concat(v,'"></div></aside>'),buttonTemplate:'<button class="littlefoot__button" id="<% reference %>" title="See Footnote <% number %>"><svg role="img" aria-labelledby="title-<% reference %>" viewbox="0 0 31 6" preserveAspectRatio="xMidYMid"><title id="title-<% reference %>">Footnote <% number %></title><circle r="3" cx="3" cy="3" fill="white"></circle><circle r="3" cx="15" cy="3" fill="white"></circle><circle r="3" cx="27" cy="3" fill="white"></circle></svg></button>'};function J(t){void 0===t&&(t={});var n=e(e({},G),t),r=function(t,e){var n,r=t.footnotes,i=t.unmount,o=function(t){return function(n){n.isReady()&&(n.dismiss(e.dismissCallback),setTimeout(n.remove,t))}},u=function(t){return function(n){e.allowMultiple||r.filter((function(t){return t.id!==n.id})).forEach(o(e.dismissDelay)),n.isReady()&&(n.activate(e.activateCallback),n.reposition(),n.resize(),setTimeout(n.ready,t))}},c=function(t){return function(e){var n=r.find((function(t){return t.id===e}));n&&t(n)}},a=function(){return r.forEach(o(e.dismissDelay))};return{activate:function(t,e){return c(u(e))(t)},dismiss:function(t,e){return c(o(e))(t)},dismissAll:a,touchOutside:function(){e.dismissOnDocumentTouch&&a()},repositionAll:function(){return r.forEach((function(t){return t.reposition()}))},resizeAll:function(){return r.forEach((function(t){return t.resize()}))},toggle:c((function(t){return t.isActive()?o(e.dismissDelay)(t):u(e.activateDelay)(t)})),hover:c((function(t){n=t.id,e.activateOnHover&&!t.isActive()&&u(e.hoverDelay)(t)})),unhover:c((function(t){t.id===n&&(n=null),e.dismissOnUnhover&&setTimeout((function(){return r.filter((function(t){return t.id!==n})).forEach(o(e.dismissDelay))}),e.hoverDelay)})),unmount:i}}(q(n),n),i=function(t){var e=function(e){var n=N(e,"[data-footnote-button]"),r=B(n);r?(e.preventDefault(),t.toggle(r)):N(e,"[data-footnote-popover]")||t.touchOutside()},n=D.throttle(t.repositionAll,16),r=D.throttle(t.resizeAll,16),i=V(t.hover),o=V(t.unhover),u=new AbortController,c={signal:u.signal};return U("touchend",e,c),U("click",e,c),U("keyup",(function(e){27!==e.keyCode&&"Escape"!==e.key&&"Esc"!==e.key||t.dismissAll()}),c),U("gestureend",n,c),Y("scroll",n,c),Y("resize",r,c),$("mouseover",F,i,c),$("mouseout",F,o,c),function(){u.abort()}}(r);return{activate:function(t,e){void 0===e&&(e=n.activateDelay),r.activate(t,e)},dismiss:function(t,e){void 0===e&&(e=n.dismissDelay),void 0===t?r.dismissAll():r.dismiss(t,e)},unmount:function(){i(),r.unmount()},getSetting:function(t){return n[t]},updateSetting:function(t,e){n[t]=e}}}t.default=J,t.littlefoot=J,Object.defineProperty(t,"__esModule",{value:!0})}));


function addIdsToHeaders() {
  const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

  const usedIds = new Set();

  headers.forEach(header => {
    // Headings inside an embedded component are its own titles, not part of the
    // document outline; giving them slugs lets them claim an id a real section
    // wanted, which would quietly break links to that section.
    if (header.closest('.js-toc-ignore')) return;

    // Skip if the header already has an ID
    if (header.id) {
      usedIds.add(header.id);
      return;
    }

    let text = header.textContent.trim();
    let slug = slugify(text);

    let uniqueSlug = slug;
    let counter = 2;

    while (usedIds.has(uniqueSlug)) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    header.id = uniqueSlug;
    usedIds.add(uniqueSlug);
  });

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
      .trim();                  // Trim leading/trailing whitespace
  }
}

function openContentByHeaderId(headerId) {
  const headerElement = document.getElementById(headerId);
  if (!headerElement) return;

  // Open any ancestor <details> elements that are closed
  let el = headerElement;
  while (el) {
    if (el.tagName === 'DETAILS' && !el.open) {
      el.open = true;
    }
    el = el.parentElement;
  }

  if (headerElement.closest('.color-box')) {
    const colorBox = headerElement.closest('.color-box');

    const content = colorBox.querySelector('.box-content');
    const button = colorBox.querySelector('.toggle-btn');

    // Only open if it's currently closed
    if (content.style.maxHeight === '0px' || !content.style.maxHeight) {
      content.style.paddingTop = '10px';
      content.style.paddingBottom = '10px';

      // Force a reflow before changing max-height
      void content.offsetWidth;

      // Set max-height to scrollHeight to enable animation
      content.style.maxHeight = content.scrollHeight + 'px';
      button.textContent = '-';
    }
  }
}

// A function to run after littlefoot has reinterpreted the footnotes, to mark the last footnote in each group so we can apply
// slightly more margin-right to it
function markLastFootnotesInGroupsByParagraph() {
  const paragraphs = document.querySelectorAll('p');

  paragraphs.forEach(paragraph => {
    const footnoteButtons = paragraph.querySelectorAll('.littlefoot__button');
    if (footnoteButtons.length === 0) return;

    let currentGroup = [];
    let groups = [];

    // Process footnotes within this paragraph
    for (let i = 0; i < footnoteButtons.length; i++) {
      const currentButton = footnoteButtons[i];
      const currentSpan = currentButton.closest('.littlefoot');
      const nextSibling = currentSpan.nextSibling.nextSibling;

      // Add current footnote to the current group
      currentGroup.push(currentButton);

      // Check if this is the last footnote or if there's significant content between this and next footnote
      const isLastFootnote = (i === footnoteButtons.length - 1);
      const hasTextBetween = nextSibling &&
                            nextSibling.nodeType === Node.TEXT_NODE &&
                            nextSibling.textContent.trim().length > 0;

      // If this is the end of a group, save the group and start a new one
      if (isLastFootnote || hasTextBetween) {
        groups.push([...currentGroup]);
        currentGroup = [];
      }
    }

    // Add the class to the last footnote in each group
    groups.forEach(group => {
      if (group.length > 0) {
        const lastFootnoteInGroup = group[group.length - 1];
        lastFootnoteInGroup.classList.add('last-footnote-of-group');
      }
    });
  });
}

function addSpacesBetweenFootnotes() {
  const footnoteButtons = document.querySelectorAll('.littlefoot__button');

  for (let i = 0; i < footnoteButtons.length; i++) {
    const currentButton = footnoteButtons[i];

    const currentSpan = currentButton.closest('.littlefoot');

    // Check if there's a next sibling that's also a footnote
    if (currentSpan && currentSpan.nextElementSibling.nextElementSibling &&
        currentSpan.nextElementSibling.nextElementSibling.classList.contains('littlefoot')) {

      // Add a space between (there might already be one, but this makes sure, and adding
      // multiple spaces is fine because HTML compacts them into one)
      const space = document.createTextNode(' ');
      currentSpan.parentNode.insertBefore(space, currentSpan.nextElementSibling);
    }
  }
}

/* If a footnote reference is immediately followed by a comma, and it happens to be at the start of a line, then when it's hovered and the footnote appears, this adds a space that the browser decides it could wrap with, which can cause the footnote reference to move to the end of the previous line, which no longer has the hover state, so it switches back and forth rapidly and the footnote is unreadable. So, we wrap the footnote reference and the comma in a <span class="nowrap"> to prevent line breaks between them, and we also include the previous word because that's what the footnote is actually referring to. */
function wrapFootnotesPrecedingCommasInNoWrapSpans() {
  const footnoteSpans = document.querySelectorAll('.littlefoot');

  footnoteSpans.forEach((footnoteSpan) => {
    // Each .littlefoot span is followed by a <sup class="littlefoot--print"> element
    const supElement = footnoteSpan.nextElementSibling;
    const nextSibling = supElement.nextSibling;

    if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE) {
      const text = nextSibling.textContent;
      const match = text.match(/^(\s*,)/);

      if (match) {
        const commaWithSpace = match[1];
        const remainingText = text.slice(commaWithSpace.length);

        const noWrapSpan = document.createElement('span');
        noWrapSpan.className = 'nowrap';

        const prevSibling = footnoteSpan.previousSibling;
        let lastWord = '';
        if (prevSibling && prevSibling.nodeType === Node.TEXT_NODE) {
          const prevText = prevSibling.textContent;
          const lastWordMatch = prevText.match(/(\S+)$/);

          if (lastWordMatch) {
            lastWord = lastWordMatch[1];
            prevSibling.textContent = prevText.slice(0, -lastWord.length);
          }
        }

        footnoteSpan.parentNode.insertBefore(noWrapSpan, footnoteSpan);

        if (lastWord) {
          noWrapSpan.appendChild(document.createTextNode(lastWord));
        }
        noWrapSpan.appendChild(footnoteSpan);
        noWrapSpan.appendChild(supElement);
        noWrapSpan.appendChild(document.createTextNode(commaWithSpace));

        nextSibling.textContent = remainingText;
      }
    }
  });
}

// Littlefoot and Jekyll don't handle the numbering of footnotes with multiple references well.
// This is a hack to make the numbers display correctly. It works in conjunction with the buttonTemplate
// used in the Littlefoot call in _layouts/default.html
function transformFootnoteReferences() {
  const elements = document.querySelectorAll('.fn-ref-raw');
  elements.forEach(element => {
    const text = element.textContent;
    const match = text.match(/\[lf-fnref:(\d+):?\d*\]/);

    if (match) {
      const number = match[1];
      element.textContent = `[${number}]`;
      element.classList.remove('fn-ref-raw');
      element.classList.add('fn-ref-done');
    }
  });
}

function scrollDownToFootnotesOnClick() {
  const footnoteLinks = document.querySelectorAll('.littlefoot__button');
  footnoteLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const footnoteId = link.id;
      // Transform things like "lf-fnref:17" to "fn:17"
      const footnoteIdMatch = footnoteId.match(/lf-fnref-(\d+)/);
      const footnote = document.getElementById(`fn:${footnoteIdMatch[1]}`);
      if (footnote) {
        footnote.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function calculateNaturalHeight(content) {
  const prevMaxHeight = content.style.maxHeight;
  const prevOpacity = content.style.opacity;
  content.style.maxHeight = 'none';
  content.style.opacity = '1';
  const naturalHeight = content.scrollHeight || 0;
  content.style.maxHeight = prevMaxHeight;
  content.style.opacity = prevOpacity;
  return naturalHeight;
}

// Smooth animation for details/summary elements
function initSmoothDetails() {
  const detailsElements = document.querySelectorAll('details');

  detailsElements.forEach(details => {
    const summary = details.querySelector('summary');
    const content = details.querySelector('.detail-indented');

    if (!summary || !content) return;

    // Check if this details should be open based on URL hash
    const summaryId = summary.id;
    let shouldBeOpen = summaryId && window.location.hash === '#' + summaryId;

    // Also check if any element inside this details has the hash ID
    if (!shouldBeOpen && window.location.hash) {
      try {
        const targetElement = details.querySelector(window.location.hash);
        if (targetElement) {
          shouldBeOpen = true;
        }
      } catch (e) {}
    }

    if (shouldBeOpen || details.open) {
      // Open first, then measure: a closed <details> doesn't render its
      // non-summary children, so an earlier measurement returns 0.
      details.open = true;
      const naturalHeight = calculateNaturalHeight(content);
      content.style.maxHeight = naturalHeight + 'px';
      content.style.opacity = '1';

      if (shouldBeOpen) {
        setTimeout(() => {
          try {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
              targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          } catch (e) {}
        }, 100);
      }
    } else {
      details.open = false;
      content.style.maxHeight = '0px';
      content.style.opacity = '0';
    }

    summary.addEventListener('click', (e) => {
      e.preventDefault();

      if (!details.open) {
        // Open first: a closed <details> doesn't render its non-summary
        // children, so measuring before opening yields scrollHeight 0.
        details.open = true;
        const naturalHeight = calculateNaturalHeight(content);
        content.style.maxHeight = naturalHeight + 'px';
        content.style.opacity = '1';
      } else {
        content.style.maxHeight = '0px';
        content.style.opacity = '0';

        setTimeout(() => {
          details.open = false;
        }, 300);
      }
    });
  });

  window.addEventListener('resize', () => {
    const detailsElements = document.querySelectorAll('details');
    detailsElements.forEach(details => {
      const content = details.querySelector('.detail-indented');
      if (details.open && content) {
        const naturalHeight = calculateNaturalHeight(content);
        content.style.maxHeight = naturalHeight + 'px';
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', initSmoothDetails);

// Carousel scroll arrow buttons
function initCarouselScrollArrows() {
  document.querySelectorAll('.scrollable-container').forEach(container => {
    const scrollable = container.querySelector('.scrollable');
    const leftBtn = container.querySelector('.scroll-left');
    const rightBtn = container.querySelector('.scroll-right');
    if (!scrollable || !leftBtn || !rightBtn) return;

    const scrollAmount = 240;

    leftBtn.addEventListener('click', () => {
      scrollable.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    rightBtn.addEventListener('click', () => {
      scrollable.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    function updateArrowVisibility() {
      var isScrollable = scrollable.scrollWidth > scrollable.clientWidth;
      if (!isScrollable) {
        leftBtn.classList.add('hidden');
        rightBtn.classList.add('hidden');
        return;
      }
      leftBtn.classList.toggle('hidden', scrollable.scrollLeft <= 0);
      rightBtn.classList.toggle('hidden',
        scrollable.scrollLeft + scrollable.clientWidth >= scrollable.scrollWidth - 2);
    }

    scrollable.addEventListener('scroll', updateArrowVisibility);
    window.addEventListener('resize', updateArrowVisibility);
    updateArrowVisibility();

    // If this container is inside a collapsed <details>, it has zero
    // dimensions at load time and both arrows get hidden. Re-measure when
    // any ancestor <details> is expanded so the arrows reflect real size.
    // Walk all ancestors (not just the closest) to handle nested details,
    // e.g. an Appendix details nested inside another collapsed details.
    let ancestor = container.parentElement
      ? container.parentElement.closest('details')
      : null;
    while (ancestor) {
      const detailsAncestor = ancestor;
      detailsAncestor.addEventListener('toggle', () => {
        if (detailsAncestor.open) updateArrowVisibility();
      });
      ancestor = detailsAncestor.parentElement
        ? detailsAncestor.parentElement.closest('details')
        : null;
    }

    // On mobile, always show arrows (no hover available)
    if (window.innerWidth <= 768) {
      leftBtn.style.opacity = '1';
      rightBtn.style.opacity = '1';
    }
  });
}

document.addEventListener('DOMContentLoaded', initCarouselScrollArrows);

// Donor logo carousel: arrows are outside the scrollable-container
function initDonorCarouselArrows() {
  var carousel = document.querySelector('.donor-logo-carousel');
  if (!carousel) return;

  var scrollable = carousel.querySelector('.scrollable');
  var leftBtn = carousel.querySelector('.donor-carousel-arrows .scroll-left');
  var rightBtn = carousel.querySelector('.donor-carousel-arrows .scroll-right');
  if (!scrollable || !leftBtn || !rightBtn) return;

  var scrollAmount = 240;

  leftBtn.addEventListener('click', function() {
    scrollable.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });
  rightBtn.addEventListener('click', function() {
    scrollable.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  function setArrowDisabled(btn, isDisabled) {
    btn.classList.toggle('disabled', isDisabled);
    btn.disabled = isDisabled;
  }

  function updateArrowState() {
    var isScrollable = scrollable.scrollWidth > scrollable.clientWidth;
    if (!isScrollable) {
      setArrowDisabled(leftBtn, true);
      setArrowDisabled(rightBtn, true);
      return;
    }
    setArrowDisabled(leftBtn, scrollable.scrollLeft <= 0);
    setArrowDisabled(rightBtn,
      scrollable.scrollLeft + scrollable.clientWidth >= scrollable.scrollWidth - 2);
  }

  scrollable.addEventListener('scroll', updateArrowState);
  window.addEventListener('resize', updateArrowState);
  updateArrowState();

  // Re-check after images load, since scrollWidth may change
  carousel.querySelectorAll('img').forEach(function(img) {
    img.addEventListener('load', updateArrowState);
  });
  window.addEventListener('load', updateArrowState);
}

document.addEventListener('DOMContentLoaded', initDonorCarouselArrows);

// Function to handle opening details based on hash
function openDetailsForHash() {
  const hash = window.location.hash;
  if (hash) {
    let targetElement;
    try { targetElement = document.querySelector(hash); } catch (e) { return; }
    if (targetElement) {
      // Check if the target is inside a details element
      const details = targetElement.closest('details');
      if (details && !details.open) {
        const summary = details.querySelector('summary');
        if (summary) {
          summary.click();
          // After opening, scroll to the element
          setTimeout(() => {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 350); // Wait for animation to complete
        }
      }
    }
  }
}

// Toggle buttons for collapsible robot-excerpt containers
function initToggleButtons() {
  const btns = document.querySelectorAll('.toggle-btn');
  const collapsedH = 400;

  btns.forEach(btn => {
    const wrapper = btn.closest('.robot-excerpt-container') || btn.closest('figure');
    if (!wrapper) return;

    // set initial height to collapsedH
    wrapper.style.height = collapsedH + 'px';

    // set transition for smooth height change
    wrapper.style.transition = 'height 0.5s ease-in-out, background-color 0.3s ease-in-out';

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isExpanded = wrapper.classList.toggle('expanded');
      btn.setAttribute('aria-expanded', String(isExpanded));

      if (isExpanded) {
        // expand: animate to full scrollHeight
        const fullH = wrapper.scrollHeight;
        wrapper.style.height = fullH + 'px';

        // once transition finishes, remove fixed height so it grows with new content
        wrapper.addEventListener('transitionend', function clearHeight() {
          wrapper.style.height = 'auto';
          wrapper.removeEventListener('transitionend', clearHeight);
        });
      } else {
        // collapse: from auto back to fixed
        // first fix current height so transition has a start
        const currH = wrapper.clientHeight;
        wrapper.style.height = currH + 'px';

        // then force reflow before changing down to collapsedH
        void wrapper.offsetHeight;

        wrapper.style.height = collapsedH + 'px';
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', initToggleButtons);

// Handle hash changes
window.addEventListener('hashchange', openDetailsForHash);

// Also handle initial page load with hash
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit to ensure smooth details are initialized
  setTimeout(openDetailsForHash, 100);
});
