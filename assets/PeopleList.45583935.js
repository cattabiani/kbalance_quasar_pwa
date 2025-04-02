import{O as j,T as w,r as d,aB as D,a as _,aA as f,w as T,u as m,P as C,y as n,x as u,S as h,W as z,v as k,X as A,Q as I,V as c,a9 as L,N as U,L as E}from"./index.c885f364.js";import{c as Y,b as W,_ as X,a as G}from"./PersonItem.81a6914e.js";import{Q as H}from"./QSlideItem.76d464ae.js";import{b as J}from"./QPage.f187342d.js";import{_ as K}from"./ReceiveString.824fc822.js";import{_ as Q}from"./PeopleDropdown.8758e1b7.js";const M={class:"q-mt-sm q-mb-sm q-gutter-sm flex justify-center"},te={__name:"PeopleList",props:{modelValue:{type:Object,required:!0},seeInactive:{type:Boolean,required:!0}},setup(x,{expose:q}){const a=j();w();const v=J(),g=x,s=d(D.cloneDeep(g.modelValue)),B=_(()=>Object.keys(s.value).filter(l=>g.seeInactive||s.value[l].active).sort((l,o)=>s.value[l].timestamp-s.value[o].timestamp));_(()=>Object.values(a.userLedger.friends).filter(e=>!(e.id in s.value)).sort((e,l)=>f.compare(e,l)).map(e=>e.id));const i=d(null),p=d(!1),r=d(null);q({getPeople:()=>s.value});const F=(e,l)=>{b(l,s.value[e].timestamp),delete s.value[e]},O=(e,l)=>{const o=f.make(null,s.value[l].name,"",s.value[l].timestamp);s.value[o.id]=o,delete s.value[l],y(e)},y=e=>{e.stopPropagation()},N=e=>{i.value=s.value[e].name,p.value=!0,r.value=e},R=()=>{i.value="",p.value=!0,r.value=null},b=(e,l=null)=>{s.value[e]=f.user2person(a.userLedger.friends[e]),l&&(s.value[e].timestamp=l)},P=e=>{setTimeout(()=>e==null?void 0:e(),0)},S=({reset:e},l)=>{if(l===a.user.id){a.currentSheet?v.notify({message:"You cannot remove yourself from the sheet! Remove the sheet instead.",color:"negative"}):v.notify({message:"You cannot remove yourself from the sheet!",color:"negative"}),P(e);return}a.isPersonFullyRemovable(l)?(delete s.value[l],v.notify({message:"Person removed."})):(s.value[l].active=!1,v.notify({message:"Person marked as inactive."}),g.seeInactive&&P(e))},V=({reset:e},l)=>{s.value[l].active=!0,P(e)};return T(i,e=>{if(e)if(r.value===null){const l=f.make(null,e);s.value[l.id]=l}else r.value===a.user.id?(a.setUsername(e),s.value[r.value].name=e):(a.isUserOrFriend(r.value)&&a.setFriendName(e,r.value),s.value[r.value].name=e)},{immediate:!0}),(e,l)=>(m(),C(h,null,[n(G,{bordered:"",class:"q-my-md"},{default:u(()=>[(m(!0),C(h,null,z(B.value,(o,$)=>(m(),k(H,{key:o,onLeft:t=>S(t,o),onClick:t=>N(o),onRight:t=>V(t,o),"left-color":"red","right-color":"green",class:A($%2===0?"bg-grey-3":"bg-white")},{left:u(()=>[n(I,{name:"delete"})]),right:u(()=>[n(I,{name:"done"})]),default:u(()=>[n(Y,{clickable:""},{default:u(()=>[n(W,null,{default:u(()=>[n(X,{id:o,people:s.value},null,8,["id","people"])]),_:2},1024),c(a).isUserOrFriend(o)?L("",!0):(m(),k(Q,{key:0,people:c(a).userLedger.friends,"ignored-people":s.value,onItemClick:t=>F(o,t),"is-upgrade":"",onClick:l[0]||(l[0]=t=>y(t)),"fixed-label":"Upgrade"},null,8,["people","ignored-people","onItemClick"])),c(a).isUserOrFriend(o)&&c(a).isPersonFullyRemovable(o)?(m(),k(U,{key:1,color:"grey",icon:"arrow_circle_down",label:"Downgrade",onClick:t=>O(t,o)},null,8,["onClick"])):L("",!0)]),_:2},1024)]),_:2},1032,["onLeft","onClick","onRight","class"]))),128))]),_:1}),E("div",M,[n(Q,{people:c(a).userLedger.friends,"ignored-people":s.value,onItemClick:b,"fixed-label":"User"},null,8,["people","ignored-people"]),n(U,{color:"grey",icon:"person",label:"Add Person",onClick:R})]),n(K,{hideScan:!0,modelValue:i.value,"onUpdate:modelValue":l[1]||(l[1]=o=>i.value=o),isVisible:p.value,"onUpdate:isVisible":l[2]||(l[2]=o=>p.value=o)},null,8,["modelValue","isVisible"])],64))}};export{te as _};
