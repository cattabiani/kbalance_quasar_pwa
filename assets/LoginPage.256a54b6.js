import{e as C,c as h,Q as b,f,d as _}from"./QPage.dcbf423d.js";import{_ as R,r as d,u as m,v as c,x as o,a1 as S,y as a,Y as P,a4 as L,aN as B,Q as N,a3 as p,Z as g}from"./index.1f84b456.js";import{Q as U}from"./QBanner.2a5c3454.js";import{Q}from"./QCardActions.51c84c85.js";import{Q as F}from"./QForm.3a902499.js";const z=Object.assign({name:"LoginPage"},{__name:"LoginPage",setup(I){const r=R(),u=h(),v=S(),l=d(!1),n=d(""),i=d(""),w=d(""),V=[e=>!!e||"Please enter an email",e=>/.+@.+\..+/.test(e)||"Please enter a valid email"],k=[e=>!!e||"Please enter a password",e=>e.length>=6||"Password should be at least 6 characters"],x=async()=>{try{l.value?await r.register(n.value,i.value):await r.login(n.value,i.value),await r.init(),v.push({name:"IndexPage"})}catch(e){u.notify({message:e.message||e,color:"negative"}),e.code!=="auth/invalid-credential"&&await y()}},q=async()=>{try{await r.resetPassword(n.value),u.notify({message:"Email sent!"})}catch(e){u.notify({message:e.message||e,color:"negative"})}},y=async()=>{try{await r.clearFirebase(),v.push({name:"SettingsPage"})}catch(e){u.notify({message:e.message||e,color:"negative"})}};return(e,s)=>(m(),c(C,{class:"flex flex-center"},{default:o(()=>[a(_,{class:"q-pa-md",style:{width:"80%"}},{default:o(()=>[a(b,{class:"text-center",style:{"font-size":"28px"}},{default:o(()=>[P(L(l.value?"Register":"Login"),1)]),_:1}),a(F,{onSubmit:B(x,["prevent"])},{default:o(()=>[a(b,null,{default:o(()=>[l.value?(m(),c(U,{key:0,dense:"",class:"bg-orange-2 text-orange-10 q-mb-md"},{default:o(()=>[a(N,{name:"warning",class:"q-mr-sm"}),s[4]||(s[4]=P(" Using a fake email is at your own risk\u2014password recovery won't be possible. "))]),_:1})):p("",!0),a(f,{modelValue:n.value,"onUpdate:modelValue":s[0]||(s[0]=t=>n.value=t),label:"Email",type:"email",rules:V,required:"",outlined:""},null,8,["modelValue"]),a(f,{modelValue:i.value,"onUpdate:modelValue":s[1]||(s[1]=t=>i.value=t),label:"Password",type:"password",rules:k,required:"",outlined:""},null,8,["modelValue"]),l.value?(m(),c(f,{key:1,modelValue:w.value,"onUpdate:modelValue":s[2]||(s[2]=t=>w.value=t),label:"Confirm Password",rules:[t=>t===i.value||"Passwords do not match"],type:"password",requireds:"",outlined:""},null,8,["modelValue","rules"])):p("",!0)]),_:1}),a(Q,null,{default:o(()=>[a(g,{icon:"send",label:l.value?"Register":"Login",color:"primary",type:"submit",class:"full-width"},null,8,["label"])]),_:1})]),_:1}),a(Q,{class:"justify-center"},{default:o(()=>[l.value?p("",!0):(m(),c(g,{key:0,label:"Forgot your password?",color:"primary",onClick:q,class:"full-width q-mt-md",icon:"key"})),a(g,{label:l.value?"Go to Login":"Go to Register",color:"secondary",onClick:s[3]||(s[3]=t=>l.value=!l.value),class:"full-width q-mt-md",icon:"account_circle"},null,8,["label"]),a(g,{label:"Settings",color:"secondary",onClick:y,class:"full-width q-mt-md",icon:"settings"})]),_:1})]),_:1})]),_:1}))}});export{z as default};
