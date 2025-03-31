import{_ as y,r as p,w as f,u as b,$ as w,y as t,x as i,a0 as _,a1 as k,Z as n,a2 as g}from"./index.b327dff4.js";import{Q as h}from"./QSpace.53215b27.js";import{Q as x,a as P}from"./QHeader.f3de409e.js";import{d as Q}from"./QPage.d89aa49d.js";import{u as S}from"./use-quasar.e67a33c2.js";import{_ as B}from"./PeopleList.47e58692.js";import"./QResizeObserver.994fd92b.js";import"./PersonItem.328be996.js";import"./focusout.d17da46a.js";import"./scroll.1ecdcb10.js";import"./QSlideItem.615da973.js";import"./ReceiveString.eacdd943.js";import"./QCardActions.eb58fc86.js";import"./QDialog.5d8f34d5.js";import"./PeopleDropdown.4a66e5cb.js";const Z=Object.assign({name:"PeoplePage"},{__name:"PeoplePage",setup(C){const a=y(),m=k(),u=S(),o=p(!1),c=p(null),d=async()=>{try{await a.setPeople(c.value.getPeople())}catch(e){u.notify({message:e.message||e,color:"negative"});return}s()},s=()=>{m.go(-1)};f(a.currentSheet,async e=>{e===null&&s()},{immediate:!0});const v=async()=>{try{await a.logout(),m.push({name:"LoginPage"})}catch(e){u.notify({message:e.message||e,color:"negative"});return}};return f(a.userLedger,async e=>{e===null&&await v()},{immediate:!0}),(e,r)=>(b(),w(_,null,[t(x,{elevated:"",class:"bg-primary text-white"},{default:i(()=>[t(P,null,{default:i(()=>[t(n,{flat:"",icon:"arrow_back",onClick:s,"aria-label":"Go Back",class:"bg-white text-primary"}),t(h),t(n,{flat:"",class:"q-ml-md bg-white text-primary",icon:o.value?"visibility_off":"visibility",label:o.value?"Hide":"Show",onClick:r[0]||(r[0]=l=>o.value=!o.value)},null,8,["icon","label"]),t(n,{flat:"",class:"q-ml-md bg-secondary text-white",icon:"done",label:"Confirm",onClick:d})]),_:1})]),_:1}),t(Q,null,{default:i(()=>[t(B,{modelValue:g(a).currentSheet.people,"onUpdate:modelValue":r[1]||(r[1]=l=>g(a).currentSheet.people=l),seeInactive:o.value,"onUpdate:seeInactive":r[2]||(r[2]=l=>o.value=l),ref_key:"peopleListRef",ref:c},null,8,["modelValue","seeInactive"])]),_:1})],64))}});export{Z as default};
