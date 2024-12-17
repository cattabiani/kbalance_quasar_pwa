import{r as c,F as D,w as C,a as F,u as d,C as x,y as l,x as o,I as V,J as $,B as z,K as p,E as M,L as G,G as i,am as H,v as _,M as j,Q as f,D as I,H as B,N as J,aB as K,av as W}from"./index.d1411320.js";import{Q as X,a as Y,b as Z,c as ee,d as ae,e as le,f as te}from"./QDialog.f2eb98e3.js";import{Q as se}from"./QSlideItem.597b93f5.js";import{Q as oe,u as ne,c as re,a as ie,b as ue}from"./use-quasar.3aea57e6.js";import{Q as ce}from"./QCardActions.a9b3bbce.js";import{_ as me}from"./SelectPerson.bda721b8.js";import"./QResizeObserver.154f5ab0.js";import"./QSelect.e5ba54e0.js";const de={class:"q-gutter-sm",style:{display:"flex","align-items":"center"}},pe={style:{display:"flex","align-items":"center"}},Qe=Object.assign({name:"PeoplePage"},{__name:"PeoplePage",setup(fe){const b=ne(),T=c(null),P=c(null),u=c(!0),n=c(null),v=c(!1),m=c(null);let g=null,k=!1;const s=D(),A=$();C(m,a=>{a!==null&&(n.value.name=null,n.value.id=s.users[a])});const N=()=>{m.value=null,n.value.id=g},S=F(()=>(s.users||[]).map((t,e)=>({label:s.username(t)||"New Person",isUser:!0,value:e})));C(n,a=>{v.value=!!a,v.value&&(m.value=null)});const U=()=>{A.go(-1)},L=()=>{n.value=s.getEditablePerson(),g=n.value.id,k=!0,w()},w=()=>{z(()=>{var a,t;(a=P.value)==null||a.focus(),(t=P.value)==null||t.select()})},O=a=>{g=a,k=!1,n.value=s.getEditablePerson(a),w()},Q=a=>{T.value=setTimeout(()=>{a==null||a()},0)},R=async({reset:a},t)=>{Q(a),await new Promise(e=>{setTimeout(async()=>{try{await s.removePerson(t),e()}catch(r){b.notify({message:r.message||r}),e()}},0)})},q=async({reset:a},t)=>{Q(a),await new Promise(e=>{setTimeout(async()=>{try{await s.activatePerson(t),e()}catch(r){b.notify({message:r.message||r}),e()}},0)})},E=async()=>{try{await s.addPerson(n.value,k?null:g)}catch(a){b.notify({message:a.message||a});return}h()},h=()=>{n.value=null};return(a,t)=>(d(),x(V,null,[l(X,{elevated:"",class:"bg-primary text-white"},{default:o(()=>[l(Z,null,{default:o(()=>[l(p,{flat:"",icon:"arrow_back",onClick:U,"aria-label":"Go Back",class:"bg-white text-primary"}),l(ee,{style:{"font-size":"28px"}},{default:o(()=>t[4]||(t[4]=[M(" People ")])),_:1}),l(p,{flat:"",icon:u.value?"visibility_off":"visibility",onClick:t[0]||(t[0]=e=>u.value=!u.value),class:"q-ml-md bg-white text-primary","aria-label":"Toggle active state"},null,8,["icon"]),l(p,{flat:"",icon:"add",onClick:L,class:"q-ml-md bg-white text-primary","aria-label":"Add a new person"})]),_:1})]),_:1}),l(oe,null,{default:o(()=>[l(ae,{bordered:"",class:"q-my-md"},{default:o(()=>[(d(!0),x(V,null,G(i(s).currentSheetPeople,(e,r)=>H((d(),_(se,{key:r,onLeft:y=>R(y,e),onRight:y=>q(y,e),onClick:y=>O(e),"left-color":"red","right-color":"green",class:j(r%2===0?"bg-grey-1":"bg-white")},{left:o(()=>[l(f,{name:"delete"})]),right:o(()=>[l(f,{name:"done"})]),default:o(()=>[l(le,null,{default:o(()=>[l(te,null,{default:o(()=>[I("div",de,[!u.value&&!i(s).isPersonActive(e)?(d(),_(f,{key:0,name:"radio_button_unchecked",color:"black","aria-label":"Inactive"})):B("",!0),!u.value&&i(s).isPersonActive(e)?(d(),_(f,{key:1,name:"check_circle",color:"primary","aria-label":"Active"})):B("",!0),l(f,{name:"person",color:i(s).isUser(e)?"primary":"grey","aria-label":i(s).isUser(e)?"Real user":"Fake user"},null,8,["color","aria-label"]),I("div",pe,J(i(s).username(e)||"New Person"),1)])]),_:2},1024)]),_:2},1024)]),_:2},1032,["onLeft","onRight","onClick","class"])),[[K,i(s).isPersonActive(e)||!u.value],[W]])),128))]),_:1})]),_:1}),l(Y,{modelValue:v.value,"onUpdate:modelValue":t[3]||(t[3]=e=>v.value=e),persistent:"",onOpen:w},{default:o(()=>[l(re,null,{default:o(()=>[l(ie,null,{default:o(()=>[l(me,{modelValue:m.value,"onUpdate:modelValue":t[1]||(t[1]=e=>m.value=e),peopleOptions:S.value},null,8,["modelValue","peopleOptions"]),l(ue,{ref_key:"personInput",ref:P,modelValue:n.value.name,"onUpdate:modelValue":t[2]||(t[2]=e=>n.value.name=e),label:"Person",autogrow:"",outlined:"",onBlur:N},null,8,["modelValue"])]),_:1}),l(ce,{align:"center"},{default:o(()=>[l(p,{icon:"close",color:"red",onClick:h}),l(p,{icon:"check",color:"primary",onClick:E})]),_:1})]),_:1})]),_:1},8,["modelValue"])],64))}});export{Qe as default};