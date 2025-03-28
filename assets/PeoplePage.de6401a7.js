import{_ as y,r as p,w as f,u as b,$ as w,y as a,x as i,a0 as _,a1 as k,Z as n,a2 as g}from"./index.a806d26d.js";import{Q as h}from"./QSpace.7ffd943e.js";import{Q as x,a as P}from"./PersonItem.7fcf1ebd.js";import{e as Q,c as S}from"./QPage.c0d6ab01.js";import{_ as B}from"./PeopleList.403d545e.js";import"./focusout.4c62d806.js";import"./scroll.6ce354fe.js";import"./QResizeObserver.2d174bfe.js";import"./QSlideItem.581009df.js";import"./ReceiveString.85a91612.js";import"./QInput.8061a07f.js";import"./QCardActions.790974cc.js";import"./QDialog.24e6bdaa.js";import"./PeopleDropdown.1eb61a1f.js";const T=Object.assign({name:"PeoplePage"},{__name:"PeoplePage",setup(C){const t=y(),m=k(),u=S(),o=p(!1),c=p(null),d=async()=>{try{await t.setPeople(c.value.getPeople())}catch(e){u.notify({message:e.message||e,color:"negative"});return}s()},s=()=>{m.go(-1)};f(t.currentSheet,async e=>{e===null&&s()},{immediate:!0});const v=async()=>{try{await t.logout(),m.push({name:"LoginPage"})}catch(e){u.notify({message:e.message||e,color:"negative"});return}};return f(t.userLedger,async e=>{e===null&&await v()},{immediate:!0}),(e,r)=>(b(),w(_,null,[a(x,{elevated:"",class:"bg-primary text-white"},{default:i(()=>[a(P,null,{default:i(()=>[a(n,{flat:"",icon:"arrow_back",onClick:s,"aria-label":"Go Back",class:"bg-white text-primary"}),a(h),a(n,{flat:"",class:"q-ml-md bg-white text-primary",icon:o.value?"visibility_off":"visibility",label:o.value?"Hide":"Show",onClick:r[0]||(r[0]=l=>o.value=!o.value)},null,8,["icon","label"]),a(n,{flat:"",class:"q-ml-md bg-secondary text-white",icon:"done",label:"Confirm",onClick:d})]),_:1})]),_:1}),a(Q,null,{default:i(()=>[a(B,{modelValue:g(t).currentSheet.people,"onUpdate:modelValue":r[1]||(r[1]=l=>g(t).currentSheet.people=l),seeInactive:o.value,"onUpdate:seeInactive":r[2]||(r[2]=l=>o.value=l),ref_key:"peopleListRef",ref:c},null,8,["modelValue","seeInactive"])]),_:1})],64))}});export{T as default};
