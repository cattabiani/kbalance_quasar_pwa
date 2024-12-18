import{F as M,r as b,a as P,w as U,u as c,C as v,y as l,x as s,I as Q,J as R,K as N,E as i,v as S,D as m,N as o,G as t,H as k,L as j,ap as G,U as d,aq as H,Q as J,M as K}from"./index.3798f6c3.js";import{Q as W,a as X,b as Y,c as Z,d as ee,e as w}from"./QList.24a29ca0.js";import{Q as te,u as ae,b as re,c as T,a as ne}from"./use-quasar.81b07841.js";import{Q as f}from"./QSelect.e50261be.js";import{Q as se}from"./QSlideItem.8a7dba08.js";import{_ as le}from"./SelectPerson.f8d7108d.js";import"./QResizeObserver.12d6e541.js";import"./QDialog.ea8973a0.js";import"./scroll.9a1fd839.js";const oe={class:"q-pa-md"},ue={key:0,style:{color:"green"}},ce={key:1,style:{color:"red"}},me={class:"q-pa-md"},be=Object.assign({name:"SheetPage"},{__name:"SheetPage",setup(ie){const x=ae(),e=M(),h=R(),I=b(null),V=b(null),g=b(null),u=b(e.currentSheetPeople.indexOf(e.getCurrentUserId())),D=P(()=>(e.currentSheetPeople||[]).map((r,a)=>({label:e.username(r)||"New Person",isUser:e.isUser(r),value:a})));U(()=>e.currentSheet,n=>{n||h.push({name:"IndexPage"})},{immediate:!0}),U(()=>e.currentSheetLedger,n=>{g.value=n==null?void 0:n.name},{immediate:!0});const $=async()=>{try{await e.setCurrentSheetName(g.value)}catch(n){x.notify({message:n.message||n});return}},_=P(()=>{const{ans:n,totals:r}=G.getSummary(e.currentSheetResults,u.value);return{detail:n.map((p,y)=>({...p,id:y})),totals:r}}),C=P(()=>Object.entries(_.value.totals).filter(([n,r])=>r>0).map(([n,r])=>d.displayCurrency(n,r)).join(" + ")),q=P(()=>Object.entries(_.value.totals).filter(([n,r])=>r<0).map(([n,r])=>d.displayCurrency(n,-r)).join(" + ")),B=(n=null)=>{e.transactionId=n,h.push({name:"TransactionPage"})},z=async()=>{await e.clearCurrentSheet(),h.go(-1)},A=()=>{h.push({name:"PeoplePage"})},E=n=>{V.value=setTimeout(()=>{n==null||n()},0)},F=async({reset:n},r)=>{E(n),await new Promise(a=>{setTimeout(async()=>{try{await e.removeTransaction(r),a()}catch(p){x.notify({message:p.message||p}),a()}},0)})};return(n,r)=>(c(),v(Q,null,[l(W,{elevated:"",class:"bg-primary text-white"},{default:s(()=>[l(X,null,{default:s(()=>[l(N,{flat:"",icon:"arrow_back",onClick:z,"aria-label":"Go Back",class:"bg-white text-primary"}),l(Y,{style:{"font-size":"28px"}},{default:s(()=>r[4]||(r[4]=[i(" Sheet ")])),_:1}),l(N,{flat:"",icon:"people",onClick:A,class:"q-ml-md bg-white text-primary","aria-label":"Edit people"}),l(N,{flat:"",icon:"add",onClick:r[0]||(r[0]=a=>B()),class:"q-ml-md bg-white text-primary","aria-label":"Add a new transaction"})]),_:1})]),_:1}),l(te,null,{default:s(()=>[l(re,{class:"q-my-md q-mr-md q-ml-md",ref_key:"nameInput",ref:I,modelValue:g.value,"onUpdate:modelValue":r[1]||(r[1]=a=>g.value=a),label:"Sheet Name",autogrow:"",outlined:"",onFocus:r[2]||(r[2]=a=>I.value.select()),onBlur:$},null,8,["modelValue"]),l(le,{modelValue:u.value,"onUpdate:modelValue":r[3]||(r[3]=a=>u.value=a),peopleOptions:D.value},null,8,["modelValue","peopleOptions"]),q.value||C.value?(c(),S(T,{key:0,class:"q-my-md q-mr-md q-ml-md"},{default:s(()=>[m("div",oe,[q.value?(c(),v("div",ue,o(t(e).username(t(e).currentSheetPeople[u.value]))+" is owed "+o(q.value),1)):k("",!0),C.value?(c(),v("div",ce,o(t(e).username(t(e).currentSheetPeople[u.value]))+" owes "+o(C.value),1)):k("",!0)])]),_:1})):k("",!0),_.value.detail.length>0?(c(),S(T,{key:1,class:"q-my-md q-mr-md q-ml-md"},{default:s(()=>[m("div",me,[(c(!0),v(Q,null,j(_.value.detail,a=>(c(),v("div",{key:a.id},[m("div",null,[m("span",null,o(a.amount>0?t(e).username(t(e).currentSheetPeople[u.value]):t(e).username(t(e).currentSheetPeople[a.person])),1),r[5]||(r[5]=m("span",null," owes ",-1)),m("span",null,o(a.amount<0?t(e).username(t(e).currentSheetPeople[u.value]):t(e).username(t(e).currentSheetPeople[a.person]))+" \xA0 ",1),m("span",{style:H({color:a.amount>0?"red":"green"})},o(t(d).displayCurrency(a.currency,Math.abs(a.amount))),5)])]))),128))])]),_:1})):k("",!0),l(Z,null,{default:s(()=>[(c(!0),v(Q,null,j(t(e).currentSheetTransactions,(a,p)=>(c(),S(se,{key:p,onLeft:y=>F(y,a),onClick:y=>B(a),"left-color":"red"},{left:s(()=>[l(J,{name:"delete"})]),default:s(()=>[l(ee,{clickable:"",class:K(p%2===0?"bg-grey-3":"bg-white")},{default:s(()=>{var y,L;return[l(T,{flat:"",bordered:"",class:"q-ml-sm q-mr-sm q-pl-sm q-pr-sm"},{default:s(()=>[l(ne,{class:"column q-pa-none",style:{display:"flex","justify-content":"center","align-items":"center"}},{default:s(()=>[m("div",null,o(t(d).getMonth(t(e).currentSheet.transactions[a].timestamp)),1),m("div",null,o(t(d).getDay(t(e).currentSheet.transactions[a].timestamp)),1)]),_:2},1024)]),_:2},1024),l(w,null,{default:s(()=>[l(f,null,{default:s(()=>[i(o(t(e).currentSheet.transactions[a].name||"New Transaction"),1)]),_:2},1024),l(f,{caption:""},{default:s(()=>[i(o(t(e).username(t(e).currentSheetPeople[t(e).currentSheet.transactions[a].payer])||"Nobody")+" paid "+o(t(d).displayCurrency(t(e).currentSheet.transactions[a].currency,t(e).currentSheet.transactions[a].amount)),1)]),_:2},1024)]),_:2},1024),t(e).currentSheet.transactions[a].payer===u.value?(c(),S(w,{key:0,side:"",style:{color:"green"}},{default:s(()=>[l(f,{caption:"",style:{color:"green"}},{default:s(()=>[i(o(t(e).username(t(e).currentSheetPeople[u.value])||"Nobody")+" lent ",1)]),_:1}),l(f,null,{default:s(()=>[i(o(t(d).displayCurrency(t(e).currentSheet.transactions[a].currency,t(e).currentSheet.transactions[a].amount-t(e).currentSheet.transactions[a].debts[t(e).currentSheet.transactions[a].payer].owedAmount)),1)]),_:2},1024)]),_:2},1024)):((L=(y=t(e).currentSheet.transactions[a].debts[u.value])==null?void 0:y.owedAmount)!=null?L:0)>0?(c(),S(w,{key:1,side:"",style:{color:"red"}},{default:s(()=>[l(f,{caption:"",style:{color:"red"}},{default:s(()=>[i(o(t(e).username(t(e).currentSheetPeople[u.value])||"Nobody")+" borrowed ",1)]),_:1}),l(f,null,{default:s(()=>{var O;return[i(o(t(d).displayCurrency(t(e).currentSheet.transactions[a].currency,(O=t(e).currentSheet.transactions[a].debts[u.value])==null?void 0:O.owedAmount)),1)]}),_:2},1024)]),_:2},1024)):(c(),S(w,{key:2,side:""},{default:s(()=>[l(f,null,{default:s(()=>r[6]||(r[6]=[i(" not involved ")])),_:1})]),_:1}))]}),_:2},1032,["class"])]),_:2},1032,["onLeft","onClick"]))),128))]),_:1})]),_:1})],64))}});export{be as default};
