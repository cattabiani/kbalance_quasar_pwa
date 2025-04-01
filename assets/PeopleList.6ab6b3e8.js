import{O as j,T as w,r as d,aB as D,a as _,aA as f,w as T,u as m,P as C,y as n,x as u,S as U,X as Y,v as k,Y as z,Q as h,U as c,V as I,N as L,L as A}from"./index.c45f6171.js";import{c as E,b as X,_ as G,a as H}from"./PersonItem.afba27ec.js";import{Q as J}from"./QSlideItem.b4212206.js";import{b as K}from"./QPage.611bcdab.js";import{_ as M}from"./ReceiveString.a4dd98a7.js";import{_ as Q}from"./PeopleDropdown.baf39dad.js";const W={class:"q-mt-sm q-mb-sm q-gutter-sm flex justify-center"},te={__name:"PeopleList",props:{modelValue:{type:Object,required:!0},seeInactive:{type:Boolean,required:!0}},setup(x,{expose:q}){const a=j();w();const v=K(),g=x,s=d(D.cloneDeep(g.modelValue)),B=_(()=>Object.keys(s.value).filter(l=>g.seeInactive||s.value[l].active).sort((l,o)=>s.value[l].timestamp-s.value[o].timestamp));_(()=>Object.values(a.userLedger.friends).filter(e=>!(e.id in s.value)).sort((e,l)=>f.compare(e,l)).map(e=>e.id));const i=d(null),p=d(!1),r=d(null);q({getPeople:()=>s.value});const F=(e,l)=>{b(l,s.value[e].timestamp),delete s.value[e]},O=(e,l)=>{const o=f.make(null,s.value[l].name,"",s.value[l].timestamp);s.value[o.id]=o,delete s.value[l],y(e)},y=e=>{e.stopPropagation()},N=e=>{i.value=s.value[e].name,p.value=!0,r.value=e},R=()=>{i.value="",p.value=!0,r.value=null},b=(e,l=null)=>{s.value[e]=f.user2person(a.userLedger.friends[e]),l&&(s.value[e].timestamp=l)},P=e=>{setTimeout(()=>e==null?void 0:e(),0)},S=({reset:e},l)=>{if(l===a.user.id){a.currentSheet?v.notify({message:"You cannot remove yourself from the sheet! Remove the sheet instead.",color:"negative"}):v.notify({message:"You cannot remove yourself from the sheet!",color:"negative"}),P(e);return}a.isPersonFullyRemovable(l)?(delete s.value[l],v.notify({message:"Person removed."})):(s.value[l].active=!1,v.notify({message:"Person marked as inactive."}),g.seeInactive&&P(e))},V=({reset:e},l)=>{s.value[l].active=!0,P(e)};return T(i,e=>{if(e)if(r.value===null){const l=f.make(null,e);s.value[l.id]=l}else r.value===a.user.id?(a.setUsername(e),s.value[r.value].name=e):(a.isUserOrFriend(r.value)&&a.setFriendName(e,r.value),s.value[r.value].name=e)},{immediate:!0}),(e,l)=>(m(),C(U,null,[n(H,{bordered:"",class:"q-my-md"},{default:u(()=>[(m(!0),C(U,null,Y(B.value,(o,$)=>(m(),k(J,{key:o,onLeft:t=>S(t,o),onClick:t=>N(o),onRight:t=>V(t,o),"left-color":"red","right-color":"green",class:z($%2===0?"bg-grey-3":"bg-white")},{left:u(()=>[n(h,{name:"delete"})]),right:u(()=>[n(h,{name:"done"})]),default:u(()=>[n(E,{clickable:""},{default:u(()=>[n(X,null,{default:u(()=>[n(G,{id:o,people:s.value},null,8,["id","people"])]),_:2},1024),c(a).isUserOrFriend(o)?I("",!0):(m(),k(Q,{key:0,people:c(a).userLedger.friends,"ignored-people":s.value,onItemClick:t=>F(o,t),"is-upgrade":"",onClick:l[0]||(l[0]=t=>y(t)),"fixed-label":"Upgrade"},null,8,["people","ignored-people","onItemClick"])),c(a).isUserOrFriend(o)&&c(a).isPersonFullyRemovable(o)?(m(),k(L,{key:1,color:"grey",icon:"arrow_circle_down",label:"Downgrade",onClick:t=>O(t,o)},null,8,["onClick"])):I("",!0)]),_:2},1024)]),_:2},1032,["onLeft","onClick","onRight","class"]))),128))]),_:1}),A("div",W,[n(Q,{people:c(a).userLedger.friends,"ignored-people":s.value,onItemClick:b,"fixed-label":"User"},null,8,["people","ignored-people"]),n(L,{color:"grey",icon:"person",label:"Add Person",onClick:R})]),n(M,{hideScan:!0,modelValue:i.value,"onUpdate:modelValue":l[1]||(l[1]=o=>i.value=o),isVisible:p.value,"onUpdate:isVisible":l[2]||(l[2]=o=>p.value=o)},null,8,["modelValue","isVisible"])],64))}};export{te as _};
