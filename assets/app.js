const $=s=>document.querySelector(s);
const fmt=(n,d=2)=>isFinite(n)?n.toLocaleString("en-GB",{minimumFractionDigits:d,maximumFractionDigits:d}):"–";
const gbp=n=>isFinite(n)?"£"+fmt(n):"–";
const num=(v)=>parseFloat(v)||0;
const today=new Date().toISOString().slice(0,10);

function loanPay(P,r,y){const n=y*12,i=r/1200;return n<=0?0:(i?P*i/(1-Math.pow(1+i,-n)):P/n)}
const LEN={m:1,km:1000,cm:.01,mile:1609.344,yard:.9144,foot:.3048,inch:.0254};
const WT={kg:1,g:.001,tonne:1000,pound:.45359237,ounce:.0283495,stone:6.35029};
const conv=(t)=>({title:t.name,cat:"Converters",desc:t.desc,intro:t.intro,about:t.about,
 fields:[{id:"v",l:"Value",d:1},{id:"f",l:"From",t:"s",o:Object.keys(t.u),d:t.u===LEN?"mile":"pound"},{id:"t",l:"To",t:"s",o:Object.keys(t.u),d:t.u===LEN?"km":"kg"}],
 calc:x=>{const r=num(x.v)*t.u[x.f]/t.u[x.t];return{big:fmt(r,4)+" "+x.t,label:fmt(num(x.v),4)+" "+x.f+" equals",rows:[]}}});

