import{c as f,a as n,h as r,b as g,e as L,r as w,w as q,f as V,a7 as C,i as $,l as z,g as R,a8 as T,a9 as p,F as O,E as A,aa as F}from"./index.4750bf8b.js";import{Q as H}from"./QResizeObserver.89513726.js";import{a as E,b as I}from"./QPage.88ea25c0.js";var D=f({name:"QToolbarTitle",props:{shrink:Boolean},setup(e,{slots:o}){const u=n(()=>"q-toolbar__title ellipsis"+(e.shrink===!0?" col-shrink":""));return()=>r("div",{class:u.value},g(o.default))}}),U=f({name:"QToolbar",props:{inset:Boolean},setup(e,{slots:o}){const u=n(()=>"q-toolbar row no-wrap items-center"+(e.inset===!0?" q-toolbar--inset":""));return()=>r("div",{class:u.value,role:"toolbar"},g(o.default))}}),W=f({name:"QHeader",props:{modelValue:{type:Boolean,default:!0},reveal:Boolean,revealOffset:{type:Number,default:250},bordered:Boolean,elevated:Boolean,heightHint:{type:[String,Number],default:50}},emits:["reveal","focusin"],setup(e,{slots:o,emit:u}){const{proxy:{$q:s}}=R(),l=$(z,L);if(l===L)return console.error("QHeader needs to be child of QLayout"),L;const c=w(parseInt(e.heightHint,10)),d=w(!0),h=n(()=>e.reveal===!0||l.view.value.indexOf("H")!==-1||s.platform.is.ios&&l.isContainer.value===!0),y=n(()=>{if(e.modelValue!==!0)return 0;if(h.value===!0)return d.value===!0?c.value:0;const t=c.value-l.scroll.value.position;return t>0?t:0}),k=n(()=>e.modelValue!==!0||h.value===!0&&d.value!==!0),m=n(()=>e.modelValue===!0&&k.value===!0&&e.reveal===!0),b=n(()=>"q-header q-layout__section--marginal "+(h.value===!0?"fixed":"absolute")+"-top"+(e.bordered===!0?" q-header--bordered":"")+(k.value===!0?" q-header--hidden":"")+(e.modelValue!==!0?" q-layout--prevent-focus":"")),_=n(()=>{const t=l.rows.value.top,a={};return t[0]==="l"&&l.left.space===!0&&(a[s.lang.rtl===!0?"right":"left"]=`${l.left.size}px`),t[2]==="r"&&l.right.space===!0&&(a[s.lang.rtl===!0?"left":"right"]=`${l.right.size}px`),a});function i(t,a){l.update("header",t,a)}function v(t,a){t.value!==a&&(t.value=a)}function x({height:t}){v(c,t),i("size",t)}function Q(t){m.value===!0&&v(d,!0),u("focusin",t)}q(()=>e.modelValue,t=>{i("space",t),v(d,!0),l.animate()}),q(y,t=>{i("offset",t)}),q(()=>e.reveal,t=>{t===!1&&v(d,e.modelValue)}),q(d,t=>{l.animate(),u("reveal",t)}),q(l.scroll,t=>{e.reveal===!0&&v(d,t.direction==="up"||t.position<=e.revealOffset||t.position-t.inflectionPoint<100)});const B={};return l.instances.header=B,e.modelValue===!0&&i("size",c.value),i("space",e.modelValue),i("offset",y.value),V(()=>{l.instances.header===B&&(l.instances.header=void 0,i("size",0),i("offset",0),i("space",!1))}),()=>{const t=C(o.default,[]);return e.elevated===!0&&t.push(r("div",{class:"q-layout__shadow absolute-full overflow-hidden no-pointer-events"})),t.push(r(H,{debounce:0,onResize:x})),r("header",{class:b.value,style:_.value,onFocusin:Q},t)}}}),M=f({name:"QItemLabel",props:{overline:Boolean,caption:Boolean,header:Boolean,lines:[Number,String]},setup(e,{slots:o}){const u=n(()=>parseInt(e.lines,10)),s=n(()=>"q-item__label"+(e.overline===!0?" q-item__label--overline text-overline":"")+(e.caption===!0?" q-item__label--caption text-caption":"")+(e.header===!0?" q-item__label--header":"")+(u.value===1?" ellipsis":"")),l=n(()=>e.lines!==void 0&&u.value>1?{overflow:"hidden",display:"-webkit-box","-webkit-box-orient":"vertical","-webkit-line-clamp":u.value}:null);return()=>r("div",{style:l.value,class:s.value},g(o.default))}}),G=f({name:"QItemSection",props:{avatar:Boolean,thumbnail:Boolean,side:Boolean,top:Boolean,noWrap:Boolean},setup(e,{slots:o}){const u=n(()=>`q-item__section column q-item__section--${e.avatar===!0||e.side===!0||e.thumbnail===!0?"side":"main"}`+(e.top===!0?" q-item__section--top justify-start":" justify-center")+(e.avatar===!0?" q-item__section--avatar":"")+(e.thumbnail===!0?" q-item__section--thumbnail":"")+(e.noWrap===!0?" q-item__section--nowrap":""));return()=>r("div",{class:u.value},g(o.default))}}),J=f({name:"QItem",props:{...E,...T,tag:{type:String,default:"div"},active:{type:Boolean,default:null},clickable:Boolean,dense:Boolean,insetLevel:Number,tabindex:[String,Number],focused:Boolean,manualFocus:Boolean},emits:["click","keyup"],setup(e,{slots:o,emit:u}){const{proxy:{$q:s}}=R(),l=I(e,s),{hasLink:c,linkAttrs:d,linkClass:h,linkTag:y,navigateOnClick:k}=p(),m=w(null),b=w(null),_=n(()=>e.clickable===!0||c.value===!0||e.tag==="label"),i=n(()=>e.disable!==!0&&_.value===!0),v=n(()=>"q-item q-item-type row no-wrap"+(e.dense===!0?" q-item--dense":"")+(l.value===!0?" q-item--dark":"")+(c.value===!0&&e.active===null?h.value:e.active===!0?` q-item--active${e.activeClass!==void 0?` ${e.activeClass}`:""}`:"")+(e.disable===!0?" disabled":"")+(i.value===!0?" q-item--clickable q-link cursor-pointer "+(e.manualFocus===!0?"q-manual-focusable":"q-focusable q-hoverable")+(e.focused===!0?" q-manual-focusable--focused":""):"")),x=n(()=>{if(e.insetLevel===void 0)return null;const a=s.lang.rtl===!0?"Right":"Left";return{["padding"+a]:16+e.insetLevel*56+"px"}});function Q(a){i.value===!0&&(b.value!==null&&(a.qKeyEvent!==!0&&document.activeElement===m.value?b.value.focus():document.activeElement===b.value&&m.value.focus()),k(a))}function B(a){if(i.value===!0&&O(a,[13,32])===!0){A(a),a.qKeyEvent=!0;const S=new MouseEvent("click",a);S.qKeyEvent=!0,m.value.dispatchEvent(S)}u("keyup",a)}function t(){const a=C(o.default,[]);return i.value===!0&&a.unshift(r("div",{class:"q-focus-helper",tabindex:-1,ref:b})),a}return()=>{const a={ref:m,class:v.value,style:x.value,role:"listitem",onClick:Q,onKeyup:B};return i.value===!0?(a.tabindex=e.tabindex||"0",Object.assign(a,d.value)):_.value===!0&&(a["aria-disabled"]="true"),r(y.value,a,t())}}});function X(){if(window.getSelection!==void 0){const e=window.getSelection();e.empty!==void 0?e.empty():e.removeAllRanges!==void 0&&(e.removeAllRanges(),F.is.mobile!==!0&&e.addRange(document.createRange()))}else document.selection!==void 0&&document.selection.empty()}const K=["ul","ol"];var Y=f({name:"QList",props:{...E,bordered:Boolean,dense:Boolean,separator:Boolean,padding:Boolean,tag:{type:String,default:"div"}},setup(e,{slots:o}){const u=R(),s=I(e,u.proxy.$q),l=n(()=>K.includes(e.tag)?null:"list"),c=n(()=>"q-list"+(e.bordered===!0?" q-list--bordered":"")+(e.dense===!0?" q-list--dense":"")+(e.separator===!0?" q-list--separator":"")+(s.value===!0?" q-list--dark":"")+(e.padding===!0?" q-list--padding":""));return()=>r(e.tag,{class:c.value,role:l.value},g(o.default))}});export{W as Q,U as a,D as b,X as c,Y as d,J as e,G as f,M as g};