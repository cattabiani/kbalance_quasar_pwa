import{_ as u,d as k,f as g,e as y,b as x}from"./PersonItem.65d3f4d9.js";import{r as h,a as v,aA as C,u as t,v as n,x as o,$ as m,a4 as L,y as i,a0 as V,a5 as w,a6 as B,a3 as P}from"./index.e9904863.js";const Q={key:0},O={__name:"PeopleDropdown",props:{people:{type:Object,required:!0},ignoredPeople:{type:Object,default:null},fixedLabel:{type:String,default:null},modelValue:{type:String,default:null}},emits:["itemClick","update:modelValue"],setup(s,{emit:f}){const d=h(null),e=s,c=f,_=l=>{c("update:modelValue",l),c("itemClick",l),d.value.hide()},p=v(()=>Object.values(e.people).filter(l=>{var a;return!(l.id in((a=e==null?void 0:e.ignoredPeople)!=null?a:{}))}).sort((l,a)=>C.compare(l,a)).map(l=>l.id));return(l,a)=>p.value.length?(t(),n(x,{key:0,color:e.fixedLabel?"primary":void 0,icon:Boolean(e.fixedLabel)?e.fixedLabel==="Upgrade"?"arrow_circle_up":"person":void 0,ref_key:"addUserRef",ref:d},{label:o(()=>[s.fixedLabel?(t(),m("span",Q,L(e.fixedLabel),1)):(t(),n(u,{key:1,id:e.modelValue,people:e.people,"max-length":13},null,8,["id","people"]))]),default:o(()=>[i(k,null,{default:o(()=>[(t(!0),m(V,null,w(p.value,(r,b)=>(t(),n(g,{key:r,onClick:S=>_(r),clickable:"",class:B(b%2===0?"bg-grey-3":"bg-white")},{default:o(()=>[i(y,null,{default:o(()=>[i(u,{id:r,people:e.people,"max-length":13},null,8,["id","people"])]),_:2},1024)]),_:2},1032,["onClick","class"]))),128))]),_:1})]),_:1},8,["color","icon"])):P("",!0)}};export{O as _};
