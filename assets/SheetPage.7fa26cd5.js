import{_ as G,r as L,a as b,w as D,u,$ as f,y as n,x as r,a0 as Q,a1 as H,Z as I,Y as d,a3 as a,v as m,a6 as p,X as i,a2 as o,a4 as O,aC as X,ap as U,a5 as Y,aD as _}from"./index.2ed0ead0.js";import{Q as Z,a as J,b as K,d as W,e as ee,f as $,g as v}from"./QList.8aa7f11a.js";import{e as ae,c as te,d as k,Q as z,f as se}from"./QPage.eae4bdd2.js";import{_ as le}from"./PeopleDropdown.38019902.js";import{U as y}from"./PersonItem.f4d2cba3.js";import"./QResizeObserver.90f8b995.js";import"./focusout.22009cfd.js";import"./scroll.7ef736a5.js";const re={class:"q-pa-md"},ne={key:0,style:{color:"green"}},oe={key:1,style:{color:"red"}},ue={class:"q-pa-md"},he=Object.assign({name:"SheetPage"},{__name:"SheetPage",setup(ce){var T,V,B;const e=G(),h=H(),w=te(),N=L((B=(V=e.userLedger)==null?void 0:V.sheets[(T=e.currentSheet)==null?void 0:T.id])==null?void 0:B.name),c=L(e.user.id),g=b(()=>e.currentSheetPeople.indexOf(c.value)),S=b(()=>{const{ans:s,totals:l}=X.getSummary(e.currentSheetResults,g.value);return{detail:s.map((x,j)=>({...x,id:j})),totals:l}}),q=b(()=>Object.entries(S.value.totals).filter(([s,l])=>l>0).map(([s,l])=>y.displayCurrency(s,l)).join(" + ")),C=b(()=>Object.entries(S.value.totals).filter(([s,l])=>l<0).map(([s,l])=>y.displayCurrency(s,-l)).join(" + ")),E=s=>{e.transactionId=s,h.push({name:"TransactionPage"})},M=()=>{e.transactionId=null,h.push({name:"TransactionPage"})},R=async()=>{try{await e.setSheetName(N.value)}catch(s){w.notify({message:s.message||s,color:"negative"})}},A=()=>{h.push({name:"PeoplePage"})},P=()=>{try{e.clearCurrentSheet(),h.go(-1)}catch(s){w.notify({message:s.message||s,color:"negative"});return}};D(e.currentSheet,async s=>{s===null&&P()},{immediate:!0});const F=async()=>{try{await e.logout(),h.push({name:"LoginPage"})}catch(s){w.notify({message:s.message||s,color:"negative"});return}};return D(e.userLedger,async s=>{s===null&&await F()},{immediate:!0}),(s,l)=>(u(),f(Q,null,[n(Z,{elevated:"",class:"bg-primary text-white"},{default:r(()=>[n(J,null,{default:r(()=>[n(I,{flat:"",icon:"arrow_back",onClick:P,"aria-label":"Go Back",class:"bg-white text-primary"}),n(K,{style:{"font-size":"28px"}},{default:r(()=>l[2]||(l[2]=[d(" Sheet ")])),_:1}),n(I,{flat:"",icon:"people",onClick:A,label:"People",class:"q-ml-md bg-white text-primary","aria-label":"Edit people"}),n(I,{class:"q-ml-md bg-white text-primary",icon:"note_add",label:"Add Entry",onClick:M})]),_:1})]),_:1}),n(ae,null,{default:r(()=>[n(k,null,{default:r(()=>[n(z,{class:"row q-gutter-sm"},{default:r(()=>[a(e).currentSheet?(u(),m(le,{key:0,class:"col-auto",modelValue:c.value,"onUpdate:modelValue":l[0]||(l[0]=t=>c.value=t),people:a(e).currentSheet.people,"is-fixed-label":!1},null,8,["modelValue","people"])):p("",!0),n(se,{class:"col",modelValue:N.value,"onUpdate:modelValue":l[1]||(l[1]=t=>N.value=t),onBlur:R,outlined:"",label:"Sheet Name"},null,8,["modelValue"])]),_:1})]),_:1}),C.value||q.value?(u(),m(k,{key:0,class:"q-my-md q-mr-md q-ml-md"},{default:r(()=>[i("div",re,[C.value?(u(),f("div",ne,o(a(e).getName(c.value))+" is owed "+o(C.value),1)):p("",!0),q.value?(u(),f("div",oe,o(a(e).getName(c.value))+" owes "+o(q.value),1)):p("",!0)])]),_:1})):p("",!0),S.value.detail.length>0?(u(),m(k,{key:1,class:"q-my-md q-mr-md q-ml-md"},{default:r(()=>[i("div",ue,[(u(!0),f(Q,null,O(S.value.detail,t=>(u(),f("div",{key:t.id},[i("div",null,[i("span",null,o(t.amount>0?a(e).getName(c.value):a(e).getName(a(e).personIdx2Id(t.person))),1),l[3]||(l[3]=i("span",null," owes ",-1)),i("span",null,o(t.amount<0?a(e).getName(c.value):a(e).getName(a(e).personIdx2Id(t.person)))+" \xA0 ",1),i("span",{style:U({color:t.amount>0?"red":"green"})},o(a(y).displayCurrency(t.currency,Math.abs(t.amount))),5)])]))),128))])]),_:1})):p("",!0),n(W,null,{default:r(()=>[(u(!0),f(Q,null,O(a(e).currentSheetTransactions,(t,x)=>(u(),m(ee,{key:t,clickable:"",class:Y(x%2===0?"bg-grey-3":"bg-white"),onClick:j=>E(t)},{default:r(()=>[n(k,{flat:"",bordered:"",class:"q-ml-sm q-mr-sm q-pl-sm q-pr-sm"},{default:r(()=>[n(z,{class:"column q-pa-none",style:{display:"flex","justify-content":"center","align-items":"center"}},{default:r(()=>[i("div",null,o(a(y).getMonth(a(e).currentSheet.transactions[t].timestamp)),1),i("div",null,o(a(y).getDay(a(e).currentSheet.transactions[t].timestamp)),1)]),_:2},1024)]),_:2},1024),n($,null,{default:r(()=>[n(v,null,{default:r(()=>[d(o(a(e).currentSheet.transactions[t].name||"New Transaction"),1)]),_:2},1024),n(v,{caption:""},{default:r(()=>[d(o(a(e).getName(a(e).payerId(t)))+" payed "+o(a(y).displayCurrency(a(e).currentSheet.transactions[t].currency,a(e).currentSheet.transactions[t].amount)),1)]),_:2},1024)]),_:2},1024),n($,{side:""},{default:r(()=>[a(_).position(a(e).currentSheet.transactions[t],g.value)>0?(u(),m(v,{key:0,caption:"",style:{color:"green"}},{default:r(()=>[d(o(a(e).getName(c.value))+" lent ",1)]),_:1})):p("",!0),a(_).position(a(e).currentSheet.transactions[t],g.value)<0?(u(),m(v,{key:1,caption:"",style:{color:"red"}},{default:r(()=>[d(o(a(e).getName(c.value))+" borrowed ",1)]),_:1})):p("",!0),a(_).position(a(e).currentSheet.transactions[t],g.value)===0?(u(),m(v,{key:2},{default:r(()=>l[4]||(l[4]=[d(" Not Involved ")])),_:1})):(u(),m(v,{key:3,style:U({color:a(_).position(a(e).currentSheet.transactions[t],g.value)>=0?"green":"red"})},{default:r(()=>[d(o(a(y).displayCurrency(a(e).currentSheet.transactions[t].currency,Math.abs(a(_).position(a(e).currentSheet.transactions[t],g.value)))),1)]),_:2},1032,["style"]))]),_:2},1024)]),_:2},1032,["class","onClick"]))),128))]),_:1})]),_:1})],64))}});export{he as default};
