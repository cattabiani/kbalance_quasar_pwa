import{c as A,a as b,h as w,b as P,a7 as Fe,a8 as Ve,r as C,F as qe,E as Be,a9 as Ee,g as I,aa as Qe,ab as le,z as $e,N as oe,w as B,o as Se,f as F,S as Oe,j as K,L as ze,P as je,T as Ne,ac as Ke,ad as ke,Q as _e,Z as z,ae as Ue,af as Ge,e as j,i as Ye,l as Xe,_ as Je,u as ie,$ as Ze,y as ue,a2 as p,X as et,x as re,Y as se,a4 as ce,v as tt,a3 as nt}from"./index.1f84b456.js";import{a as G,b as Y,g as at,h as lt}from"./QPage.dcbf423d.js";import{p as de,b as ot,c as Ce,d as it,u as ut,a as rt,e as st,f as ct,g as dt,h as ft,r as vt,i as fe,j as mt,k as ht}from"./focusout.3daaa7da.js";import{c as gt,s as bt,g as yt}from"./scroll.7de0e846.js";import{Q as xt}from"./QResizeObserver.a8e240c3.js";const ve={getDay(e){return new Date(e).getDate().toString().padStart(2,"0")},getMonth(e){const n=new Date(e);return new Intl.DateTimeFormat("en-GB",{month:"short"}).format(n)},getYear(e){return new Date(e).getFullYear()},displayCurrency(e,n){return`${e} ${parseFloat(n/100)}`},truncate(e,n=null){return!e||!n?e:e.length>n?e.substring(0,n-3)+"...":e},isDev(){return!!{}.VITE_FIREBASE_API_KEY&&!!{}.VITE_FIREBASE_AUTH_DOMAIN&&!!{}.VITE_FIREBASE_PROJECT_ID&&!!{}.VITE_FIREBASE_STORAGE_BUCKET&&!!{}.VITE_FIREBASE_MESSAGING_SENDER_ID&&!!{}.VITE_FIREBASE_APP_ID}};var $t=A({name:"QItemSection",props:{avatar:Boolean,thumbnail:Boolean,side:Boolean,top:Boolean,noWrap:Boolean},setup(e,{slots:n}){const t=b(()=>`q-item__section column q-item__section--${e.avatar===!0||e.side===!0||e.thumbnail===!0?"side":"main"}`+(e.top===!0?" q-item__section--top justify-start":" justify-center")+(e.avatar===!0?" q-item__section--avatar":"")+(e.thumbnail===!0?" q-item__section--thumbnail":"")+(e.noWrap===!0?" q-item__section--nowrap":""));return()=>w("div",{class:t.value},P(n.default))}}),Ot=A({name:"QItem",props:{...G,...Fe,tag:{type:String,default:"div"},active:{type:Boolean,default:null},clickable:Boolean,dense:Boolean,insetLevel:Number,tabindex:[String,Number],focused:Boolean,manualFocus:Boolean},emits:["click","keyup"],setup(e,{slots:n,emit:t}){const{proxy:{$q:a}}=I(),l=Y(e,a),{hasLink:u,linkAttrs:i,linkClass:h,linkTag:g,navigateOnClick:f}=Ve(),m=C(null),y=C(null),x=b(()=>e.clickable===!0||u.value===!0||e.tag==="label"),o=b(()=>e.disable!==!0&&x.value===!0),c=b(()=>"q-item q-item-type row no-wrap"+(e.dense===!0?" q-item--dense":"")+(l.value===!0?" q-item--dark":"")+(u.value===!0&&e.active===null?h.value:e.active===!0?` q-item--active${e.activeClass!==void 0?` ${e.activeClass}`:""}`:"")+(e.disable===!0?" disabled":"")+(o.value===!0?" q-item--clickable q-link cursor-pointer "+(e.manualFocus===!0?"q-manual-focusable":"q-focusable q-hoverable")+(e.focused===!0?" q-manual-focusable--focused":""):"")),_=b(()=>{if(e.insetLevel===void 0)return null;const r=a.lang.rtl===!0?"Right":"Left";return{["padding"+r]:16+e.insetLevel*56+"px"}});function E(r){o.value===!0&&(y.value!==null&&(r.qKeyEvent!==!0&&document.activeElement===m.value?y.value.focus():document.activeElement===y.value&&m.value.focus()),f(r))}function S(r){if(o.value===!0&&qe(r,[13,32])===!0){Be(r),r.qKeyEvent=!0;const d=new MouseEvent("click",r);d.qKeyEvent=!0,m.value.dispatchEvent(d)}t("keyup",r)}function s(){const r=Ee(n.default,[]);return o.value===!0&&r.unshift(w("div",{class:"q-focus-helper",tabindex:-1,ref:y})),r}return()=>{const r={ref:m,class:c.value,style:_.value,role:"listitem",onClick:E,onKeyup:S};return o.value===!0?(r.tabindex=e.tabindex||"0",Object.assign(r,i.value)):x.value===!0&&(r["aria-disabled"]="true"),w(g.value,r,s())}}});const wt=["ul","ol"];var zt=A({name:"QList",props:{...G,bordered:Boolean,dense:Boolean,separator:Boolean,padding:Boolean,tag:{type:String,default:"div"}},setup(e,{slots:n}){const t=I(),a=Y(e,t.proxy.$q),l=b(()=>wt.includes(e.tag)?null:"list"),u=b(()=>"q-list"+(e.bordered===!0?" q-list--bordered":"")+(e.dense===!0?" q-list--dense":"")+(e.separator===!0?" q-list--separator":"")+(a.value===!0?" q-list--dark":"")+(e.padding===!0?" q-list--padding":""));return()=>w(e.tag,{class:u.value,role:l.value},P(n.default))}}),qt=A({name:"QBtnGroup",props:{unelevated:Boolean,outline:Boolean,flat:Boolean,rounded:Boolean,square:Boolean,push:Boolean,stretch:Boolean,glossy:Boolean,spread:Boolean},setup(e,{slots:n}){const t=b(()=>{const a=["unelevated","outline","flat","rounded","square","push","stretch","glossy"].filter(l=>e[l]===!0).map(l=>`q-btn-group--${l}`).join(" ");return`q-btn-group row no-wrap${a.length!==0?" "+a:""}`+(e.spread===!0?" q-btn-group--spread":" inline")});return()=>w("div",{class:t.value},P(n.default))}});function Bt(){if(window.getSelection!==void 0){const e=window.getSelection();e.empty!==void 0?e.empty():e.removeAllRanges!==void 0&&(e.removeAllRanges(),Qe.is.mobile!==!0&&e.addRange(document.createRange()))}else document.selection!==void 0&&document.selection.empty()}const Et={target:{type:[Boolean,String,Element],default:!0},noParentEvent:Boolean},St={...Et,contextMenu:Boolean};function kt({showing:e,avoidEmit:n,configureAnchorEl:t}){const{props:a,proxy:l,emit:u}=I(),i=C(null);let h=null;function g(o){return i.value===null?!1:o===void 0||o.touches===void 0||o.touches.length<=1}const f={};t===void 0&&(Object.assign(f,{hide(o){l.hide(o)},toggle(o){l.toggle(o),o.qAnchorHandled=!0},toggleKey(o){qe(o,13)===!0&&f.toggle(o)},contextClick(o){l.hide(o),le(o),$e(()=>{l.show(o),o.qAnchorHandled=!0})},prevent:le,mobileTouch(o){if(f.mobileCleanup(o),g(o)!==!0)return;l.hide(o),i.value.classList.add("non-selectable");const c=o.target;oe(f,"anchor",[[c,"touchmove","mobileCleanup","passive"],[c,"touchend","mobileCleanup","passive"],[c,"touchcancel","mobileCleanup","passive"],[i.value,"contextmenu","prevent","notPassive"]]),h=setTimeout(()=>{h=null,l.show(o),o.qAnchorHandled=!0},300)},mobileCleanup(o){i.value.classList.remove("non-selectable"),h!==null&&(clearTimeout(h),h=null),e.value===!0&&o!==void 0&&Bt()}}),t=function(o=a.contextMenu){if(a.noParentEvent===!0||i.value===null)return;let c;o===!0?l.$q.platform.is.mobile===!0?c=[[i.value,"touchstart","mobileTouch","passive"]]:c=[[i.value,"mousedown","hide","passive"],[i.value,"contextmenu","contextClick","notPassive"]]:c=[[i.value,"click","toggle","passive"],[i.value,"keyup","toggleKey","passive"]],oe(f,"anchor",c)});function m(){Oe(f,"anchor")}function y(o){for(i.value=o;i.value.classList.contains("q-anchor--skip");)i.value=i.value.parentNode;t()}function x(){if(a.target===!1||a.target===""||l.$el.parentNode===null)i.value=null;else if(a.target===!0)y(l.$el.parentNode);else{let o=a.target;if(typeof a.target=="string")try{o=document.querySelector(a.target)}catch{o=void 0}o!=null?(i.value=o.$el||o,t()):(i.value=null,console.error(`Anchor: target "${a.target}" not found`))}}return B(()=>a.contextMenu,o=>{i.value!==null&&(m(),t(o))}),B(()=>a.target,()=>{i.value!==null&&m(),x()}),B(()=>a.noParentEvent,o=>{i.value!==null&&(o===!0?m():t())}),Se(()=>{x(),n!==!0&&a.modelValue===!0&&i.value===null&&u("update:modelValue",!1)}),F(()=>{h!==null&&clearTimeout(h),m()}),{anchorEl:i,canShow:g,anchorEvents:f}}function _t(e,n){const t=C(null);let a;function l(h,g){const f=`${g!==void 0?"add":"remove"}EventListener`,m=g!==void 0?g:a;h!==window&&h[f]("scroll",m,K.passive),window[f]("scroll",m,K.passive),a=g}function u(){t.value!==null&&(l(t.value),t.value=null)}const i=B(()=>e.noParentEvent,()=>{t.value!==null&&(u(),n())});return F(i),{localScrollTarget:t,unconfigureScrollTarget:u,changeScrollEvent:l}}const{notPassiveCapture:M}=K,L=[];function W(e){const n=e.target;if(n===void 0||n.nodeType===8||n.classList.contains("no-pointer-events")===!0)return;let t=de.length-1;for(;t>=0;){const a=de[t].$;if(a.type.name==="QTooltip"){t--;continue}if(a.type.name!=="QDialog")break;if(a.props.seamless!==!0)return;t--}for(let a=L.length-1;a>=0;a--){const l=L[a];if((l.anchorEl.value===null||l.anchorEl.value.contains(n)===!1)&&(n===document.body||l.innerRef.value!==null&&l.innerRef.value.contains(n)===!1))e.qClickOutside=!0,l.onClickOutside(e);else return}}function Ct(e){L.push(e),L.length===1&&(document.addEventListener("mousedown",W,M),document.addEventListener("touchstart",W,M))}function me(e){const n=L.findIndex(t=>t===e);n!==-1&&(L.splice(n,1),L.length===0&&(document.removeEventListener("mousedown",W,M),document.removeEventListener("touchstart",W,M)))}let he,ge;function be(e){const n=e.split(" ");return n.length!==2?!1:["top","center","bottom"].includes(n[0])!==!0?(console.error("Anchor/Self position must start with one of top/center/bottom"),!1):["left","middle","right","start","end"].includes(n[1])!==!0?(console.error("Anchor/Self position must end with one of left/middle/right/start/end"),!1):!0}function Tt(e){return e?!(e.length!==2||typeof e[0]!="number"||typeof e[1]!="number"):!0}const U={"start#ltr":"left","start#rtl":"right","end#ltr":"right","end#rtl":"left"};["left","middle","right"].forEach(e=>{U[`${e}#ltr`]=e,U[`${e}#rtl`]=e});function ye(e,n){const t=e.split(" ");return{vertical:t[0],horizontal:U[`${t[1]}#${n===!0?"rtl":"ltr"}`]}}function At(e,n){let{top:t,left:a,right:l,bottom:u,width:i,height:h}=e.getBoundingClientRect();return n!==void 0&&(t-=n[1],a-=n[0],u+=n[1],l+=n[0],i+=n[0],h+=n[1]),{top:t,bottom:u,height:h,left:a,right:l,width:i,middle:a+(l-a)/2,center:t+(u-t)/2}}function Ht(e,n,t){let{top:a,left:l}=e.getBoundingClientRect();return a+=n.top,l+=n.left,t!==void 0&&(a+=t[1],l+=t[0]),{top:a,bottom:a+1,height:1,left:l,right:l+1,width:1,middle:l,center:a}}function pt(e,n){return{top:0,center:n/2,bottom:n,left:0,middle:e/2,right:e}}function xe(e,n,t,a){return{top:e[t.vertical]-n[a.vertical],left:e[t.horizontal]-n[a.horizontal]}}function Te(e,n=0){if(e.targetEl===null||e.anchorEl===null||n>5)return;if(e.targetEl.offsetHeight===0||e.targetEl.offsetWidth===0){setTimeout(()=>{Te(e,n+1)},10);return}const{targetEl:t,offset:a,anchorEl:l,anchorOrigin:u,selfOrigin:i,absoluteOffset:h,fit:g,cover:f,maxHeight:m,maxWidth:y}=e;if(ze.is.ios===!0&&window.visualViewport!==void 0){const R=document.body.style,{offsetLeft:k,offsetTop:T}=window.visualViewport;k!==he&&(R.setProperty("--q-pe-left",k+"px"),he=k),T!==ge&&(R.setProperty("--q-pe-top",T+"px"),ge=T)}const{scrollLeft:x,scrollTop:o}=t,c=h===void 0?At(l,f===!0?[0,0]:a):Ht(l,h,a);Object.assign(t.style,{top:0,left:0,minWidth:null,minHeight:null,maxWidth:y,maxHeight:m,visibility:"visible"});const{offsetWidth:_,offsetHeight:E}=t,{elWidth:S,elHeight:s}=g===!0||f===!0?{elWidth:Math.max(c.width,_),elHeight:f===!0?Math.max(c.height,E):E}:{elWidth:_,elHeight:E};let r={maxWidth:y,maxHeight:m};(g===!0||f===!0)&&(r.minWidth=c.width+"px",f===!0&&(r.minHeight=c.height+"px")),Object.assign(t.style,r);const d=pt(S,s);let q=xe(c,d,u,i);if(h===void 0||a===void 0)N(q,c,d,u,i);else{const{top:R,left:k}=q;N(q,c,d,u,i);let T=!1;if(q.top!==R){T=!0;const H=2*a[1];c.center=c.top-=H,c.bottom-=H+2}if(q.left!==k){T=!0;const H=2*a[0];c.middle=c.left-=H,c.right-=H+2}T===!0&&(q=xe(c,d,u,i),N(q,c,d,u,i))}r={top:q.top+"px",left:q.left+"px"},q.maxHeight!==void 0&&(r.maxHeight=q.maxHeight+"px",c.height>q.maxHeight&&(r.minHeight=r.maxHeight)),q.maxWidth!==void 0&&(r.maxWidth=q.maxWidth+"px",c.width>q.maxWidth&&(r.minWidth=r.maxWidth)),Object.assign(t.style,r),t.scrollTop!==o&&(t.scrollTop=o),t.scrollLeft!==x&&(t.scrollLeft=x)}function N(e,n,t,a,l){const u=t.bottom,i=t.right,h=gt(),g=window.innerHeight-h,f=document.body.clientWidth;if(e.top<0||e.top+u>g)if(l.vertical==="center")e.top=n[a.vertical]>g/2?Math.max(0,g-u):0,e.maxHeight=Math.min(u,g);else if(n[a.vertical]>g/2){const m=Math.min(g,a.vertical==="center"?n.center:a.vertical===l.vertical?n.bottom:n.top);e.maxHeight=Math.min(u,m),e.top=Math.max(0,m-u)}else e.top=Math.max(0,a.vertical==="center"?n.center:a.vertical===l.vertical?n.top:n.bottom),e.maxHeight=Math.min(u,g-e.top);if(e.left<0||e.left+i>f)if(e.maxWidth=Math.min(i,f),l.horizontal==="middle")e.left=n[a.horizontal]>f/2?Math.max(0,f-i):0;else if(n[a.horizontal]>f/2){const m=Math.min(f,a.horizontal==="middle"?n.middle:a.horizontal===l.horizontal?n.right:n.left);e.maxWidth=Math.min(i,m),e.left=Math.max(0,m-e.maxWidth)}else e.left=Math.max(0,a.horizontal==="middle"?n.middle:a.horizontal===l.horizontal?n.left:n.right),e.maxWidth=Math.min(i,f-e.left)}var Lt=A({name:"QMenu",inheritAttrs:!1,props:{...St,...ot,...G,...Ce,persistent:Boolean,autoClose:Boolean,separateClosePopup:Boolean,noRouteDismiss:Boolean,noRefocus:Boolean,noFocus:Boolean,fit:Boolean,cover:Boolean,square:Boolean,anchor:{type:String,validator:be},self:{type:String,validator:be},offset:{type:Array,validator:Tt},scrollTarget:bt,touchPosition:Boolean,maxHeight:{type:String,default:null},maxWidth:{type:String,default:null}},emits:[...it,"click","escapeKey"],setup(e,{slots:n,emit:t,attrs:a}){let l=null,u,i,h;const g=I(),{proxy:f}=g,{$q:m}=f,y=C(null),x=C(!1),o=b(()=>e.persistent!==!0&&e.noRouteDismiss!==!0),c=Y(e,m),{registerTick:_,removeTick:E}=ut(),{registerTimeout:S}=rt(),{transitionProps:s,transitionStyle:r}=st(e),{localScrollTarget:d,changeScrollEvent:q,unconfigureScrollTarget:R}=_t(e,ne),{anchorEl:k,canShow:T}=kt({showing:x}),{hide:H}=ct({showing:x,canShow:T,handleShow:Pe,handleHide:Re,hideOnRouteChange:o,processOnMount:!0}),{showPortal:X,hidePortal:J,renderPortal:Ae}=dt(g,y,De,"menu"),V={anchorEl:k,innerRef:y,onClickOutside(v){if(e.persistent!==!0&&x.value===!0)return H(v),(v.type==="touchstart"||v.target.classList.contains("q-dialog__backdrop"))&&Be(v),!0}},Z=b(()=>ye(e.anchor||(e.cover===!0?"center middle":"bottom start"),m.lang.rtl)),He=b(()=>e.cover===!0?Z.value:ye(e.self||"top start",m.lang.rtl)),pe=b(()=>(e.square===!0?" q-menu--square":"")+(c.value===!0?" q-menu--dark q-dark":"")),Le=b(()=>e.autoClose===!0?{onClick:Ie}:{}),ee=b(()=>x.value===!0&&e.persistent!==!0);B(ee,v=>{v===!0?(mt($),Ct(V)):(fe($),me(V))});function Q(){at(()=>{let v=y.value;v&&v.contains(document.activeElement)!==!0&&(v=v.querySelector("[autofocus][tabindex], [data-autofocus][tabindex]")||v.querySelector("[autofocus] [tabindex], [data-autofocus] [tabindex]")||v.querySelector("[autofocus], [data-autofocus]")||v,v.focus({preventScroll:!0}))})}function Pe(v){if(l=e.noRefocus===!1?document.activeElement:null,ft(ae),X(),ne(),u=void 0,v!==void 0&&(e.touchPosition||e.contextMenu)){const O=je(v);if(O.left!==void 0){const{top:Me,left:We}=k.value.getBoundingClientRect();u={left:O.left-We,top:O.top-Me}}}i===void 0&&(i=B(()=>m.screen.width+"|"+m.screen.height+"|"+e.self+"|"+e.anchor+"|"+m.lang.rtl,D)),e.noFocus!==!0&&document.activeElement.blur(),_(()=>{D(),e.noFocus!==!0&&Q()}),S(()=>{m.platform.is.ios===!0&&(h=e.autoClose,y.value.click()),D(),X(!0),t("show",v)},e.transitionDuration)}function Re(v){E(),J(),te(!0),l!==null&&(v===void 0||v.qClickOutside!==!0)&&(((v&&v.type.indexOf("key")===0?l.closest('[tabindex]:not([tabindex^="-"])'):void 0)||l).focus(),l=null),S(()=>{J(!0),t("hide",v)},e.transitionDuration)}function te(v){u=void 0,i!==void 0&&(i(),i=void 0),(v===!0||x.value===!0)&&(vt(ae),R(),me(V),fe($)),v!==!0&&(l=null)}function ne(){(k.value!==null||e.scrollTarget!==void 0)&&(d.value=yt(k.value,e.scrollTarget),q(d.value,D))}function Ie(v){h!==!0?(ht(f,v),t("click",v)):h=!1}function ae(v){ee.value===!0&&e.noFocus!==!0&&Ke(y.value,v.target)!==!0&&Q()}function $(v){t("escapeKey"),H(v)}function D(){Te({targetEl:y.value,offset:e.offset,anchorEl:k.value,anchorOrigin:Z.value,selfOrigin:He.value,absoluteOffset:u,fit:e.fit,cover:e.cover,maxHeight:e.maxHeight,maxWidth:e.maxWidth})}function De(){return w(Ne,s.value,()=>x.value===!0?w("div",{role:"menu",...a,ref:y,tabindex:-1,class:["q-menu q-position-engine scroll"+pe.value,a.class],style:[a.style,r.value],...Le.value},P(n.default)):null)}return F(te),Object.assign(f,{focus:Q,updatePosition:D}),Ae}});const Pt=Object.keys(ke);function Rt(e){return Pt.reduce((n,t)=>{const a=e[t];return a!==void 0&&(n[t]=a),n},{})}var jt=A({name:"QBtnDropdown",props:{...ke,...Ce,modelValue:Boolean,split:Boolean,dropdownIcon:String,contentClass:[Array,String,Object],contentStyle:[Array,String,Object],cover:Boolean,persistent:Boolean,noRouteDismiss:Boolean,autoClose:Boolean,menuAnchor:{type:String,default:"bottom end"},menuSelf:{type:String,default:"top end"},menuOffset:Array,disableMainBtn:Boolean,disableDropdown:Boolean,noIconAnimation:Boolean,toggleAriaLabel:String},emits:["update:modelValue","click","beforeShow","show","beforeHide","hide"],setup(e,{slots:n,emit:t}){const{proxy:a}=I(),l=C(e.modelValue),u=C(null),i=lt(),h=b(()=>{const d={"aria-expanded":l.value===!0?"true":"false","aria-haspopup":"true","aria-controls":i.value,"aria-label":e.toggleAriaLabel||a.$q.lang.label[l.value===!0?"collapse":"expand"](e.label)};return(e.disable===!0||e.split===!1&&e.disableMainBtn===!0||e.disableDropdown===!0)&&(d["aria-disabled"]="true"),d}),g=b(()=>"q-btn-dropdown__arrow"+(l.value===!0&&e.noIconAnimation===!1?" rotate-180":"")+(e.split===!1?" q-btn-dropdown__arrow-container":"")),f=b(()=>Ue(e)),m=b(()=>Rt(e));B(()=>e.modelValue,d=>{u.value!==null&&u.value[d?"show":"hide"]()}),B(()=>e.split,r);function y(d){l.value=!0,t("beforeShow",d)}function x(d){t("show",d),t("update:modelValue",!0)}function o(d){l.value=!1,t("beforeHide",d)}function c(d){t("hide",d),t("update:modelValue",!1)}function _(d){t("click",d)}function E(d){Ge(d),r(),t("click",d)}function S(d){u.value!==null&&u.value.toggle(d)}function s(d){u.value!==null&&u.value.show(d)}function r(d){u.value!==null&&u.value.hide(d)}return Object.assign(a,{show:s,hide:r,toggle:S}),Se(()=>{e.modelValue===!0&&s()}),()=>{const d=[w(_e,{class:g.value,name:e.dropdownIcon||a.$q.iconSet.arrow.dropdown})];return e.disableDropdown!==!0&&d.push(w(Lt,{ref:u,id:i.value,class:e.contentClass,style:e.contentStyle,cover:e.cover,fit:!0,persistent:e.persistent,noRouteDismiss:e.noRouteDismiss,autoClose:e.autoClose,anchor:e.menuAnchor,self:e.menuSelf,offset:e.menuOffset,separateClosePopup:!0,transitionShow:e.transitionShow,transitionHide:e.transitionHide,transitionDuration:e.transitionDuration,onBeforeShow:y,onShow:x,onBeforeHide:o,onHide:c},n.default)),e.split===!1?w(z,{class:"q-btn-dropdown q-btn-dropdown--simple",...m.value,...h.value,disable:e.disable===!0||e.disableMainBtn===!0,noWrap:!0,round:!1,onClick:_},{default:()=>P(n.label,[]).concat(d),loading:n.loading}):w(qt,{class:"q-btn-dropdown q-btn-dropdown--split no-wrap q-btn-item",rounded:e.rounded,square:e.square,...f.value,glossy:e.glossy,stretch:e.stretch},()=>[w(z,{class:"q-btn-dropdown--current",...m.value,disable:e.disable===!0||e.disableMainBtn===!0,noWrap:!0,round:!1,onClick:E},{default:n.label,loading:n.loading}),w(z,{class:"q-btn-dropdown__arrow-container q-anchor--skip",...h.value,...f.value,disable:e.disable===!0||e.disableDropdown===!0,rounded:e.rounded,color:e.color,textColor:e.textColor,dense:e.dense,size:e.size,padding:e.padding,ripple:e.ripple},()=>d)])}}}),Nt=A({name:"QToolbar",props:{inset:Boolean},setup(e,{slots:n}){const t=b(()=>"q-toolbar row no-wrap items-center"+(e.inset===!0?" q-toolbar--inset":""));return()=>w("div",{class:t.value,role:"toolbar"},P(n.default))}}),Kt=A({name:"QHeader",props:{modelValue:{type:Boolean,default:!0},reveal:Boolean,revealOffset:{type:Number,default:250},bordered:Boolean,elevated:Boolean,heightHint:{type:[String,Number],default:50}},emits:["reveal","focusin"],setup(e,{slots:n,emit:t}){const{proxy:{$q:a}}=I(),l=Ye(Xe,j);if(l===j)return console.error("QHeader needs to be child of QLayout"),j;const u=C(parseInt(e.heightHint,10)),i=C(!0),h=b(()=>e.reveal===!0||l.view.value.indexOf("H")!==-1||a.platform.is.ios&&l.isContainer.value===!0),g=b(()=>{if(e.modelValue!==!0)return 0;if(h.value===!0)return i.value===!0?u.value:0;const s=u.value-l.scroll.value.position;return s>0?s:0}),f=b(()=>e.modelValue!==!0||h.value===!0&&i.value!==!0),m=b(()=>e.modelValue===!0&&f.value===!0&&e.reveal===!0),y=b(()=>"q-header q-layout__section--marginal "+(h.value===!0?"fixed":"absolute")+"-top"+(e.bordered===!0?" q-header--bordered":"")+(f.value===!0?" q-header--hidden":"")+(e.modelValue!==!0?" q-layout--prevent-focus":"")),x=b(()=>{const s=l.rows.value.top,r={};return s[0]==="l"&&l.left.space===!0&&(r[a.lang.rtl===!0?"right":"left"]=`${l.left.size}px`),s[2]==="r"&&l.right.space===!0&&(r[a.lang.rtl===!0?"left":"right"]=`${l.right.size}px`),r});function o(s,r){l.update("header",s,r)}function c(s,r){s.value!==r&&(s.value=r)}function _({height:s}){c(u,s),o("size",s)}function E(s){m.value===!0&&c(i,!0),t("focusin",s)}B(()=>e.modelValue,s=>{o("space",s),c(i,!0),l.animate()}),B(g,s=>{o("offset",s)}),B(()=>e.reveal,s=>{s===!1&&c(i,e.modelValue)}),B(i,s=>{l.animate(),t("reveal",s)}),B(l.scroll,s=>{e.reveal===!0&&c(i,s.direction==="up"||s.position<=e.revealOffset||s.position-s.inflectionPoint<100)});const S={};return l.instances.header=S,e.modelValue===!0&&o("size",u.value),o("space",e.modelValue),o("offset",g.value),F(()=>{l.instances.header===S&&(l.instances.header=void 0,o("size",0),o("offset",0),o("space",!1))}),()=>{const s=Ee(n.default,[]);return e.elevated===!0&&s.push(w("div",{class:"q-layout__shadow absolute-full overflow-hidden no-pointer-events"})),s.push(w(xt,{debounce:0,onResize:_})),w("header",{class:y.value,style:x.value,onFocusin:E},s)}}}),we=A({name:"QItemLabel",props:{overline:Boolean,caption:Boolean,header:Boolean,lines:[Number,String]},setup(e,{slots:n}){const t=b(()=>parseInt(e.lines,10)),a=b(()=>"q-item__label"+(e.overline===!0?" q-item__label--overline text-overline":"")+(e.caption===!0?" q-item__label--caption text-caption":"")+(e.header===!0?" q-item__label--header":"")+(t.value===1?" ellipsis":"")),l=b(()=>e.lines!==void 0&&t.value>1?{overflow:"hidden",display:"-webkit-box","-webkit-box-orient":"vertical","-webkit-line-clamp":t.value}:null);return()=>w("div",{style:l.value,class:a.value},P(n.default))}});const It={class:"q-gutter-md",style:{display:"flex","align-items":"center"}},Dt={style:{display:"flex","flex-direction":"column","align-items":"flex-start"}},Ut={__name:"PersonItem",props:{id:{type:String,required:!0},people:{type:Object,default:null},maxLength:{type:Number,default:null}},setup(e){const n=Je(),t=e,a=l=>{var u,i;return((i=(u=t.people)==null?void 0:u[l])==null?void 0:i.active)!==!1};return(l,u)=>(ie(),Ze("div",It,[ue(_e,{name:a(t.id)?"person":"person_off",color:p(n).isUserOrFriend(t.id)?"primary":"grey","aria-label":p(n).isUserOrFriend(t.id)?"Real user":"Fake user"},null,8,["name","color","aria-label"]),et("div",Dt,[ue(we,null,{default:re(()=>[se(ce(p(ve).truncate(p(n).getName(t.id,t==null?void 0:t.people),t.maxLength)),1)]),_:1}),p(n).isCaption(t.id,t==null?void 0:t.people)?(ie(),tt(we,{key:0,caption:""},{default:re(()=>[se(ce(p(ve).truncate(p(n).getEmail(t.id,t==null?void 0:t.people),t.maxLength)),1)]),_:1})):nt("",!0)])]))}};export{Kt as Q,ve as U,Ut as _,Nt as a,jt as b,Bt as c,zt as d,$t as e,Ot as f,we as g,Lt as h};