const C={
mortgage:{title:"Mortgage Calculator",cat:"Money",desc:"Monthly repayments on a repayment mortgage.",
 intro:"Work out your monthly mortgage payment, total interest and total cost.",
 about:"This uses the standard repayment formula, where each payment covers interest plus part of the loan. Real mortgages may include fees, and fixed deals reset after a set term, so treat the result as a guide.",
 fields:[{id:"p",l:"Property price (£)",d:300000},{id:"d",l:"Deposit (£)",d:45000},{id:"r",l:"Interest rate (%)",d:4.5},{id:"y",l:"Term (years)",d:25}],
 calc:x=>{const L=num(x.p)-num(x.d),m=loanPay(L,num(x.r),num(x.y)),t=m*num(x.y)*12;return{big:gbp(m),label:"Monthly payment",rows:[["Amount borrowed",gbp(L)],["Loan to value",fmt(num(x.p)?L/num(x.p)*100:0,1)+"%"],["Total interest",gbp(t-L)],["Total repaid",gbp(t)]]}}},
loan:{title:"Loan Calculator",cat:"Money",desc:"Monthly payment and interest on any loan.",
 intro:"See what a personal loan, car loan or finance deal will cost each month.",
 about:"Enter the amount, the yearly interest rate (APR) and how long you will take to repay. Longer terms lower the monthly payment but raise the total interest.",
 fields:[{id:"a",l:"Loan amount (£)",d:10000},{id:"r",l:"Interest rate (%)",d:7.9},{id:"y",l:"Term (years)",d:4}],
 calc:x=>{const m=loanPay(num(x.a),num(x.r),num(x.y)),t=m*num(x.y)*12;return{big:gbp(m),label:"Monthly payment",rows:[["Total interest",gbp(t-num(x.a))],["Total repaid",gbp(t)]]}}},
compound:{title:"Compound Interest Calculator",cat:"Money",desc:"Grow savings with regular deposits.",
 intro:"Project how savings or investments grow when interest earns interest.",
 about:"Interest is compounded monthly and deposits are added at the end of each month. Real returns vary and are not guaranteed.",
 fields:[{id:"s",l:"Starting amount (£)",d:5000},{id:"m",l:"Monthly deposit (£)",d:200},{id:"r",l:"Annual interest (%)",d:5},{id:"y",l:"Years",d:15}],
 calc:x=>{const i=num(x.r)/1200,n=num(x.y)*12;let b=num(x.s);for(let k=0;k<n;k++)b=b*(1+i)+num(x.m);const c=num(x.s)+num(x.m)*n;return{big:gbp(b),label:"Final balance",rows:[["You paid in",gbp(c)],["Interest earned",gbp(b-c)]]}}},
vat:{title:"VAT Calculator",cat:"Money",desc:"Add or remove VAT from a price.",
 intro:"Add VAT to a net price, or take it out of a gross price.",
 about:"The standard UK VAT rate is 20%, with 5% and 0% rates for some goods. Check HMRC for the rate that applies to your product.",
 fields:[{id:"a",l:"Amount (£)",d:100},{id:"r",l:"VAT rate (%)",d:20},{id:"m",l:"Action",t:"s",o:["Add VAT","Remove VAT"],d:"Add VAT"}],
 calc:x=>{const a=num(x.a),r=num(x.r)/100,net=x.m==="Add VAT"?a:a/(1+r),g=net*(1+r);return{big:gbp(x.m==="Add VAT"?g:net),label:x.m==="Add VAT"?"Price including VAT":"Price excluding VAT",rows:[["Net",gbp(net)],["VAT",gbp(g-net)],["Gross",gbp(g)]]}}},
tip:{title:"Tip & Bill Split Calculator",cat:"Everyday",desc:"Tip and share the bill between friends.",
 intro:"Add a tip and split the bill evenly.",
 about:"Tipping 10–15% is typical in UK restaurants, and many add a service charge already, so check your bill first.",
 fields:[{id:"b",l:"Bill (£)",d:80},{id:"t",l:"Tip (%)",d:12.5},{id:"n",l:"People",d:4}],
 calc:x=>{const t=num(x.b)*num(x.t)/100,tot=num(x.b)+t;return{big:gbp(tot/Math.max(1,num(x.n))),label:"Each person pays",rows:[["Tip",gbp(t)],["Total",gbp(tot)]]}}},
percent:{title:"Percentage Calculator",cat:"Everyday",desc:"Percent of, percent change and more.",
 intro:"Three common percentage sums, worked out at once.",
 about:"Use the first result for discounts and tax, the second to see what share one number is of another, and the third for increases and decreases.",
 fields:[{id:"a",l:"Number A",d:25},{id:"b",l:"Number B",d:200}],
 calc:x=>{const a=num(x.a),b=num(x.b);return{big:fmt(a/100*b),label:fmt(a)+"% of "+fmt(b)+" is",rows:[[fmt(a)+" is what % of "+fmt(b),fmt(b?a/b*100:NaN)+"%"],["Change from "+fmt(a)+" to "+fmt(b),fmt(a?(b-a)/Math.abs(a)*100:NaN)+"%"]]}}},
bmi:{title:"BMI Calculator",cat:"Health",desc:"Body mass index from height and weight.",
 intro:"Check your body mass index using metric units.",
 about:"BMI is a rough screening measure and does not account for muscle, age or body shape. Speak to a health professional about your own situation. Adult ranges: under 18.5 underweight, 18.5–24.9 healthy, 25–29.9 overweight, 30 and over obese.",
 fields:[{id:"w",l:"Weight (kg)",d:70},{id:"h",l:"Height (cm)",d:172}],
 calc:x=>{const h=num(x.h)/100,b=num(x.w)/(h*h),c=b<18.5?"Underweight":b<25?"Healthy weight":b<30?"Overweight":"Obese";return{big:fmt(b,1),label:"Your BMI",rows:[["Range",isFinite(b)?c:"–"],["Healthy weight for your height",fmt(18.5*h*h,1)+" – "+fmt(24.9*h*h,1)+" kg"]]}}},
age:{title:"Age Calculator",cat:"Dates",desc:"Exact age in years, months and days.",
 intro:"Find your exact age and when your next birthday is.",
 about:"Enter a date of birth to see your age in years, months and days, plus the total days lived.",
 fields:[{id:"d",l:"Date of birth",type:"date",d:"1990-06-15"}],
 calc:x=>{const b=new Date(x.d),n=new Date();if(isNaN(b))return{big:"–",label:"Enter a date",rows:[]};let y=n.getFullYear()-b.getFullYear(),m=n.getMonth()-b.getMonth(),d=n.getDate()-b.getDate();if(d<0){m--;d+=new Date(n.getFullYear(),n.getMonth(),0).getDate()}if(m<0){y--;m+=12}let nb=new Date(n.getFullYear(),b.getMonth(),b.getDate());if(nb<=n)nb.setFullYear(n.getFullYear()+1);return{big:y+" years",label:y+" years, "+m+" months, "+d+" days",rows:[["Days lived",fmt(Math.floor((n-b)/864e5),0)],["Days to next birthday",fmt(Math.ceil((nb-n)/864e5),0)]]}}},
dates:{title:"Days Between Dates",cat:"Dates",desc:"Count days, weeks and months between two dates.",
 intro:"Count the days between any two dates.",
 about:"The count includes the difference between the two dates, not the start day itself.",
 fields:[{id:"a",l:"Start date",type:"date",d:today},{id:"b",l:"End date",type:"date",d:new Date(Date.now()+90*864e5).toISOString().slice(0,10)}],
 calc:x=>{const a=new Date(x.a),b=new Date(x.b);if(isNaN(a)||isNaN(b))return{big:"–",label:"Enter both dates",rows:[]};const d=Math.round((b-a)/864e5);return{big:fmt(Math.abs(d),0)+" days",label:d<0?"End date is before start date":"Between the dates",rows:[["Weeks",fmt(Math.abs(d)/7,1)],["Months (approx.)",fmt(Math.abs(d)/30.4375,1)]]}}},
length:conv({name:"Length Converter",desc:"Miles, km, feet, inches and more.",intro:"Convert between metric and imperial lengths.",about:"One mile is 1.609344 km and one foot is 30.48 cm. Results show up to four decimal places.",u:LEN}),
weight:conv({name:"Weight Converter",desc:"Kilograms, pounds, stone and more.",intro:"Convert between kilograms, pounds, stone and other units.",about:"One stone is 14 pounds, or about 6.35 kg. Handy for body weight and cooking.",u:WT}),
temp:{title:"Temperature Converter",cat:"Converters",desc:"Celsius, Fahrenheit and Kelvin.",intro:"Convert between Celsius, Fahrenheit and Kelvin.",
 about:"Water freezes at 0°C (32°F) and boils at 100°C (212°F). A typical UK oven at gas mark 4 is about 180°C.",
 fields:[{id:"v",l:"Value",d:180},{id:"f",l:"From",t:"s",o:["Celsius","Fahrenheit","Kelvin"],d:"Celsius"}],
 calc:x=>{const v=num(x.v),c=x.f==="Celsius"?v:x.f==="Fahrenheit"?(v-32)*5/9:v-273.15;return{big:fmt(c*9/5+32,1)+"°F",label:"Fahrenheit",rows:[["Celsius",fmt(c,1)+"°C"],["Kelvin",fmt(c+273.15,1)+" K"]]}}}
};

