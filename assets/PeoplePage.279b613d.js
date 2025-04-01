import{_ as y,r as p,w as f,u as b,$ as w,y as a,x as i,a0 as _,a1 as k,Z as n,a2 as g}from"./index.1f84b456.js";import{Q as h}from"./QSpace.e4f0781e.js";import{Q as x,a as P}from"./PersonItem.b5ba6d99.js";import{e as Q,c as S}from"./QPage.dcbf423d.js";import{_ as B}from"./PeopleList.d444d7d5.js";import"./focusout.3daaa7da.js";import"./scroll.7de0e846.js";import"./QResizeObserver.a8e240c3.js";import"./QSlideItem.5d8c60d2.js";import"./ReceiveString.367b4b61.js";import"./QCardActions.51c84c85.js";import"./QDialog.6840c86b.js";import"./PeopleDropdown.27490719.js";const O=Object.assign({name:"PeoplePage"},{__name:"PeoplePage",setup(C){const t=y(),m=k(),u=S(),o=p(!1),c=p(null),d=async()=>{try{await t.setPeople(c.value.getPeople())}catch(e){u.notify({message:e.message||e,color:"negative"});return}s()},s=()=>{m.go(-1)};f(t.currentSheet,async e=>{e===null&&s()},{immediate:!0});const v=async()=>{try{await t.logout(),m.push({name:"LoginPage"})}catch(e){u.notify({message:e.message||e,color:"negative"});return}};return f(t.userLedger,async e=>{e===null&&await v()},{immediate:!0}),(e,r)=>(b(),w(_,null,[a(x,{elevated:"",class:"bg-primary text-white"},{default:i(()=>[a(P,null,{default:i(()=>[a(n,{flat:"",icon:"arrow_back",onClick:s,"aria-label":"Go Back",class:"bg-white text-primary"}),a(h),a(n,{flat:"",class:"q-ml-md bg-white text-primary",icon:o.value?"visibility_off":"visibility",label:o.value?"Hide":"Show",onClick:r[0]||(r[0]=l=>o.value=!o.value)},null,8,["icon","label"]),a(n,{flat:"",class:"q-ml-md bg-secondary text-white",icon:"done",label:"Confirm",onClick:d})]),_:1})]),_:1}),a(Q,null,{default:i(()=>[a(B,{modelValue:g(t).currentSheet.people,"onUpdate:modelValue":r[1]||(r[1]=l=>g(t).currentSheet.people=l),seeInactive:o.value,"onUpdate:seeInactive":r[2]||(r[2]=l=>o.value=l),ref_key:"peopleListRef",ref:c},null,8,["modelValue","seeInactive"])]),_:1})],64))}});export{O as default};
