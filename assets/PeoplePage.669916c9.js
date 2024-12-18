import{r as c,F as z,w as _,a as D,u as d,C as I,y as l,x as o,I as V,J as F,z as $,K as p,E as M,L as G,G as i,ad as H,v as Q,M as j,Q as f,D as T,H as B,N as J,aB as K,av as W}from"./index.3798f6c3.js";import{Q as X,a as Y,b as Z,c as ee,d as ae,e as le}from"./QList.24a29ca0.js";import{Q as te}from"./QSlideItem.8a7dba08.js";import{Q as se,u as oe,c as ne,a as re,b as ie}from"./use-quasar.81b07841.js";import{Q as ue}from"./QCardActions.34ca3f01.js";import{Q as ce}from"./QDialog.ea8973a0.js";import{_ as me}from"./SelectPerson.f8d7108d.js";import"./QResizeObserver.12d6e541.js";import"./scroll.9a1fd839.js";import"./QSelect.e50261be.js";const de={class:"q-gutter-sm",style:{display:"flex","align-items":"center"}},pe={style:{display:"flex","align-items":"center"}},Ce=Object.assign({name:"PeoplePage"},{__name:"PeoplePage",setup(fe){const b=oe(),A=c(null),P=c(null),u=c(!0),n=c(null),v=c(!1),m=c(null);let g=null,k=!1;const s=z(),h=F();_(m,e=>{e!==null&&(n.value.name=null,n.value.id=s.users[e])}),_(()=>s.currentSheet,e=>{e||h.push({name:"IndexPage"})},{immediate:!0});const N=()=>{m.value=null,n.value.id=g},S=D(()=>(s.users||[]).map((t,a)=>({label:s.username(t)||"New Person",isUser:!0,value:a})));_(n,e=>{v.value=!!e,v.value&&(m.value=null)});const U=()=>{h.go(-1)},L=()=>{n.value=s.getEditablePerson(),g=n.value.id,k=!0,w()},w=()=>{$(()=>{var e,t;(e=P.value)==null||e.focus(),(t=P.value)==null||t.select()})},O=e=>{g=e,k=!1,n.value=s.getEditablePerson(e),w()},C=e=>{A.value=setTimeout(()=>{e==null||e()},0)},R=async({reset:e},t)=>{C(e),await new Promise(a=>{setTimeout(async()=>{try{await s.removePerson(t),a()}catch(r){b.notify({message:r.message||r}),a()}},0)})},q=async({reset:e},t)=>{C(e),await new Promise(a=>{setTimeout(async()=>{try{await s.activatePerson(t),a()}catch(r){b.notify({message:r.message||r}),a()}},0)})},E=async()=>{try{await s.addPerson(n.value,k?null:g)}catch(e){b.notify({message:e.message||e});return}x()},x=()=>{n.value=null};return(e,t)=>(d(),I(V,null,[l(X,{elevated:"",class:"bg-primary text-white"},{default:o(()=>[l(Y,null,{default:o(()=>[l(p,{flat:"",icon:"arrow_back",onClick:U,"aria-label":"Go Back",class:"bg-white text-primary"}),l(Z,{style:{"font-size":"28px"}},{default:o(()=>t[4]||(t[4]=[M(" People ")])),_:1}),l(p,{flat:"",icon:u.value?"visibility_off":"visibility",onClick:t[0]||(t[0]=a=>u.value=!u.value),class:"q-ml-md bg-white text-primary","aria-label":"Toggle active state"},null,8,["icon"]),l(p,{flat:"",icon:"add",onClick:L,class:"q-ml-md bg-white text-primary","aria-label":"Add a new person"})]),_:1})]),_:1}),l(se,null,{default:o(()=>[l(ee,{bordered:"",class:"q-my-md"},{default:o(()=>[(d(!0),I(V,null,G(i(s).currentSheetPeople,(a,r)=>H((d(),Q(te,{key:r,onLeft:y=>R(y,a),onRight:y=>q(y,a),onClick:y=>O(a),"left-color":"red","right-color":"green",class:j(r%2===0?"bg-grey-1":"bg-white")},{left:o(()=>[l(f,{name:"delete"})]),right:o(()=>[l(f,{name:"done"})]),default:o(()=>[l(ae,null,{default:o(()=>[l(le,null,{default:o(()=>[T("div",de,[!u.value&&!i(s).isPersonActive(a)?(d(),Q(f,{key:0,name:"radio_button_unchecked",color:"black","aria-label":"Inactive"})):B("",!0),!u.value&&i(s).isPersonActive(a)?(d(),Q(f,{key:1,name:"check_circle",color:"primary","aria-label":"Active"})):B("",!0),l(f,{name:"person",color:i(s).isUser(a)?"primary":"grey","aria-label":i(s).isUser(a)?"Real user":"Fake user"},null,8,["color","aria-label"]),T("div",pe,J(i(s).username(a)||"New Person"),1)])]),_:2},1024)]),_:2},1024)]),_:2},1032,["onLeft","onRight","onClick","class"])),[[K,i(s).isPersonActive(a)||!u.value],[W]])),128))]),_:1})]),_:1}),l(ce,{modelValue:v.value,"onUpdate:modelValue":t[3]||(t[3]=a=>v.value=a),persistent:"",onOpen:w},{default:o(()=>[l(ne,null,{default:o(()=>[l(re,null,{default:o(()=>[l(me,{modelValue:m.value,"onUpdate:modelValue":t[1]||(t[1]=a=>m.value=a),peopleOptions:S.value},null,8,["modelValue","peopleOptions"]),l(ie,{ref_key:"personInput",ref:P,modelValue:n.value.name,"onUpdate:modelValue":t[2]||(t[2]=a=>n.value.name=a),label:"Person",autogrow:"",outlined:"",onBlur:N},null,8,["modelValue"])]),_:1}),l(ue,{align:"center"},{default:o(()=>[l(p,{icon:"close",color:"red",onClick:x}),l(p,{icon:"check",color:"primary",onClick:E})]),_:1})]),_:1})]),_:1},8,["modelValue"])],64))}});export{Ce as default};
