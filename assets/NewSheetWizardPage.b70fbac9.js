import{_ as Q,aA as _,r as l,w as P,u as k,$ as S,y as t,x as o,a0 as V,a1 as x,Z as v,Y as h}from"./index.7a2b63cf.js";import{Q as N}from"./QToolbarTitle.e2cd0da2.js";import{Q as R,a as C}from"./PersonItem.61dacae3.js";import{e as B,c as I,d as $,Q as F,f as L}from"./QPage.c6dd2d1f.js";import{Q as T}from"./QForm.d7849e9d.js";import{_ as z}from"./PeopleList.61a07fde.js";import"./focusout.1458f406.js";import"./scroll.b410d601.js";import"./QResizeObserver.e6dad4d0.js";import"./QSlideItem.45adbf0d.js";import"./ReceiveString.4d157c48.js";import"./QCardActions.b80327ba.js";import"./QDialog.df3a28bf.js";import"./PeopleDropdown.3d1cca06.js";const X=Object.assign({name:"PeoplePage"},{__name:"NewSheetWizardPage",setup(U){const r=Q(),n=x(),u=I(),m=_.user2person(r.user),d=l({[m.id]:m}),c=l(!0),i=l(""),f=l(null),p=l(null),g=l(null),y=()=>{n.go(-1)},w=async()=>{try{await r.logout(),n.push({name:"LoginPage"})}catch(s){u.notify({message:s.message||s,color:"negative"});return}};P(r.userLedger,async s=>{s===null&&await w()},{immediate:!0});const b=async()=>{if(!!await p.value.validate())try{const e=g.value.getPeople(),a=await r.addSheetFromNameAndPeople(i.value,e);u.notify(`Sheet ${a.name} added successfully`),await r.subscribeCurrentSheet(a.id),n.replace({name:"SheetPage"})}catch(e){u.notify({message:e.message||e,color:"negative"})}};return(s,e)=>(k(),S(V,null,[t(R,{elevated:"",class:"bg-primary text-white"},{default:o(()=>[t(C,null,{default:o(()=>[t(v,{flat:"",icon:"arrow_back",onClick:y,"aria-label":"Go Back",class:"bg-white text-primary"}),t(N,{style:{"font-size":"28px"}},{default:o(()=>e[4]||(e[4]=[h(" New Sheet Wizard ")])),_:1}),t(v,{flat:"",class:"q-ml-md bg-white text-primary",icon:"done",label:"Proceed",onClick:b})]),_:1})]),_:1}),t(B,null,{default:o(()=>[t(T,{ref_key:"formRef",ref:p},{default:o(()=>[t($,null,{default:o(()=>[t(F,null,{default:o(()=>[t(L,{ref_key:"nameRef",ref:f,outlined:"",modelValue:i.value,"onUpdate:modelValue":e[0]||(e[0]=a=>i.value=a),onFocus:e[1]||(e[1]=a=>f.value.select()),rules:[a=>a&&a.length>0||"Name cannot be empty"],label:"Sheet Name"},null,8,["modelValue","rules"])]),_:1})]),_:1})]),_:1},512),t(z,{modelValue:d.value,"onUpdate:modelValue":e[2]||(e[2]=a=>d.value=a),seeInactive:c.value,"onUpdate:seeInactive":e[3]||(e[3]=a=>c.value=a),ref_key:"peopleListRef",ref:g},null,8,["modelValue","seeInactive"])]),_:1})],64))}});export{X as default};
