import{ag as F,a3 as q,n as L,ah as A,ai as S,aj as M,ab as k,ae as O,ak as x,al as _,T as Y,c as R,r as U,a as X,a7 as I,f as Q,h as D,b as H,am as K,g as G}from"./index.926519d6.js";import{g as J}from"./QDialog.e32d59db.js";import{d as W,e as Z}from"./use-quasar.5501894d.js";const j={left:!0,right:!0,up:!0,down:!0,horizontal:!0,vertical:!0},N=Object.keys(j);j.all=!0;function z(n){const t={};for(const o of N)n[o]===!0&&(t[o]=!0);return Object.keys(t).length===0?j:(t.horizontal===!0?t.left=t.right=!0:t.left===!0&&t.right===!0&&(t.horizontal=!0),t.vertical===!0?t.up=t.down=!0:t.up===!0&&t.down===!0&&(t.vertical=!0),t.horizontal===!0&&t.vertical===!0&&(t.all=!0),t)}const V=["INPUT","TEXTAREA"];function P(n,t){return t.event===void 0&&n.target!==void 0&&n.target.draggable!==!0&&typeof t.handler=="function"&&V.includes(n.target.nodeName.toUpperCase())===!1&&(n.qClonedBy===void 0||n.qClonedBy.indexOf(t.uid)===-1)}function $(n,t,o){const p=x(n);let e,i=p.left-t.event.x,s=p.top-t.event.y,l=Math.abs(i),a=Math.abs(s);const r=t.direction;r.horizontal===!0&&r.vertical!==!0?e=i<0?"left":"right":r.horizontal!==!0&&r.vertical===!0?e=s<0?"up":"down":r.up===!0&&s<0?(e="up",l>a&&(r.left===!0&&i<0?e="left":r.right===!0&&i>0&&(e="right"))):r.down===!0&&s>0?(e="down",l>a&&(r.left===!0&&i<0?e="left":r.right===!0&&i>0&&(e="right"))):r.left===!0&&i<0?(e="left",l<a&&(r.up===!0&&s<0?e="up":r.down===!0&&s>0&&(e="down"))):r.right===!0&&i>0&&(e="right",l<a&&(r.up===!0&&s<0?e="up":r.down===!0&&s>0&&(e="down")));let C=!1;if(e===void 0&&o===!1){if(t.event.isFirst===!0||t.event.lastDir===void 0)return{};e=t.event.lastDir,C=!0,e==="left"||e==="right"?(p.left-=i,l=0,i=0):(p.top-=s,a=0,s=0)}return{synthetic:C,payload:{evt:n,touch:t.event.mouse!==!0,mouse:t.event.mouse===!0,position:p,direction:e,isFirst:t.event.isFirst,isFinal:o===!0,duration:Date.now()-t.event.time,distance:{x:l,y:a},offset:{x:i,y:s},delta:{x:p.left-t.event.lastX,y:p.top-t.event.lastY}}}}let ee=0;var te=F({name:"touch-pan",beforeMount(n,{value:t,modifiers:o}){if(o.mouse!==!0&&q.has.touch!==!0)return;function p(i,s){o.mouse===!0&&s===!0?Y(i):(o.stop===!0&&O(i),o.prevent===!0&&k(i))}const e={uid:"qvtp_"+ee++,handler:t,modifiers:o,direction:z(o),noop:L,mouseStart(i){P(i,e)&&A(i)&&(S(e,"temp",[[document,"mousemove","move","notPassiveCapture"],[document,"mouseup","end","passiveCapture"]]),e.start(i,!0))},touchStart(i){if(P(i,e)){const s=i.target;S(e,"temp",[[s,"touchmove","move","notPassiveCapture"],[s,"touchcancel","end","passiveCapture"],[s,"touchend","end","passiveCapture"]]),e.start(i)}},start(i,s){if(q.is.firefox===!0&&M(n,!0),e.lastEvt=i,s===!0||o.stop===!0){if(e.direction.all!==!0&&(s!==!0||e.modifiers.mouseAllDir!==!0&&e.modifiers.mousealldir!==!0)){const r=i.type.indexOf("mouse")!==-1?new MouseEvent(i.type,i):new TouchEvent(i.type,i);i.defaultPrevented===!0&&k(r),i.cancelBubble===!0&&O(r),Object.assign(r,{qKeyEvent:i.qKeyEvent,qClickOutside:i.qClickOutside,qAnchorHandled:i.qAnchorHandled,qClonedBy:i.qClonedBy===void 0?[e.uid]:i.qClonedBy.concat(e.uid)}),e.initialEvent={target:i.target,event:r}}O(i)}const{left:l,top:a}=x(i);e.event={x:l,y:a,time:Date.now(),mouse:s===!0,detected:!1,isFirst:!0,isFinal:!1,lastX:l,lastY:a}},move(i){if(e.event===void 0)return;const s=x(i),l=s.left-e.event.x,a=s.top-e.event.y;if(l===0&&a===0)return;e.lastEvt=i;const r=e.event.mouse===!0,C=()=>{p(i,r);let g;o.preserveCursor!==!0&&o.preservecursor!==!0&&(g=document.documentElement.style.cursor||"",document.documentElement.style.cursor="grabbing"),r===!0&&document.body.classList.add("no-pointer-events--children"),document.body.classList.add("non-selectable"),J(),e.styleCleanup=b=>{if(e.styleCleanup=void 0,g!==void 0&&(document.documentElement.style.cursor=g),document.body.classList.remove("non-selectable"),r===!0){const E=()=>{document.body.classList.remove("no-pointer-events--children")};b!==void 0?setTimeout(()=>{E(),b()},50):E()}else b!==void 0&&b()}};if(e.event.detected===!0){e.event.isFirst!==!0&&p(i,e.event.mouse);const{payload:g,synthetic:b}=$(i,e,!1);g!==void 0&&(e.handler(g)===!1?e.end(i):(e.styleCleanup===void 0&&e.event.isFirst===!0&&C(),e.event.lastX=g.position.left,e.event.lastY=g.position.top,e.event.lastDir=b===!0?void 0:g.direction,e.event.isFirst=!1));return}if(e.direction.all===!0||r===!0&&(e.modifiers.mouseAllDir===!0||e.modifiers.mousealldir===!0)){C(),e.event.detected=!0,e.move(i);return}const v=Math.abs(l),c=Math.abs(a);v!==c&&(e.direction.horizontal===!0&&v>c||e.direction.vertical===!0&&v<c||e.direction.up===!0&&v<c&&a<0||e.direction.down===!0&&v<c&&a>0||e.direction.left===!0&&v>c&&l<0||e.direction.right===!0&&v>c&&l>0?(e.event.detected=!0,e.move(i)):e.end(i,!0))},end(i,s){if(e.event!==void 0){if(_(e,"temp"),q.is.firefox===!0&&M(n,!1),s===!0)e.styleCleanup!==void 0&&e.styleCleanup(),e.event.detected!==!0&&e.initialEvent!==void 0&&e.initialEvent.target.dispatchEvent(e.initialEvent.event);else if(e.event.detected===!0){e.event.isFirst===!0&&e.handler($(i===void 0?e.lastEvt:i,e).payload);const{payload:l}=$(i===void 0?e.lastEvt:i,e,!0),a=()=>{e.handler(l)};e.styleCleanup!==void 0?e.styleCleanup(a):a()}e.event=void 0,e.initialEvent=void 0,e.lastEvt=void 0}}};if(n.__qtouchpan=e,o.mouse===!0){const i=o.mouseCapture===!0||o.mousecapture===!0?"Capture":"";S(e,"main",[[n,"mousedown","mouseStart",`passive${i}`]])}q.has.touch===!0&&S(e,"main",[[n,"touchstart","touchStart",`passive${o.capture===!0?"Capture":""}`],[n,"touchmove","noop","notPassiveCapture"]])},updated(n,t){const o=n.__qtouchpan;o!==void 0&&(t.oldValue!==t.value&&(typeof value!="function"&&o.end(),o.handler=t.value),o.direction=z(t.modifiers))},beforeUnmount(n){const t=n.__qtouchpan;t!==void 0&&(t.event!==void 0&&t.end(),_(t,"main"),_(t,"temp"),q.is.firefox===!0&&M(n,!1),t.styleCleanup!==void 0&&t.styleCleanup(),delete n.__qtouchpan)}});function ie(){let n=Object.create(null);return{getCache:(t,o)=>n[t]===void 0?n[t]=typeof o=="function"?o():o:n[t],setCache(t,o){n[t]=o},hasCache(t){return Object.hasOwnProperty.call(n,t)},clearCache(t){t!==void 0?delete n[t]:n=Object.create(null)}}}const T=[["left","center","start","width"],["right","center","end","width"],["top","start","center","height"],["bottom","end","center","height"]];var se=R({name:"QSlideItem",props:{...W,leftColor:String,rightColor:String,topColor:String,bottomColor:String,onSlide:Function},emits:["action","top","right","bottom","left"],setup(n,{slots:t,emit:o}){const{proxy:p}=G(),{$q:e}=p,i=Z(n,e),{getCache:s}=ie(),l=U(null);let a=null,r={},C={},v={};const c=X(()=>e.lang.rtl===!0?{left:"right",right:"left"}:{left:"left",right:"right"}),g=X(()=>"q-slide-item q-item-type overflow-hidden"+(i.value===!0?" q-slide-item--dark q-dark":""));function b(){l.value.style.transform="translate(0,0)"}function E(u,y,f){n.onSlide!==void 0&&o("slide",{side:u,ratio:y,isReset:f})}function B(u){const y=l.value;if(u.isFirst)r={dir:null,size:{left:0,right:0,top:0,bottom:0},scale:0},y.classList.add("no-transition"),T.forEach(d=>{if(t[d[0]]!==void 0){const w=v[d[0]];w.style.transform="scale(1)",r.size[d[0]]=w.getBoundingClientRect()[d[3]]}}),r.axis=u.direction==="up"||u.direction==="down"?"Y":"X";else if(u.isFinal){y.classList.remove("no-transition"),r.scale===1?(y.style.transform=`translate${r.axis}(${r.dir*100}%)`,a!==null&&clearTimeout(a),a=setTimeout(()=>{a=null,o(r.showing,{reset:b}),o("action",{side:r.showing,reset:b})},230)):(y.style.transform="translate(0,0)",E(r.showing,0,!0));return}else u.direction=r.axis==="X"?u.offset.x<0?"left":"right":u.offset.y<0?"up":"down";if(t.left===void 0&&u.direction===c.value.right||t.right===void 0&&u.direction===c.value.left||t.top===void 0&&u.direction==="down"||t.bottom===void 0&&u.direction==="up"){y.style.transform="translate(0,0)";return}let f,m,h;r.axis==="X"?(m=u.direction==="left"?-1:1,f=m===1?c.value.left:c.value.right,h=u.distance.x):(m=u.direction==="up"?-2:2,f=m===2?"top":"bottom",h=u.distance.y),!(r.dir!==null&&Math.abs(m)!==Math.abs(r.dir))&&(r.dir!==m&&(["left","right","top","bottom"].forEach(d=>{C[d]&&(C[d].style.visibility=f===d?"visible":"hidden")}),r.showing=f,r.dir=m),r.scale=Math.max(0,Math.min(1,(h-40)/r.size[f])),y.style.transform=`translate${r.axis}(${h*m/Math.abs(m)}px)`,v[f].style.transform=`scale(${r.scale})`,E(f,r.scale,!1))}return I(()=>{C={},v={}}),Q(()=>{a!==null&&clearTimeout(a)}),Object.assign(p,{reset:b}),()=>{const u=[],y={left:t[c.value.right]!==void 0,right:t[c.value.left]!==void 0,up:t.bottom!==void 0,down:t.top!==void 0},f=Object.keys(y).filter(h=>y[h]===!0);T.forEach(h=>{const d=h[0];t[d]!==void 0&&u.push(D("div",{key:d,ref:w=>{C[d]=w},class:`q-slide-item__${d} absolute-full row no-wrap items-${h[1]} justify-${h[2]}`+(n[d+"Color"]!==void 0?` bg-${n[d+"Color"]}`:"")},[D("div",{ref:w=>{v[d]=w}},t[d]())]))});const m=D("div",{key:`${f.length===0?"only-":""} content`,ref:l,class:"q-slide-item__content"},H(t.default));return f.length===0?u.push(m):u.push(K(m,s("dir#"+f.join(""),()=>{const h={prevent:!0,stop:!0,mouse:!0};return f.forEach(d=>{h[d]=!0}),[[te,B,void 0,h]]}))),D("div",{class:g.value},u)}}});export{se as Q};
