import{_ as Q,aB as _,r as s,w as P,u as k,$ as S,y as t,x as o,a0 as V,a1 as x,Z as v,Y as h}from"./index.d112f7b7.js";import{Q as N}from"./QToolbarTitle.08560b3a.js";import{Q as R,a as B}from"./PersonItem.7495f7cf.js";import{d as C,c as I,Q as $,e as F}from"./QPage.1e81f41b.js";import{Q as L}from"./QForm.61c3bb2e.js";import{u as T}from"./use-quasar.f2977d2c.js";import{_ as z}from"./PeopleList.adcef8f8.js";import"./focusout.ac2deb84.js";import"./scroll.724e710d.js";import"./QResizeObserver.123cbb61.js";import"./QSlideItem.03b77b83.js";import"./ReceiveString.9bcf0b32.js";import"./QCardActions.a9f37625.js";import"./QDialog.d96e7325.js";import"./PeopleDropdown.fb5a9581.js";const ee=Object.assign({name:"PeoplePage"},{__name:"NewSheetWizardPage",setup(U){const l=Q(),n=x(),u=T(),m=_.user2person(l.user),d=s({[m.id]:m}),c=s(!0),i=s(""),p=s(null),f=s(null),g=s(null),y=()=>{n.go(-1)},w=async()=>{try{await l.logout(),n.push({name:"LoginPage"})}catch(r){u.notify({message:r.message||r,color:"negative"});return}};P(l.userLedger,async r=>{r===null&&await w()},{immediate:!0});const b=async()=>{if(!!await f.value.validate())try{const e=g.value.getPeople(),a=await l.addSheetFromNameAndPeople(i.value,e);u.notify(`Sheet ${a.name} added successfully`),await l.subscribeCurrentSheet(a.id),n.replace({name:"SheetPage"})}catch(e){u.notify({message:e.message||e,color:"negative"})}};return(r,e)=>(k(),S(V,null,[t(R,{elevated:"",class:"bg-primary text-white"},{default:o(()=>[t(B,null,{default:o(()=>[t(v,{flat:"",icon:"arrow_back",onClick:y,"aria-label":"Go Back",class:"bg-white text-primary"}),t(N,{style:{"font-size":"28px"}},{default:o(()=>e[4]||(e[4]=[h(" New Sheet Wizard ")])),_:1}),t(v,{flat:"",class:"q-ml-md bg-white text-primary",icon:"done",label:"Proceed",onClick:b})]),_:1})]),_:1}),t(C,null,{default:o(()=>[t(L,{ref_key:"formRef",ref:f},{default:o(()=>[t(I,null,{default:o(()=>[t($,null,{default:o(()=>[t(F,{ref_key:"nameRef",ref:p,outlined:"",modelValue:i.value,"onUpdate:modelValue":e[0]||(e[0]=a=>i.value=a),onFocus:e[1]||(e[1]=a=>p.value.select()),rules:[a=>a&&a.length>0||"Name cannot be empty"],label:"Sheet Name"},null,8,["modelValue","rules"])]),_:1})]),_:1})]),_:1},512),t(z,{modelValue:d.value,"onUpdate:modelValue":e[2]||(e[2]=a=>d.value=a),seeInactive:c.value,"onUpdate:seeInactive":e[3]||(e[3]=a=>c.value=a),ref_key:"peopleListRef",ref:g},null,8,["modelValue","seeInactive"])]),_:1})],64))}});export{ee as default};
