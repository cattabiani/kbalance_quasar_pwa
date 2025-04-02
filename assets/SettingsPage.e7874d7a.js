import{O as x,r as p,w as S,u as l,P as V,y as a,x as o,S as w,T as B,N as c,M as m,V as i,v as b,L as v,a9 as y,aO as u}from"./index.c885f364.js";import{Q as q}from"./QSpace.3f597b71.js";import{Q as N,a as P}from"./QHeader.499513d4.js";import{a as E,Q as C}from"./QCard.69fbfe9b.js";import{Q as F}from"./QCardActions.9546e846.js";import{Q as O,b as R}from"./QPage.f187342d.js";import{_ as T}from"./ShareString.4d380718.js";import{_ as $}from"./ReceiveString.824fc822.js";import"./QResizeObserver.b45c7afc.js";import"./QDialog.4b1b2e6e.js";import"./focusout.4024e620.js";import"./scroll.0bcc1ebe.js";import"./browser.445c5f4b.js";const X=Object.assign({name:"SettingsPage"},{__name:"SettingsPage",setup(A){const n=R(),t=x(),k=B(),d=p(""),f=p(""),g=p(!1),_=()=>{u.isCompatible(t.config)?d.value=JSON.stringify(t.config):n.notify({message:"The current config is corrupted or empty!",color:"negative"})};S(f,s=>{if(s)try{t.setConfig(JSON.parse(s)),n.notify({message:"Config set successfully!"})}catch(e){n.notify({message:e.message||e,color:"negative"})}},{immediate:!0});const Q=async()=>{try{await t.init(),k.push({name:"IndexPage"})}catch(s){n.notify({message:s.message||s,color:"negative"})}},h=()=>{k.replace({name:"LandingPage"})};return(s,e)=>(l(),V(w,null,[a(N,{elevated:"",class:"bg-primary text-white"},{default:o(()=>[a(P,null,{default:o(()=>[a(c,{flat:"",icon:"arrow_back",onClick:h,"aria-label":"Go Back",class:"bg-white text-primary"}),a(q)]),_:1})]),_:1}),a(O,{class:"flex flex-center"},{default:o(()=>[a(E,{class:"q-pa-md q-mb-md",style:{width:"80%"}},{default:o(()=>[a(C,{class:"text-center",style:{"font-size":"28px"}},{default:o(()=>e[4]||(e[4]=[m(" Settings ")])),_:1}),i(u).isCompatible(i(t).config)?y("",!0):(l(),b(C,{key:0},{default:o(()=>e[5]||(e[5]=[m(" Welcome to kBalance! First, you need to set up your Firebase account. You can either "),v("strong",null,"import",-1),m(" a friend's settings (and rely on their Firebase account) or create your own. For more info on this second method, check the "),v("a",{href:"https://github.com/cattabiani/kbalance_quasar_pwa/blob/main/README.md",target:"_blank",class:"text-primary"},"kBalance README",-1),m(". ")])),_:1})),a(F,null,{default:o(()=>[i(u).isCompatible(i(t).config)?(l(),b(c,{key:0,icon:"qr_code",color:"secondary",label:"Share",class:"full-width q-mb-md",onClick:_})):y("",!0),a(c,{icon:"qr_code_scanner",label:"Import",color:"secondary",class:"full-width q-mb-md",onClick:e[0]||(e[0]=r=>g.value=!0)}),i(u).isCompatible(i(t).config)?(l(),b(c,{key:1,icon:"send",label:"Go to Log In",color:"primary",class:"full-width",onClick:Q})):y("",!0)]),_:1})]),_:1})]),_:1}),a(T,{modelValue:d.value,"onUpdate:modelValue":e[1]||(e[1]=r=>d.value=r)},null,8,["modelValue"]),a($,{modelValue:f.value,"onUpdate:modelValue":e[2]||(e[2]=r=>f.value=r),isVisible:g.value,"onUpdate:isVisible":e[3]||(e[3]=r=>g.value=r)},null,8,["modelValue","isVisible"])],64))}});export{X as default};
