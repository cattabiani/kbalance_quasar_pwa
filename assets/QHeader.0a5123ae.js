import{I as H,f as w,aa as O,g as Q,c as V,a as n,h as v,b as $,e as h,r as q,w as c,$ as I,i as _,l as C}from"./index.c45f6171.js";import{Q as F}from"./QResizeObserver.cfbe9964.js";function S(){let t=null;const s=Q();function u(){t!==null&&(clearTimeout(t),t=null)}return H(u),w(u),{removeTimeout:u,registerTimeout(i,a){u(),O(s)===!1&&(t=setTimeout(()=>{t=null,i()},a))}}}var D=V({name:"QToolbar",props:{inset:Boolean},setup(t,{slots:s}){const u=n(()=>"q-toolbar row no-wrap items-center"+(t.inset===!0?" q-toolbar--inset":""));return()=>v("div",{class:u.value,role:"toolbar"},$(s.default))}}),N=V({name:"QHeader",props:{modelValue:{type:Boolean,default:!0},reveal:Boolean,revealOffset:{type:Number,default:250},bordered:Boolean,elevated:Boolean,heightHint:{type:[String,Number],default:50}},emits:["reveal","focusin"],setup(t,{slots:s,emit:u}){const{proxy:{$q:i}}=Q(),a=_(C,h);if(a===h)return console.error("QHeader needs to be child of QLayout"),h;const f=q(parseInt(t.heightHint,10)),r=q(!0),m=n(()=>t.reveal===!0||a.view.value.indexOf("H")!==-1||i.platform.is.ios&&a.isContainer.value===!0),b=n(()=>{if(t.modelValue!==!0)return 0;if(m.value===!0)return r.value===!0?f.value:0;const e=f.value-a.scroll.value.position;return e>0?e:0}),y=n(()=>t.modelValue!==!0||m.value===!0&&r.value!==!0),z=n(()=>t.modelValue===!0&&y.value===!0&&t.reveal===!0),p=n(()=>"q-header q-layout__section--marginal "+(m.value===!0?"fixed":"absolute")+"-top"+(t.bordered===!0?" q-header--bordered":"")+(y.value===!0?" q-header--hidden":"")+(t.modelValue!==!0?" q-layout--prevent-focus":"")),x=n(()=>{const e=a.rows.value.top,o={};return e[0]==="l"&&a.left.space===!0&&(o[i.lang.rtl===!0?"right":"left"]=`${a.left.size}px`),e[2]==="r"&&a.right.space===!0&&(o[i.lang.rtl===!0?"left":"right"]=`${a.right.size}px`),o});function l(e,o){a.update("header",e,o)}function d(e,o){e.value!==o&&(e.value=o)}function T({height:e}){d(f,e),l("size",e)}function B(e){z.value===!0&&d(r,!0),u("focusin",e)}c(()=>t.modelValue,e=>{l("space",e),d(r,!0),a.animate()}),c(b,e=>{l("offset",e)}),c(()=>t.reveal,e=>{e===!1&&d(r,t.modelValue)}),c(r,e=>{a.animate(),u("reveal",e)}),c(a.scroll,e=>{t.reveal===!0&&d(r,e.direction==="up"||e.position<=t.revealOffset||e.position-e.inflectionPoint<100)});const g={};return a.instances.header=g,t.modelValue===!0&&l("size",f.value),l("space",t.modelValue),l("offset",b.value),w(()=>{a.instances.header===g&&(a.instances.header=void 0,l("size",0),l("offset",0),l("space",!1))}),()=>{const e=I(s.default,[]);return t.elevated===!0&&e.push(v("div",{class:"q-layout__shadow absolute-full overflow-hidden no-pointer-events"})),e.push(v(F,{debounce:0,onResize:T})),v("header",{class:p.value,style:x.value,onFocusin:B},e)}}});export{N as Q,D as a,S as u};
