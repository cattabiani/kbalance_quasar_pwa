import{Q as c}from"./QSpace.53215b27.js";import{r as d,o as f,f as g,u as b,v,x as r,a1 as w,y as t,X as i,Y as x,Z as p}from"./index.b327dff4.js";import{Q as _,a as B}from"./QHeader.f3de409e.js";import{u as Q}from"./use-quasar.e67a33c2.js";import"./QResizeObserver.994fd92b.js";const S=Object.assign({name:"LandingPage"},{__name:"LandingPage",setup(y){const l=Q(),m=w(),e=d(null),n=o=>{o.preventDefault(),e.value=o};f(()=>{window.addEventListener("beforeinstallprompt",n)}),g(()=>{window.removeEventListener("beforeinstallprompt",n)});const u=()=>{e.value?(e.value.prompt(),e.value=null,s(),l.notify({message:"Installation complete!"})):l.notify({message:"No install prompt available!",color:"negative"})},s=()=>{m.replace({name:"SettingsPage"})};return(o,a)=>(b(),v(_,{elevated:"",class:"bg-primary text-white"},{default:r(()=>[t(B,null,{default:r(()=>[a[0]||(a[0]=i("div",null,[i("strong",null,"KBalance")],-1)),a[1]||(a[1]=x()),t(c),t(p,{flat:"",icon:"exit_to_app",label:"Continue to Settings",onClick:s,"aria-label":"Go Back",class:"bg-white text-primary"}),t(p,{flat:"",icon:"file_download",label:"Install",onClick:u,"aria-label":"Install",class:"q-ml-md bg-secondary text-white"})]),_:1})]),_:1}))}});export{S as default};
