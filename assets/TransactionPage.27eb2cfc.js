import{r as N,a as k,h as D,c as he,aE as fe,aF as ve,Q as ge,s as pe,b as be,g as ae,E as ee,aJ as A,K as qe,F as $e,w as ne,aK as we,u as q,v as M,a2 as I,aL as Ee,_ as Pe,o as Ne,$ as L,y as g,x as F,a0 as se,a1 as Oe,Z as z,X as C,a4 as R,a6 as le,a3 as T,C as W,a5 as Re,aD as X,ao as Me}from"./index.a806d26d.js";import{Q as Ae}from"./QSpace.7ffd943e.js";import{Q as Le,a as Te,b as Qe,d as oe,f as K,e as H,U as re,_ as Be}from"./PersonItem.7fcf1ebd.js";import{Q as ye}from"./QInput.8061a07f.js";import{a as xe,i as Fe,b as Se,q as Ve,e as Ge,c as ze,d as te,Q as U}from"./QPage.c0d6ab01.js";import{c as Ue,Q as je}from"./index.3c521992.js";import{l as We,m as Xe}from"./focusout.4c62d806.js";import{_ as ue}from"./PeopleDropdown.1eb61a1f.js";import"./scroll.6ce354fe.js";import"./QResizeObserver.2d174bfe.js";import"./QDialog.24e6bdaa.js";import"./rtl.276c3f1b.js";function _e(n,t){const e=N(null),a=k(()=>n.disable===!0?null:D("span",{ref:e,class:"no-outline",tabindex:-1}));function i(c){const o=t.value;c!==void 0&&c.type.indexOf("key")===0?o!==null&&document.activeElement!==o&&o.contains(document.activeElement)===!0&&o.focus():e.value!==null&&(c===void 0||o!==null&&o.contains(c.target)===!0)&&e.value.focus()}return{refocusTargetEl:a,refocusTarget:i}}var ke={xs:30,sm:35,md:40,lg:50,xl:60};const Ke=()=>D("svg",{key:"svg",class:"q-radio__bg absolute non-selectable",viewBox:"0 0 24 24"},[D("path",{d:"M12,22a10,10 0 0 1 -10,-10a10,10 0 0 1 10,-10a10,10 0 0 1 10,10a10,10 0 0 1 -10,10m0,-22a12,12 0 0 0 -12,12a12,12 0 0 0 12,12a12,12 0 0 0 12,-12a12,12 0 0 0 -12,-12"}),D("path",{class:"q-radio__check",d:"M12,6a6,6 0 0 0 -6,6a6,6 0 0 0 6,6a6,6 0 0 0 6,-6a6,6 0 0 0 -6,-6"})]);var He=he({name:"QRadio",props:{...xe,...fe,...Fe,modelValue:{required:!0},val:{required:!0},label:String,leftLabel:Boolean,checkedIcon:String,uncheckedIcon:String,color:String,keepColor:Boolean,dense:Boolean,disable:Boolean,tabindex:[String,Number]},emits:["update:modelValue"],setup(n,{slots:t,emit:e}){const{proxy:a}=ae(),i=Se(n,a.$q),c=ve(n,ke),o=N(null),{refocusTargetEl:p,refocusTarget:h}=_e(n,o),f=k(()=>A(n.modelValue)===A(n.val)),r=k(()=>"q-radio cursor-pointer no-outline row inline no-wrap items-center"+(n.disable===!0?" disabled":"")+(i.value===!0?" q-radio--dark":"")+(n.dense===!0?" q-radio--dense":"")+(n.leftLabel===!0?" reverse":"")),d=k(()=>{const y=n.color!==void 0&&(n.keepColor===!0||f.value===!0)?` text-${n.color}`:"";return`q-radio__inner relative-position q-radio__inner--${f.value===!0?"truthy":"falsy"}${y}`}),b=k(()=>(f.value===!0?n.checkedIcon:n.uncheckedIcon)||null),x=k(()=>n.disable===!0?-1:n.tabindex||0),m=k(()=>{const y={type:"radio"};return n.name!==void 0&&Object.assign(y,{".checked":f.value===!0,"^checked":f.value===!0?"checked":void 0,name:n.name,value:n.val}),y}),_=Ve(m);function V(y){y!==void 0&&(ee(y),h(y)),n.disable!==!0&&f.value!==!0&&e("update:modelValue",n.val,y)}function P(y){(y.keyCode===13||y.keyCode===32)&&ee(y)}function v(y){(y.keyCode===13||y.keyCode===32)&&V(y)}Object.assign(a,{set:V});const w=Ke();return()=>{const y=b.value!==null?[D("div",{key:"icon",class:"q-radio__icon-container absolute-full flex flex-center no-wrap"},[D(ge,{class:"q-radio__icon",name:b.value})])]:[w];n.disable!==!0&&_(y,"unshift"," q-radio__native q-ma-none q-pa-none");const $=[D("div",{class:d.value,style:c.value,"aria-hidden":"true"},y)];p.value!==null&&$.push(p.value);const G=n.label!==void 0?pe(t.default,[n.label]):be(t.default);return G!==void 0&&$.push(D("div",{class:"q-radio__label q-anchor--skip"},G)),D("div",{ref:o,class:r.value,tabindex:x.value,role:"radio","aria-label":n.label,"aria-checked":f.value===!0?"true":"false","aria-disabled":n.disable===!0?"true":void 0,onClick:V,onKeydown:P,onKeyup:v},$)}}});const Ye={...xe,...fe,...Fe,modelValue:{required:!0,default:null},val:{},trueValue:{default:!0},falseValue:{default:!1},indeterminateValue:{default:null},checkedIcon:String,uncheckedIcon:String,indeterminateIcon:String,toggleOrder:{type:String,validator:n=>n==="tf"||n==="ft"},toggleIndeterminate:Boolean,label:String,leftLabel:Boolean,color:String,keepColor:Boolean,dense:Boolean,disable:Boolean,tabindex:[String,Number]},Ze=["update:modelValue"];function Je(n,t){const{props:e,slots:a,emit:i,proxy:c}=ae(),{$q:o}=c,p=Se(e,o),h=N(null),{refocusTargetEl:f,refocusTarget:r}=_e(e,h),d=ve(e,ke),b=k(()=>e.val!==void 0&&Array.isArray(e.modelValue)),x=k(()=>{const s=A(e.val);return b.value===!0?e.modelValue.findIndex(S=>A(S)===s):-1}),m=k(()=>b.value===!0?x.value!==-1:A(e.modelValue)===A(e.trueValue)),_=k(()=>b.value===!0?x.value===-1:A(e.modelValue)===A(e.falseValue)),V=k(()=>m.value===!1&&_.value===!1),P=k(()=>e.disable===!0?-1:e.tabindex||0),v=k(()=>`q-${n} cursor-pointer no-outline row inline no-wrap items-center`+(e.disable===!0?" disabled":"")+(p.value===!0?` q-${n}--dark`:"")+(e.dense===!0?` q-${n}--dense`:"")+(e.leftLabel===!0?" reverse":"")),w=k(()=>{const s=m.value===!0?"truthy":_.value===!0?"falsy":"indet",S=e.color!==void 0&&(e.keepColor===!0||(n==="toggle"?m.value===!0:_.value!==!0))?` text-${e.color}`:"";return`q-${n}__inner relative-position non-selectable q-${n}__inner--${s}${S}`}),y=k(()=>{const s={type:"checkbox"};return e.name!==void 0&&Object.assign(s,{".checked":m.value,"^checked":m.value===!0?"checked":void 0,name:e.name,value:b.value===!0?e.val:e.trueValue}),s}),$=Ve(y),G=k(()=>{const s={tabindex:P.value,role:n==="toggle"?"switch":"checkbox","aria-label":e.label,"aria-checked":V.value===!0?"mixed":m.value===!0?"true":"false"};return e.disable===!0&&(s["aria-disabled"]="true"),s});function O(s){s!==void 0&&(ee(s),r(s)),e.disable!==!0&&i("update:modelValue",Y(),s)}function Y(){if(b.value===!0){if(m.value===!0){const s=e.modelValue.slice();return s.splice(x.value,1),s}return e.modelValue.concat([e.val])}if(m.value===!0){if(e.toggleOrder!=="ft"||e.toggleIndeterminate===!1)return e.falseValue}else if(_.value===!0){if(e.toggleOrder==="ft"||e.toggleIndeterminate===!1)return e.trueValue}else return e.toggleOrder!=="ft"?e.trueValue:e.falseValue;return e.indeterminateValue}function j(s){(s.keyCode===13||s.keyCode===32)&&ee(s)}function u(s){(s.keyCode===13||s.keyCode===32)&&O(s)}const l=t(m,V);return Object.assign(c,{toggle:O}),()=>{const s=l();e.disable!==!0&&$(s,"unshift",` q-${n}__native absolute q-ma-none q-pa-none`);const S=[D("div",{class:w.value,style:d.value,"aria-hidden":"true"},s)];f.value!==null&&S.push(f.value);const E=e.label!==void 0?pe(a.default,[e.label]):be(a.default);return E!==void 0&&S.push(D("div",{class:`q-${n}__label q-anchor--skip`},E)),D("div",{ref:h,class:v.value,...G.value,onClick:O,onKeydown:j,onKeyup:u},S)}}const et=()=>D("div",{key:"svg",class:"q-checkbox__bg absolute"},[D("svg",{class:"q-checkbox__svg fit absolute-full",viewBox:"0 0 24 24"},[D("path",{class:"q-checkbox__truthy",fill:"none",d:"M1.73,12.91 8.1,19.28 22.79,4.59"}),D("path",{class:"q-checkbox__indet",d:"M4,14H20V10H4"})])]);var tt=he({name:"QCheckbox",props:Ye,emits:Ze,setup(n){const t=et();function e(a,i){const c=k(()=>(a.value===!0?n.checkedIcon:i.value===!0?n.indeterminateIcon:n.uncheckedIcon)||null);return()=>c.value!==null?[D("div",{key:"icon",class:"q-checkbox__icon-container absolute-full flex flex-center no-wrap"},[D(ge,{class:"q-checkbox__icon",name:c.value})])]:[t]}return Je("checkbox",e)}});function ce(n){if(n===!1)return 0;if(n===!0||n===void 0)return 1;const t=parseInt(n,10);return isNaN(t)?0:t}var Z=qe({name:"close-popup",beforeMount(n,{value:t}){const e={depth:ce(t),handler(a){e.depth!==0&&setTimeout(()=>{const i=We(n);i!==void 0&&Xe(i,a,e.depth)})},handlerKey(a){$e(a,13)===!0&&e.handler(a)}};n.__qclosepopup=e,n.addEventListener("click",e.handler),n.addEventListener("keyup",e.handlerKey)},updated(n,{value:t,oldValue:e}){t!==e&&(n.__qclosepopup.depth=ce(t))},beforeUnmount(n){const t=n.__qclosepopup;n.removeEventListener("click",t.handler),n.removeEventListener("keyup",t.handlerKey),delete n.__qclosepopup}});/**
 * Vue Currency Input 3.1.0
 * (c) 2018-2024 Matthias Stiller
 * @license MIT
 */var B;(function(n){n.symbol="symbol",n.narrowSymbol="narrowSymbol",n.code="code",n.name="name",n.hidden="hidden"})(B||(B={}));var Q;(function(n){n.precision="precision",n.thousands="thousands",n.millions="millions",n.billions="billions"})(Q||(Q={}));const J=n=>n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),De=n=>n.replace(/^0+(0$|[^0])/,"$1"),ie=(n,t)=>(n.match(new RegExp(J(t),"g"))||[]).length,it=(n,t)=>n.substring(0,n.indexOf(t)),Ie=[",",".","\u066B","\u3002"],de="(0|[1-9]\\d*)";class nt{constructor(t){var e,a,i,c,o,p;const{currency:h,currencyDisplay:f,locale:r,precision:d,accountingSign:b,useGrouping:x}=t;this.locale=r,this.options={currency:h,useGrouping:x,style:"currency",currencySign:b?"accounting":void 0,currencyDisplay:f!==B.hidden?f:void 0};const m=new Intl.NumberFormat(r,this.options),_=m.formatToParts(123456);this.currency=(e=_.find(({type:v})=>v==="currency"))===null||e===void 0?void 0:e.value,this.digits=[0,1,2,3,4,5,6,7,8,9].map(v=>v.toLocaleString(r)),this.decimalSymbol=(a=_.find(({type:v})=>v==="decimal"))===null||a===void 0?void 0:a.value,this.groupingSymbol=(i=_.find(({type:v})=>v==="group"))===null||i===void 0?void 0:i.value,this.minusSign=(c=m.formatToParts(-1).find(({type:v})=>v==="minusSign"))===null||c===void 0?void 0:c.value,this.decimalSymbol===void 0?this.minimumFractionDigits=this.maximumFractionDigits=0:typeof d=="number"?this.minimumFractionDigits=this.maximumFractionDigits=d:(this.minimumFractionDigits=(o=d==null?void 0:d.min)!==null&&o!==void 0?o:m.resolvedOptions().minimumFractionDigits,this.maximumFractionDigits=(p=d==null?void 0:d.max)!==null&&p!==void 0?p:m.resolvedOptions().maximumFractionDigits);const V=v=>it(v,this.digits[1]),P=v=>v.substring(v.lastIndexOf(this.decimalSymbol?this.digits[0]:this.digits[1])+1);this.prefix=V(m.format(1)),this.suffix=P(m.format(1)),this.negativePrefix=V(m.format(-1)),this.negativeSuffix=P(m.format(-1))}parse(t){if(t){const e=this.isNegative(t);t=this.normalizeDigits(t),t=this.stripCurrency(t,e),t=this.stripSignLiterals(t);const a=this.decimalSymbol?`(?:${J(this.decimalSymbol)}(\\d*))?`:"",i=this.stripGroupingSeparator(t).match(new RegExp(`^${de}${a}$`));if(i&&this.isValidIntegerFormat(this.decimalSymbol?t.split(this.decimalSymbol)[0]:t,Number(i[1])))return Number(`${e?"-":""}${this.onlyDigits(i[1])}.${this.onlyDigits(i[2]||"")}`)}return null}isValidIntegerFormat(t,e){const a={...this.options,minimumFractionDigits:0};return[this.stripCurrency(this.normalizeDigits(e.toLocaleString(this.locale,{...a,useGrouping:!0})),!1),this.stripCurrency(this.normalizeDigits(e.toLocaleString(this.locale,{...a,useGrouping:!1})),!1)].includes(t)}format(t,e={minimumFractionDigits:this.minimumFractionDigits,maximumFractionDigits:this.maximumFractionDigits}){return t!=null?t.toLocaleString(this.locale,{...this.options,...e}):""}toFraction(t){return`${this.digits[0]}${this.decimalSymbol}${this.onlyLocaleDigits(t.substring(1)).substring(0,this.maximumFractionDigits)}`}isFractionIncomplete(t){return!!this.normalizeDigits(this.stripGroupingSeparator(t)).match(new RegExp(`^${de}${J(this.decimalSymbol)}$`))}isNegative(t){return t.startsWith(this.negativePrefix)||this.minusSign===void 0&&(t.startsWith("(")||t.startsWith("-"))||this.minusSign!==void 0&&t.replace("-",this.minusSign).startsWith(this.minusSign)}insertCurrency(t,e){return`${e?this.negativePrefix:this.prefix}${t}${e?this.negativeSuffix:this.suffix}`}stripGroupingSeparator(t){return this.groupingSymbol!==void 0?t.replace(new RegExp(J(this.groupingSymbol),"g"),""):t}stripSignLiterals(t){return this.minusSign!==void 0?t.replace("-",this.minusSign).replace(this.minusSign,""):t.replace(/[-()]/g,"")}stripCurrency(t,e){return t.replace(e?this.negativePrefix:this.prefix,"").replace(e?this.negativeSuffix:this.suffix,"")}normalizeDecimalSeparator(t,e){return Ie.forEach(a=>{t=t.substring(0,e)+t.substring(e).replace(a,this.decimalSymbol)}),t}normalizeDigits(t){return this.digits[0]!=="0"&&this.digits.forEach((e,a)=>{t=t.replace(new RegExp(e,"g"),String(a))}),t}onlyDigits(t){return this.normalizeDigits(t).replace(/\D+/g,"")}onlyLocaleDigits(t){return t.replace(new RegExp(`[^${this.digits.join("")}]*`,"g"),"")}}class Ce{constructor(t){this.currencyFormat=t}}class at extends Ce{conformToMask(t,e=""){const a=this.currencyFormat.isNegative(t),i=m=>m===""&&a&&!(this.currencyFormat.minusSign===void 0?e===this.currencyFormat.negativePrefix+this.currencyFormat.negativeSuffix:e===this.currencyFormat.negativePrefix),c=m=>{if(i(m))return"";if(this.currencyFormat.maximumFractionDigits>0){if(this.currencyFormat.isFractionIncomplete(m))return m;if(m.startsWith(this.currencyFormat.decimalSymbol))return this.currencyFormat.toFraction(m)}return null};let o=t;o=this.currencyFormat.stripCurrency(o,a),o=this.currencyFormat.stripSignLiterals(o);const p=c(o);if(p!=null)return this.currencyFormat.insertCurrency(p,a);const[h,...f]=o.split(this.currencyFormat.decimalSymbol),r=De(this.currencyFormat.onlyDigits(h)),d=this.currencyFormat.onlyDigits(f.join("")).substring(0,this.currencyFormat.maximumFractionDigits),b=f.length>0&&d.length===0,x=r===""&&a&&(this.currencyFormat.minusSign===void 0?e===t.slice(0,-2)+this.currencyFormat.negativeSuffix:e===t.slice(0,-1));return b||x||i(r)?e:r.match(/\d+/)?{numberValue:Number(`${a?"-":""}${r}.${d}`),fractionDigits:d}:""}}class st extends Ce{conformToMask(t,e=""){if(t===""||this.currencyFormat.parse(e)===0&&this.currencyFormat.stripCurrency(e,!0).slice(0,-1)===this.currencyFormat.stripCurrency(t,!0))return"";const a=this.currencyFormat.isNegative(t),i=this.currencyFormat.stripSignLiterals(t)===""?-0:Number(`${a?"-":""}${De(this.currencyFormat.onlyDigits(t))}`)/Math.pow(10,this.currencyFormat.maximumFractionDigits);return{numberValue:i,fractionDigits:i.toFixed(this.currencyFormat.maximumFractionDigits).slice(-this.currencyFormat.maximumFractionDigits)}}}const lt={locale:void 0,currency:void 0,currencyDisplay:void 0,hideGroupingSeparatorOnFocus:!0,hideCurrencySymbolOnFocus:!0,hideNegligibleDecimalDigitsOnFocus:!0,precision:void 0,autoDecimalDigits:!1,valueRange:void 0,useGrouping:void 0,valueScaling:void 0};class ot{constructor(t){this.el=t.el,this.onInput=t.onInput,this.onChange=t.onChange,this.addEventListener(),this.init(t.options)}setOptions(t){this.init(t),this.format(this.currencyFormat.format(this.validateValueRange(this.numberValue))),this.onChange(this.getValue())}getValue(){return{number:this.valueScaling&&this.numberValue!=null?this.toInteger(this.numberValue,this.valueScaling):this.numberValue,formatted:this.formattedValue}}setValue(t){const e=this.valueScaling!==void 0&&t!=null?this.toFloat(t,this.valueScaling):t;e!==this.numberValue&&(this.format(this.currencyFormat.format(this.validateValueRange(e))),this.onChange(this.getValue()))}init(t){this.options={...lt,...t},this.options.autoDecimalDigits&&(this.options.hideNegligibleDecimalDigitsOnFocus=!1),this.el.getAttribute("inputmode")||this.el.setAttribute("inputmode",this.options.autoDecimalDigits?"numeric":"decimal"),this.currencyFormat=new nt(this.options),this.numberMask=this.options.autoDecimalDigits?new st(this.currencyFormat):new at(this.currencyFormat);const e={[Q.precision]:this.currencyFormat.maximumFractionDigits,[Q.thousands]:3,[Q.millions]:6,[Q.billions]:9};this.valueScaling=this.options.valueScaling?e[this.options.valueScaling]:void 0,this.valueScalingFractionDigits=this.valueScaling!==void 0&&this.options.valueScaling!==Q.precision?this.valueScaling+this.currencyFormat.maximumFractionDigits:this.currencyFormat.maximumFractionDigits,this.minValue=this.getMinValue(),this.maxValue=this.getMaxValue()}getMinValue(){var t,e;let a=this.toFloat(-Number.MAX_SAFE_INTEGER);return((t=this.options.valueRange)===null||t===void 0?void 0:t.min)!==void 0&&(a=Math.max((e=this.options.valueRange)===null||e===void 0?void 0:e.min,this.toFloat(-Number.MAX_SAFE_INTEGER))),a}getMaxValue(){var t,e;let a=this.toFloat(Number.MAX_SAFE_INTEGER);return((t=this.options.valueRange)===null||t===void 0?void 0:t.max)!==void 0&&(a=Math.min((e=this.options.valueRange)===null||e===void 0?void 0:e.max,this.toFloat(Number.MAX_SAFE_INTEGER))),a}toFloat(t,e){return t/Math.pow(10,e!=null?e:this.valueScalingFractionDigits)}toInteger(t,e){return Number(t.toFixed(e!=null?e:this.valueScalingFractionDigits).split(".").join(""))}validateValueRange(t){return t!=null?Math.min(Math.max(t,this.minValue),this.maxValue):t}format(t,e=!1){if(t!=null){this.decimalSymbolInsertedAt!==void 0&&(t=this.currencyFormat.normalizeDecimalSeparator(t,this.decimalSymbolInsertedAt),this.decimalSymbolInsertedAt=void 0);const a=this.numberMask.conformToMask(t,this.formattedValue);let i;if(typeof a=="object"){const{numberValue:c,fractionDigits:o}=a;let{maximumFractionDigits:p,minimumFractionDigits:h}=this.currencyFormat;this.focus?h=e?o.replace(/0+$/,"").length:Math.min(p,o.length):Number.isInteger(c)&&!this.options.autoDecimalDigits&&(this.options.precision===void 0||h===0)&&(h=p=0),i=this.toInteger(Math.abs(c))>Number.MAX_SAFE_INTEGER?this.formattedValue:this.currencyFormat.format(c,{useGrouping:this.options.useGrouping!==!1&&!(this.focus&&this.options.hideGroupingSeparatorOnFocus),minimumFractionDigits:h,maximumFractionDigits:p})}else i=a;this.maxValue<=0&&!this.currencyFormat.isNegative(i)&&this.currencyFormat.parse(i)!==0&&(i=i.replace(this.currencyFormat.prefix,this.currencyFormat.negativePrefix)),this.minValue>=0&&(i=i.replace(this.currencyFormat.negativePrefix,this.currencyFormat.prefix)),(this.options.currencyDisplay===B.hidden||this.focus&&this.options.hideCurrencySymbolOnFocus)&&(i=i.replace(this.currencyFormat.negativePrefix,this.currencyFormat.minusSign!==void 0?this.currencyFormat.minusSign:"(").replace(this.currencyFormat.negativeSuffix,this.currencyFormat.minusSign!==void 0?"":")").replace(this.currencyFormat.prefix,"").replace(this.currencyFormat.suffix,"")),this.el.value=i,this.numberValue=this.currencyFormat.parse(i)}else this.el.value="",this.numberValue=null;this.formattedValue=this.el.value,this.onInput(this.getValue())}addEventListener(){this.el.addEventListener("input",t=>{const{value:e,selectionStart:a}=this.el,i=t;if(a&&i.data&&Ie.includes(i.data)&&(this.decimalSymbolInsertedAt=a-1),this.format(e),this.focus&&a!=null){const c=()=>{const{prefix:o,suffix:p,decimalSymbol:h,maximumFractionDigits:f,groupingSymbol:r}=this.currencyFormat;let d=e.length-a;const b=this.formattedValue.length;if(this.currencyFormat.minusSign===void 0&&(e.startsWith("(")||e.startsWith("-"))&&!e.endsWith(")"))return b-this.currencyFormat.negativeSuffix.length>1?this.formattedValue.substring(a).length:1;if(this.formattedValue.substring(a,1)===r&&ie(this.formattedValue,r)===ie(e,r)+1)return b-d-1;if(b<d)return a;if(h!==void 0&&e.indexOf(h)!==-1){const x=e.indexOf(h)+1;if(Math.abs(b-e.length)>1&&a<=x)return this.formattedValue.indexOf(h)+1;!this.options.autoDecimalDigits&&a>x&&this.currencyFormat.onlyDigits(e.substring(x)).length-1===f&&(d-=1)}return this.options.hideCurrencySymbolOnFocus||this.options.currencyDisplay===B.hidden?b-d:Math.max(b-Math.max(d,p.length),o.length)};this.setCaretPosition(c())}}),this.el.addEventListener("focus",()=>{this.focus=!0,this.numberValueOnFocus=this.numberValue,setTimeout(()=>{const{value:t,selectionStart:e,selectionEnd:a}=this.el;if(this.format(t,this.options.hideNegligibleDecimalDigitsOnFocus),e!=null&&a!=null&&Math.abs(e-a)>0)this.setCaretPosition(0,this.el.value.length);else if(e!=null){const i=this.getCaretPositionOnFocus(t,e);this.setCaretPosition(i)}})}),this.el.addEventListener("blur",()=>{this.focus=!1,this.format(this.currencyFormat.format(this.validateValueRange(this.numberValue))),this.numberValueOnFocus!==this.numberValue&&this.onChange(this.getValue())})}getCaretPositionOnFocus(t,e){if(this.numberValue==null)return e;const{prefix:a,negativePrefix:i,suffix:c,negativeSuffix:o,groupingSymbol:p,currency:h}=this.currencyFormat,f=this.numberValue<0,r=f?i:a,d=r.length;if(this.options.hideCurrencySymbolOnFocus||this.options.currencyDisplay===B.hidden){if(f){if(e<=1)return 1;if(t.endsWith(")")&&e>t.indexOf(")"))return this.formattedValue.length-1}}else{const x=f?o.length:c.length;if(e>=t.length-x)return this.formattedValue.length-x;if(e<d)return d}let b=e;return this.options.hideCurrencySymbolOnFocus&&this.options.currencyDisplay!==B.hidden&&e>=d&&h!==void 0&&r.includes(h)&&(b-=d,f&&(b+=1)),this.options.hideGroupingSeparatorOnFocus&&p!==void 0&&(b-=ie(t.substring(0,e),p)),b}setCaretPosition(t,e=t){this.el.setSelectionRange(t,e)}}const rt=n=>n!=null&&n.matches("input")?n:n==null?void 0:n.querySelector("input");function ut(n,t){var e,a,i,c;let o;const p=N(null),h=N(null),f=N(null),r=ae(),d=(r==null?void 0:r.emit)||((a=(e=r==null?void 0:r.proxy)===null||e===void 0?void 0:e.$emit)===null||a===void 0?void 0:a.bind(r==null?void 0:r.proxy)),b=(r==null?void 0:r.props)||((i=r==null?void 0:r.proxy)===null||i===void 0?void 0:i.$props),x=we.startsWith("3"),m=x&&((c=r==null?void 0:r.attrs.modelModifiers)===null||c===void 0?void 0:c.lazy),_=k(()=>b==null?void 0:b[x?"modelValue":"value"]),V=x?"update:modelValue":"input",P=m?"update:modelValue":"change";return ne(p,v=>{var w;if(v){const y=rt((w=v==null?void 0:v.$el)!==null&&w!==void 0?w:v);y?(o=new ot({el:y,options:n,onInput:$=>{!m&&t!==!1&&_.value!==$.number&&(d==null||d(V,$.number)),f.value=$.number,h.value=$.formatted},onChange:$=>{t!==!1&&(d==null||d(P,$.number))}}),o.setValue(_.value)):console.error('No input element found. Please make sure that the "inputRef" template ref is properly assigned.')}else o=null}),{inputRef:p,numberValue:f,formattedValue:h,setValue:v=>o==null?void 0:o.setValue(v),setOptions:v=>o==null?void 0:o.setOptions(v)}}const me={__name:"CurrencyInput",props:{modelValue:Number,currency:String,label:String},emits:["change","update:modelValue"],setup(n,{emit:t}){const e=n,{inputRef:a,formattedValue:i,setValue:c,setOptions:o}=ut({currency:e.currency,currencyDisplay:"hidden",valueScaling:"precision",valueRange:{min:0,max:void 0},autoSign:!0});return ne(()=>e.modelValue,p=>{c(p)}),ne(()=>e.currency,p=>{o({currency:p})}),(p,h)=>(q(),M(ye,{ref_key:"inputRef",ref:a,modelValue:I(i),"onUpdate:modelValue":h[0]||(h[0]=f=>Ee(i)?i.value=f:null),outlined:"",label:e.label,onFocus:h[1]||(h[1]=f=>I(a).select())},null,8,["modelValue","label"]))}},ct={class:"q-gutter-none"},dt={class:"text-center"},mt={class:"q-gutter-none"},ht={class:"text-center"},ft={key:0,class:"text-center text-caption text-green"},vt={class:"q-gutter-none"},gt={class:"text-center"},pt={key:0,class:"text-center text-caption text-green"},bt={class:"q-gutter-none"},yt={class:"text-center"},xt={key:0,class:"text-center text-caption text-red"},Ft={class:"q-gutter-none"},St={class:"text-center"},Vt={key:0,class:"text-center text-caption text-red"},_t={class:"q-mr-sx",style:{display:"flex"}},Mt={__name:"TransactionPage",setup(n){const t=ze(),e=Pe(),a=Oe(),i=N(e.getEditableTransaction()),c=N(!1),o=N(null),p=N(null),h=N(!1);Ne(()=>{var u;(u=p.value)==null||u.focus()});const f=k({get:()=>e.personIdx2Id(i.value.payer)||"",set:u=>{i.value.payer=e.personId2Idx(u)}}),r=k({get:()=>{const u=i.value.debts.map((l,s)=>l.isDebtor?s:-1).filter(l=>l!==-1);return u.length===1?e.personIdx2Id(u[0]):null},set:u=>{const l=e.personId2Idx(u);i.value.debts.forEach((s,S)=>{s.isDebtor=S===l}),O(!1)}}),d=()=>{if(r.value!==null){if(f.value===r.value)return;const u=e.personId2Idx(f.value),l=e.personId2Idx(r.value);i.value.payer=l,i.value.debts.forEach((s,S)=>{s.isDebtor=S===u}),O(!1)}},b=Ue.data.map(u=>({label:`${u.code} - ${u.currency}`,value:u.code})),x=N(b),m=e.currentSheetPeople.find(u=>u!==e.user.id),_=e.currentSheetPeople.findIndex(u=>u!==e.user.id),V=e.currentSheetPeople.findIndex(u=>u===e.user.id),P=k(()=>X.state(i.value)),v=(u,l)=>{switch(u){case 0:return(l===V?"You are":`${e.getName(m)} is`)+" owed the full amount";case 1:return(l===V?"You":e.getName(m))+" paid, split equally";default:return"Custom"}},w=(u,l)=>{const s=u===0?i.value.amount:(i.value.amount+i.value.amount%2)/2;return l===V?`${e.getName(m)} owes you ${re.displayCurrency(i.value.currency,s)}`:`You owe ${e.getName(m)} ${re.displayCurrency(i.value.currency,s)}`},y=u=>{switch(u){case 0:i.value.payer=V,i.value.debts[0].isDebtor=!0,i.value.debts[1].isDebtor=!0;break;case 1:i.value.payer=V,i.value.debts[V].isDebtor=!1,i.value.debts[_].isDebtor=!0;break;case 2:i.value.payer=_,i.value.debts[0].isDebtor=!0,i.value.debts[1].isDebtor=!0;break;case 3:i.value.payer=_,i.value.debts[V].isDebtor=!0,i.value.debts[_].isDebtor=!1;break;default:return}O(!0)},$=(u,l)=>{if(u===""){l(()=>{x.value=b});return}i.value.currency="";const s=u.toLowerCase();l(()=>{const S=b.filter(E=>E.value.toLowerCase().includes(s));x.value=S,x.value.length===1&&(i.value.currency=x.value[0].value,o.value&&(o.value.updateInputValue(""),setTimeout(()=>{o.value.hidePopup()},0)))})},G=u=>{h.value||(h.value=!0,X.clearOwedAmounts(i.value,u)),X.fillLastOwedAmount(i.value)&&t.notify("The amount has been increased to match the sum of the shares.")},O=u=>{(u||!h.value)&&(h.value=!1,X.split(i.value))},Y=()=>{e.transactionId=null,a.go(-1)},j=async()=>{try{X.check(i.value),await e.addTransaction(i.value),e.transactionId=null,Y()}catch(u){t.notify({message:u.message||u,color:"negative"});return}};return(u,l)=>(q(),L(se,null,[g(Le,{elevated:"",class:"bg-primary text-white"},{default:F(()=>[g(Te,null,{default:F(()=>[g(z,{flat:"",icon:"arrow_back",onClick:Y,"aria-label":"Go Back",class:"bg-white text-primary"}),g(Ae),g(z,{flat:"",icon:c.value?"visibility_off":"visibility",label:c.value?"Hide":"Show",onClick:l[0]||(l[0]=s=>c.value=!c.value),class:"q-ml-md bg-white text-primary","aria-label":"Toggle active state"},null,8,["icon","label"]),g(z,{flat:"",icon:"done",label:"Confirm",onClick:j,class:"q-ml-md bg-secondary text-white","aria-label":"Save"})]),_:1})]),_:1}),g(Ge,null,{default:F(()=>[g(te,{class:"q-my-md q-mr-md q-ml-md"},{default:F(()=>[g(U,null,{default:F(()=>[g(ye,{ref_key:"nameInput",ref:p,modelValue:i.value.name,"onUpdate:modelValue":l[1]||(l[1]=s=>i.value.name=s),label:"Transaction Name",outlined:"",onFocus:l[2]||(l[2]=s=>p.value.select())},null,8,["modelValue"])]),_:1}),g(U,{class:"row",style:{"align-items":"center"}},{default:F(()=>[g(je,{class:"q-mr-md",ref_key:"currencySelect",ref:o,label:"Select a Currency",filled:"",modelValue:i.value.currency,"onUpdate:modelValue":l[3]||(l[3]=s=>i.value.currency=s),options:x.value,"option-label":"label","option-value":"value","option-slot":"","emit-value":"","use-input":"","input-debounce":"0",onFilter:$,style:{maxWidth:"130px"}},null,8,["modelValue","options"]),g(me,{modelValue:i.value.amount,"onUpdate:modelValue":[l[4]||(l[4]=s=>i.value.amount=s),l[5]||(l[5]=s=>O(!0))],currency:"XXX",style:{flex:"1"},label:"Amount"},null,8,["modelValue"])]),_:1})]),_:1}),g(te,{class:"q-my-md q-mr-md q-ml-md"},{default:F(()=>[i.value.debts.length===2?(q(),M(U,{key:0,class:"column items-center"},{default:F(()=>[g(Qe,{class:"full-width"},{label:F(()=>[C("div",ct,[C("div",dt,R(v(P.value,i.value.payer)),1),P.value!==-1&&i.value.amount!==0?(q(),L("div",{key:0,class:le(["text-center text-caption",i.value.payer===I(V)?"text-green":"text-red"])},R(w(P.value,i.value.payer)),3)):T("",!0)])]),default:F(()=>[g(oe,null,{default:F(()=>[W((q(),M(K,{clickable:"",class:"bg-white",onClick:l[6]||(l[6]=s=>y(0))},{default:F(()=>[g(H,null,{default:F(()=>[C("div",mt,[C("div",ht,R(v(1,I(V))),1),i.value.amount?(q(),L("div",ft,R(w(1,I(V))),1)):T("",!0)])]),_:1})]),_:1})),[[Z]]),W((q(),M(K,{clickable:"",class:"bg-grey-3",onClick:l[7]||(l[7]=s=>y(1))},{default:F(()=>[g(H,null,{default:F(()=>[C("div",vt,[C("div",gt,R(v(0,I(V))),1),i.value.amount?(q(),L("div",pt,R(w(0,I(V))),1)):T("",!0)])]),_:1})]),_:1})),[[Z]]),W((q(),M(K,{clickable:"",class:"bg-white",onClick:l[8]||(l[8]=s=>y(2))},{default:F(()=>[g(H,null,{default:F(()=>[C("div",bt,[C("div",yt,R(v(1,I(_))),1),i.value.amount?(q(),L("div",xt,R(w(1,I(_))),1)):T("",!0)])]),_:1})]),_:1})),[[Z]]),W((q(),M(K,{clickable:"",class:"bg-grey-3",onClick:l[9]||(l[9]=s=>y(3))},{default:F(()=>[g(H,null,{default:F(()=>[C("div",Ft,[C("div",St,R(v(0,I(_))),1),i.value.amount?(q(),L("div",Vt,R(w(0,I(_))),1)):T("",!0)])]),_:1})]),_:1})),[[Z]])]),_:1})]),_:1})]),_:1})):T("",!0),i.value.debts.length>2?(q(),M(U,{key:1,class:"row justify-center items-center"},{default:F(()=>[g(ue,{class:"col-auto q-mr-sm",modelValue:f.value,"onUpdate:modelValue":l[10]||(l[10]=s=>f.value=s),people:I(e).currentSheet.people,"sorted-people":I(e).currentSheetPeople,"fixed-label":"Payer"},null,8,["modelValue","people","sorted-people"]),g(z,{class:"col-auto q-mr-sm",icon:"swap_horiz",onClick:d}),g(ue,{class:"col-auto",modelValue:r.value,"onUpdate:modelValue":l[11]||(l[11]=s=>r.value=s),people:I(e).currentSheet.people,"sorted-people":I(e).currentSheetPeople,"fixed-label":"Debtor"},null,8,["modelValue","people","sorted-people"])]),_:1})):T("",!0),g(U,{class:"row justify-center items-center"},{default:F(()=>[g(z,{flat:"",icon:"done",label:"Cancel",onClick:j,class:"q-mr-md bg-red text-white","aria-label":"Save"}),g(z,{flat:"",icon:"done",label:"Confirm",onClick:j,class:"bg-secondary text-white","aria-label":"Save"})]),_:1})]),_:1}),g(te,{class:"q-my-md q-mr-md q-ml-md q-mb-md"},{default:F(()=>[g(U,null,{default:F(()=>l[15]||(l[15]=[C("div",{class:"row text-bold"},[C("div",{class:"col-auto q-mr-md q-ml-sm"},"Payer"),C("div",{class:"col"},"Person"),C("div",{class:"col-auto q-mr-md"},"Debtor"),C("div",{class:"col-auto q-mr-lg"},"Amount")],-1)])),_:1}),g(oe,{class:"q-my-md q-mr-md q-ml-md"},{default:F(()=>[(q(!0),L(se,null,Re(I(e).currentSheetPeople,(s,S)=>W((q(),M(K,{key:S,class:le(S%2===0?"bg-grey-1":"bg-white")},{default:F(()=>[C("div",_t,[g(He,{modelValue:i.value.payer,"onUpdate:modelValue":[l[12]||(l[12]=E=>i.value.payer=E),l[13]||(l[13]=E=>O(!1))],val:S},null,8,["modelValue","val"])]),g(H,null,{default:F(()=>[g(Be,{id:s,"max-length":13},null,8,["id"])]),_:2},1024),g(tt,{modelValue:i.value.debts[S].isDebtor,"onUpdate:modelValue":[E=>i.value.debts[S].isDebtor=E,l[14]||(l[14]=E=>O(!0))],class:"q-mr-sx"},null,8,["modelValue","onUpdate:modelValue"]),g(me,{modelValue:i.value.debts[S].owedAmount,"onUpdate:modelValue":E=>i.value.debts[S].owedAmount=E,currency:"XXX",style:{maxWidth:"100px"},onBlur:E=>G(S)},null,8,["modelValue","onUpdate:modelValue","onBlur"])]),_:2},1032,["class"])),[[Me,I(e).currentSheet.people[s].active||c.value||i.value.payer===S||i.value.debts[S].owedAmount!==0||i.value.debts[S].isDebtor]])),128))]),_:1})]),_:1})]),_:1})],64))}};export{Mt as default};
