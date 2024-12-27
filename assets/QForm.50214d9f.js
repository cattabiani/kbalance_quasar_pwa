import{c as C,r as P,I as q,J as A,o as I,h as B,b as R,g as V,as as Q,E as S,z as j,p as D,ad as O}from"./index.4750bf8b.js";import{g as $}from"./QPage.88ea25c0.js";var K=C({name:"QForm",props:{autofocus:Boolean,noErrorFocus:Boolean,noResetFocus:Boolean,greedy:Boolean,onSubmit:Function},emits:["reset","validationSuccess","validationError"],setup(r,{slots:E,emit:f}){const F=V(),s=P(null);let u=0;const i=[];function d(e){const a=typeof e=="boolean"?e:r.noErrorFocus!==!0,l=++u,x=(t,o)=>{f(`validation${t===!0?"Success":"Error"}`,o)},g=t=>{const o=t.validate();return typeof o.then=="function"?o.then(n=>({valid:n,comp:t}),n=>({valid:!1,comp:t,err:n})):Promise.resolve({valid:o,comp:t})};return(r.greedy===!0?Promise.all(i.map(g)).then(t=>t.filter(o=>o.valid!==!0)):i.reduce((t,o)=>t.then(()=>g(o).then(n=>{if(n.valid===!1)return Promise.reject(n)})),Promise.resolve()).catch(t=>[t])).then(t=>{if(t===void 0||t.length===0)return l===u&&x(!0),!0;if(l===u){const{comp:o,err:n}=t[0];if(n!==void 0&&console.error(n),x(!1,o),a===!0){const h=t.find(({comp:p})=>typeof p.focus=="function"&&Q(p.$)===!1);h!==void 0&&h.comp.focus()}}return!1})}function v(){u++,i.forEach(e=>{typeof e.resetValidation=="function"&&e.resetValidation()})}function m(e){e!==void 0&&S(e);const a=u+1;d().then(l=>{a===u&&l===!0&&(r.onSubmit!==void 0?f("submit",e):e!==void 0&&e.target!==void 0&&typeof e.target.submit=="function"&&e.target.submit())})}function b(e){e!==void 0&&S(e),f("reset"),j(()=>{v(),r.autofocus===!0&&r.noResetFocus!==!0&&c()})}function c(){$(()=>{if(s.value===null)return;const e=s.value.querySelector("[autofocus][tabindex], [data-autofocus][tabindex]")||s.value.querySelector("[autofocus] [tabindex], [data-autofocus] [tabindex]")||s.value.querySelector("[autofocus], [data-autofocus]")||Array.prototype.find.call(s.value.querySelectorAll("[tabindex]"),a=>a.tabIndex!==-1);e!=null&&e.focus({preventScroll:!0})})}D(O,{bindComponent(e){i.push(e)},unbindComponent(e){const a=i.indexOf(e);a!==-1&&i.splice(a,1)}});let y=!1;return q(()=>{y=!0}),A(()=>{y===!0&&r.autofocus===!0&&c()}),I(()=>{r.autofocus===!0&&c()}),Object.assign(F.proxy,{validate:d,resetValidation:v,submit:m,reset:b,focus:c,getValidationComponents:()=>i}),()=>B("form",{class:"q-form",ref:s,onSubmit:m,onReset:b},R(E.default))}});export{K as Q};