function mount(){const k=document.body.dataset.calc;if(!k||!C[k])return;const c=C[k];
const f=c.fields.map(x=>x.t==="s"?`<div><label for="${x.id}">${x.l}</label><select id="${x.id}">${x.o.map(o=>`<option${o===x.d?" selected":""}>${o}</option>`).join("")}</select></div>`:`<div><label for="${x.id}">${x.l}</label><input id="${x.id}" ${x.type==="date"?'type="date"':'type="number" inputmode="decimal" step="any"'} value="${x.d}"></div>`).join("");
$("#calc").innerHTML=`<div class="fields">${f}</div><div class="res" aria-live="polite"><div class="big" id="big"></div><div class="bl" id="bl"></div><div class="rows" id="rows"></div></div>`;
const run=()=>{const v={};c.fields.forEach(x=>v[x.id]=$("#"+x.id).value);const r=c.calc(v);$("#big").textContent=r.big;$("#bl").textContent=r.label;$("#rows").innerHTML=r.rows.map(a=>`<div class="row"><span>${a[0]}</span><span>${a[1]}</span></div>`).join("")};
c.fields.forEach(x=>{$("#"+x.id).addEventListener("input",run);$("#"+x.id).addEventListener("change",run)});run()}
mount();
const q=$("#q");if(q)q.oninput=()=>{const s=q.value.toLowerCase();document.querySelectorAll(".tile").forEach(t=>t.hidden=!t.textContent.toLowerCase().includes(s));document.querySelectorAll(".catgrp").forEach(g=>g.hidden=!g.querySelector(".tile:not([hidden])"))};
$("#theme").onclick=()=>{const d=document.documentElement,dark=matchMedia("(prefers-color-scheme:dark)").matches;const cur=d.data
