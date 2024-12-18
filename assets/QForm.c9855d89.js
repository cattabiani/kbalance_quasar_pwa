import{c as E,r as P,_ as q,$ as A,o as B,h as I,b as R,g as V,ah as Q,T as S,z as $,p as j,X as D}from"./index.3798f6c3.js";import{g as O}from"./use-quasar.81b07841.js";var K=E({name:"QForm",props:{autofocus:Boolean,noErrorFocus:Boolean,noResetFocus:Boolean,greedy:Boolean,onSubmit:Function},emits:["reset","validationSuccess","validationError"],setup(a,{slots:F,emit:f}){const C=V(),u=P(null);let s=0;const i=[];function d(e){const r=typeof e=="boolean"?e:a.noErrorFocus!==!0,l=++s,h=(t,o)=>{f(`validation${t===!0?"Success":"Error"}`,o)},x=t=>{const o=t.validate();return typeof o.then=="function"?o.then(n=>({valid:n,comp:t}),n=>({valid:!1,comp:t,err:n})):Promise.resolve({valid:o,comp:t})};return(a.greedy===!0?Promise.all(i.map(x)).then(t=>t.filter(o=>o.valid!==!0)):i.reduce((t,o)=>t.then(()=>x(o).then(n=>{if(n.valid===!1)return Promise.reject(n)})),Promise.resolve()).catch(t=>[t])).then(t=>{if(t===void 0||t.length===0)return l===s&&h(!0),!0;if(l===s){const{comp:o,err:n}=t[0];if(n!==void 0&&console.error(n),h(!1,o),r===!0){const g=t.find(({comp:p})=>typeof p.focus=="function"&&Q(p.$)===!1);g!==void 0&&g.comp.focus()}}return!1})}function v(){s++,i.forEach(e=>{typeof e.resetValidation=="function"&&e.resetValidation()})}function m(e){e!==void 0&&S(e);const r=s+1;d().then(l=>{r===s&&l===!0&&(a.onSubmit!==void 0?f("submit",e):e!==void 0&&e.target!==void 0&&typeof e.target.submit=="function"&&e.target.submit())})}function b(e){e!==void 0&&S(e),f("reset"),$(()=>{v(),a.autofocus===!0&&a.noResetFocus!==!0&&c()})}function c(){O(()=>{if(u.value===null)return;const e=u.value.querySelector("[autofocus][tabindex], [data-autofocus][tabindex]")||u.value.querySelector("[autofocus] [tabindex], [data-autofocus] [tabindex]")||u.value.querySelector("[autofocus], [data-autofocus]")||Array.prototype.find.call(u.value.querySelectorAll("[tabindex]"),r=>r.tabIndex!==-1);e!=null&&e.focus({preventScroll:!0})})}j(D,{bindComponent(e){i.push(e)},unbindComponent(e){const r=i.indexOf(e);r!==-1&&i.splice(r,1)}});let y=!1;return q(()=>{y=!0}),A(()=>{y===!0&&a.autofocus===!0&&c()}),B(()=>{a.autofocus===!0&&c()}),Object.assign(C.proxy,{validate:d,resetValidation:v,submit:m,reset:b,focus:c,getValidationComponents:()=>i}),()=>I("form",{class:"q-form",ref:u,onSubmit:m,onReset:b},R(F.default))}});export{K as Q};
