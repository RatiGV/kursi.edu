// Builds courses/<slug>/syllabus.pdf from the course one-pager.
// Usage: node tools/syllabus-pdf/build.js strategic-hr-management [more slugs...]
// Needs Playwright with Chromium (npm i -g playwright && npx playwright install chromium).
const path=require('path'),fs=require('fs');
let pw;try{pw=require('playwright');}catch(e){pw=require(path.join(process.env.PLAYWRIGHT_PATH||'/opt/node22/lib/node_modules','playwright'));}
const ROOT=path.resolve(__dirname,'../..');
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function extract(){
const q=(s,r)=>(r||document).querySelector(s),qa=(s,r)=>[...(r||document).querySelectorAll(s)],tx=e=>e?e.textContent.replace(/\s+/g,' ').trim():'';
const cs=getComputedStyle(document.documentElement),v=n=>cs.getPropertyValue(n).trim();
const lects=qa('.lect');
const d={
url:(q('link[rel=canonical]')||{}).href||'',
title:qa('h1 .ln').map(tx),
lead:tx(q('.hero .lead')),
rating:tx(q('.hero .rating span:last-child')),
facts:qa('.hero .facts > div').map(x=>[tx(q('dt',x)),tx(q('dd',x))]),
price:tx(q('.hero .price')),
reg:(q('.hero .btn-main')||{}).href||'',
tools:[tx(q('.plat p')),qa('.plat span').map(tx)],
syl:[tx(q('#syllabus h2')),tx(q('#syllabus .sub'))],
lec:qa('#lec > li').map(li=>({n:tx(q('.n',li)),t:tx(q('.t',li)),ph:tx(q('.ph',li)),items:qa('ul li',li).map(x=>[tx(x),x.classList.contains('tk')])})),
out:[tx(q('#outcomes h2')),tx(q('#outcomes .sub')),qa('#outcomes .out > div').map(b=>[tx(q('h3',b)),qa('li',b).map(tx)])],
jobs:[...new Set(qa('.jobs .track span:not([aria-hidden])').map(tx))],
lsub:tx(q('#lecturers .sub')),
lects:lects.map(l=>{const p=q('.portrait',l),st=getComputedStyle(p);return {ini:tx(q('.ini',l)),name:q('.portrait h2',l).innerHTML,role:tx(q('.portrait p',l)),bg:st.backgroundColor,fg:st.color,stats:qa('.stat > div',l).map(s=>[q('b',s).dataset.count||tx(q('b',s)),tx(q('span',s))]),bio:qa('.bio2 > *',l).map(e=>e.tagName==='OL'?{path:qa('li',e).map(li=>[tx(q('b',li)),tx(q('span',li))])}:{p:tx(e)})};}),
sched:qa('#join .sched > div').map(x=>[tx(q('b',x)),tx(x).replace(tx(q('b',x)),'').trim()]),
req:tx(q('#join .req')).replace(/^[^:]+:\s*/,''),
contact:qa('#join .contact a').map(tx),
col:{paper:getComputedStyle(document.body).backgroundColor,ink:getComputedStyle(document.body).color,card:v('--card'),muted:v('--muted'),line:v('--line'),soft:v('--soft'),accent:getComputedStyle(q('.lec .n')).color,accentInk:getComputedStyle(q('.hero .btn-main')).color,accentBg:getComputedStyle(q('.hero .btn-main')).backgroundColor}
};
return d;
}
function html(d,dir){
const c=d.col,F='file://'+dir+'/assets/fonts/',fact=k=>(d.facts.find(f=>f[0]===k)||[])[1]||'';
const hm=d.syl[1].match(/(\d+)\s*საათი თეორია და (\d+)\s*საათი პრაქტიკა/),meet=fact('შეხვედრები').match(/(\d+)\s*შეხვედრა,\s*(\d+)\s*სთ/);
const big=[[meet?meet[1]:'',"შეხვედრა"],[meet?meet[2]:'',"საათი ჯამში"]].concat(hm?[[hm[1],'სთ თეორია'],[hm[2],'სთ პრაქტიკა']]:[]).filter(x=>x[0]);
const tiles=['accent','amber','ink'],pc=d.lects.map(l=>[l.bg,l.fg]);
const phases=[];d.lec.forEach(l=>{let p=phases.find(x=>x.n===l.ph);if(!p)phases.push(p={n:l.ph,l:[]});p.l.push(l);});
const nPrac=d.lec.filter(l=>l.t.startsWith('*')).length;
let h=`<!doctype html><html lang="ka"><head><meta charset="utf-8"><style>
@font-face{font-family:FiraGO;font-weight:400;src:url('${F}firago-400.woff2')}
@font-face{font-family:FiraGO;font-weight:600;src:url('${F}firago-600.woff2')}
@font-face{font-family:FiraGO;font-weight:700;src:url('${F}firago-700.woff2')}
@font-face{font-family:FiraGO;font-weight:800;src:url('${F}firago-800.woff2')}
@font-face{font-family:NeueCaps;src:url('${F}neuecaps.woff2')}
@page{size:A4;margin:14mm 0 16mm}
@page:first{margin-top:0}
:root{--paper:${c.paper};--ink:${c.ink};--card:${c.card};--muted:${c.muted};--line:${c.line};--soft:${c.soft};--acc:${c.accent};--acc-bg:${c.accentBg};--acc-ink:${c.accentInk}}
*{box-sizing:border-box}
html{background:#fff}
body{margin:0;color:var(--ink);font:10.5pt/1.55 FiraGO,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{padding:0 16mm}
.cover{padding-top:14mm}
.top{display:flex;justify-content:space-between;align-items:center;padding-bottom:7mm;border-bottom:1px solid var(--line)}
.top img{height:30px}
.top span{font-weight:700;font-size:9.5pt;padding:5px 12px;border-radius:99px;background:var(--acc-bg);color:var(--acc-ink)}
h1{font-family:NeueCaps,FiraGO;font-stretch:68%;font-weight:900;font-size:44pt;line-height:.94;margin:7mm 0 5mm}
h1 span{display:block}h1 span:last-child{color:var(--acc)}
h2{font-family:NeueCaps,FiraGO;font-stretch:74%;font-weight:900;font-size:26pt;line-height:1;margin:0 0 3mm}
h3{font-size:12.5pt;margin:0 0 3mm}
.lead{font-size:11pt;line-height:1.55;color:var(--muted);margin:0 0 5mm}
.sub{color:var(--muted);margin:0 0 6mm}
.big{display:grid;grid-template-columns:repeat(${big.length},1fr);gap:3mm;margin:0 0 5mm}
.big div{border-radius:16px;padding:4mm 5mm 3mm;background:var(--paper);border:1px solid var(--line)}
.big div:first-child{background:var(--acc-bg);color:var(--acc-ink);border-color:transparent}
.big b{display:block;font-size:24pt;font-weight:800;line-height:1}
.big span{font-size:9.5pt;opacity:.85}
.facts{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm 6mm;margin:0 0 5mm;padding:4mm 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.facts dt{font-size:9pt;color:var(--muted)}.facts dd{margin:0;font-weight:700}
.row{display:grid;grid-template-columns:1fr 1fr;gap:5mm;margin-bottom:5mm}
.box{border-radius:16px;background:var(--paper);border:1px solid var(--line);padding:4mm 5mm}
.box p{margin:0}
.sched{display:flex;gap:3mm;margin-top:3mm}
.sched div{flex:1;border-radius:12px;background:var(--soft);padding:3mm 4mm;font-size:10pt}
.sched b{display:block}
.pills{display:flex;flex-wrap:wrap;gap:2mm;margin:0;padding:0;list-style:none}
.pills li{padding:1.6mm 3.4mm;border-radius:10px;background:var(--paper);border:1px solid var(--line);font-size:9.5pt;font-weight:600}
.price{display:flex;align-items:center;justify-content:space-between;gap:5mm;border-radius:18px;background:var(--ink);color:var(--paper);padding:5mm 6mm}
.price b{font-size:26pt;font-weight:800;line-height:1}
.price span{font-size:9.5pt;opacity:.8}
.price a{color:var(--paper);font-weight:700;font-size:10pt;text-decoration:none;border:1.5px solid var(--paper);border-radius:10px;padding:2.5mm 4mm}
.brk{break-before:page}
.ph{margin:6mm 0 3mm;display:flex;align-items:center;gap:3mm;break-after:avoid}
.ph b{font-size:9pt;padding:1.2mm 3mm;border-radius:99px;background:var(--ink);color:var(--paper)}
.ph span{font-weight:700;font-size:11pt}
.lec{display:grid;grid-template-columns:13mm 1fr auto;gap:0 4mm;background:var(--paper);border:1px solid var(--line);border-radius:14px;padding:3.2mm 5mm;margin-bottom:2.4mm;break-inside:avoid}
.lec .n{font-weight:800;font-size:17pt;color:var(--acc);line-height:1.2}
.lec .t{font-weight:700;font-size:11pt;line-height:1.35;padding-top:1mm}
.lec .tg{align-self:start;margin-top:1mm;font-size:8.5pt;font-weight:700;padding:.8mm 2.6mm;border-radius:99px;background:var(--soft);white-space:nowrap}
.lec .tg.pr{background:var(--acc-bg);color:var(--acc-ink)}
.lec ul{grid-column:2/4;margin:1.6mm 0 0;padding:0;list-style:none;display:grid;gap:.8mm}
.lec ul li{display:flex;gap:2.6mm;font-size:9.8pt}
.lec ul li:before{content:"";flex:none;width:6px;height:6px;margin-top:6px;border-radius:50%;background:var(--acc)}
.lec ul li.tk{font-weight:700}
.can{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:2.4mm;counter-reset:c}
.can li{display:flex;gap:3mm;padding:3mm 4mm;border-radius:12px;background:var(--paper);border:1px solid var(--line);font-size:9.8pt;break-inside:avoid}
.can li:before{counter-increment:c;content:counter(c);flex:none;width:6mm;height:6mm;border-radius:6px;background:var(--acc-bg);color:var(--acc-ink);font-weight:800;font-size:8.5pt;display:grid;place-items:center}
.lt{display:grid;grid-template-columns:60mm 1fr;gap:7mm;margin:0 0 6mm;break-inside:avoid}
.por{position:relative;overflow:hidden;border-radius:20px;padding:5mm;min-height:50mm;display:flex;flex-direction:column;justify-content:flex-end}
.por i{position:absolute;top:-2mm;right:3mm;font-style:normal;font-weight:800;font-stretch:62.5%;font-size:60pt;line-height:1;opacity:.16}
.por h4{font-family:NeueCaps,FiraGO;font-stretch:74%;font-weight:900;font-size:19pt;line-height:1;margin:0}
.por p{margin:2mm 0 0;font-size:9.5pt;opacity:.9}
.por .st{display:flex;gap:5mm;margin-top:4mm}
.por .st b{display:block;font-size:19pt;font-weight:800;line-height:1}
.por .st span{font-size:8pt;opacity:.85}
.bio p{margin:0 0 2.4mm;font-size:9.8pt}
.path{list-style:none;margin:0 0 3mm;padding:0}
.path li{display:grid;grid-template-columns:44mm 1fr;gap:4mm;padding:1.6mm 0;border-top:1px solid var(--line);font-size:9.8pt}
.fin{margin-top:4mm;border-radius:20px;background:var(--acc-bg);color:var(--acc-ink);padding:7mm;display:grid;grid-template-columns:1fr auto;gap:6mm;align-items:center;break-inside:avoid}
.fin h2{margin:0 0 2mm}
.fin p{margin:0;opacity:.9}
.fin a{color:inherit}
.fin div:last-child{text-align:right;font-weight:700;line-height:1.8}
</style></head><body>`;
h+=`<section class="pg cover"><div class="top"><img src="file://${dir}/assets/images/logo-bl.svg" alt="Smart Academy"><span>სილაბუსი · ${esc(d.rating)}</span></div>`;
h+=`<h1>${d.title.map(t=>'<span>'+esc(t)+'</span>').join('')}</h1><p class="lead">${esc(d.lead)}</p>`;
h+=`<div class="big">${big.map(b=>'<div><b>'+esc(b[0])+'</b><span>'+esc(b[1])+'</span></div>').join('')}</div>`;
h+=`<dl class="facts">${d.facts.map(f=>'<div><dt>'+esc(f[0])+'</dt><dd>'+esc(f[1])+'</dd></div>').join('')}</dl>`;
h+=`<div class="row"><div class="box"><h3>განრიგი</h3><p>${esc(fact('ხანგრძლივობა'))}, ${esc(fact('შეხვედრები'))}${nPrac?', მათ შორის '+nPrac+' პრაქტიკული შეხვედრა':''}.</p><div class="sched">${d.sched.map(s=>'<div><b>'+esc(s[0])+'</b>'+esc(s[1])+'</div>').join('')}</div></div><div class="box"><h3>ვისთვის არის კურსი</h3><p>${esc(d.req)}</p></div></div>`;
h+=`<div class="price"><div><b>${esc(d.price)}</b><br><span>ერთიანი გადახდა ან 0% განვადება</span></div><a href="${esc(d.reg)}">რეგისტრაცია კურსზე →</a></div></section>`;
h+=`<section class="pg brk"><h2>${esc(d.syl[0])}</h2><p class="sub">${esc(d.syl[1])}</p>`;
phases.forEach((p,i)=>{h+=`<div class="ph"><b>ეტაპი ${i+1}</b><span>${esc(p.n)}</span></div>`;p.l.forEach(l=>{const pr=l.t.startsWith('*');h+=`<div class="lec"><span class="n">${esc(l.n)}</span><span class="t">${esc(pr?l.t.slice(1):l.t)}</span><span class="tg${pr?' pr':''}">${pr?'პრაქტიკა':'თეორია'}</span><ul>${l.items.map(x=>'<li'+(x[1]?' class="tk"':'')+'>'+esc(x[1]?x[0].replace(/^\*/,''):x[0])+'</li>').join('')}</ul></div>`;});});
h+=`</section><section class="pg brk"><h2>${esc(d.out[0])}</h2><p class="sub">${esc(d.out[1])}</p>`;
d.out[2].forEach((b,i)=>{h+=`<h3>${esc(b[0])}</h3>`+(i?`<ol class="can">${b[1].map(t=>'<li>'+esc(t)+'</li>').join('')}</ol>`:`<ul class="pills" style="margin-bottom:6mm">${b[1].map(t=>'<li>'+esc(t)+'</li>').join('')}</ul>`);});
if(d.tools[1].length)h+=`<h3 style="margin-top:6mm">${esc(d.tools[0].replace(/:$/,''))}</h3><ul class="pills">${d.tools[1].map(t=>'<li>'+esc(t)+'</li>').join('')}</ul>`;
if(d.jobs.length)h+=`<h3 style="margin-top:6mm">დაკავშირებული პროფესიები</h3><ul class="pills">${d.jobs.map(t=>'<li>'+esc(t)+'</li>').join('')}</ul>`;
h+=`</section><section class="pg brk"><h2>ლექტორები</h2><p class="sub">${esc(d.lsub)}</p>`;
d.lects.forEach(l=>{h+=`<div class="lt"><div class="por" style="background:${l.bg};color:${l.fg}"><i>${esc(l.ini)}</i><h4>${l.name}</h4><p>${esc(l.role)}</p><div class="st">${l.stats.map(s=>'<div><b>'+esc(s[0])+(/\+/.test(s[1])?'+':'')+'</b><span>'+esc(s[1].replace(/^\+\s*/,''))+'</span></div>').join('')}</div></div><div class="bio">${l.bio.map(b=>b.path?'<ol class="path">'+b.path.map(x=>'<li><b>'+esc(x[0])+'</b><span>'+esc(x[1])+'</span></li>').join('')+'</ol>':'<p>'+esc(b.p)+'</p>').join('')}</div></div>`;});
h+=`<div class="fin"><div><h2>ადგილის დაჯავშნა</h2><p>${esc(fact('ფორმატი'))} · ${esc(fact('დაწყება'))} · ${esc(fact('შეხვედრები'))}</p><p style="margin-top:2mm"><a href="${esc(d.reg)}">${esc(d.reg.replace(/^https?:\/\//,''))}</a></p></div><div>${d.contact.map(esc).join('<br>')}<br>${esc(d.url.replace(/^https?:\/\//,'').replace(/\/$/,''))}</div></div></section></body></html>`;
return h;
}
(async()=>{
const slugs=process.argv.slice(2);if(!slugs.length){console.error('usage: node build.js <course-slug>...');process.exit(1);}
const b=await pw.chromium.launch();
for(const slug of slugs){
const dir=path.join(ROOT,'courses',slug),p=await b.newPage({viewport:{width:1280,height:900},reducedMotion:'reduce',colorScheme:'light'});
await p.goto('file://'+dir+'/index.html');await p.waitForTimeout(400);
const d=await p.evaluate(extract);
const tmp=path.join(dir,'.syllabus-print.html');fs.writeFileSync(tmp,html(d,dir));
await p.goto('file://'+tmp);await p.evaluate(()=>document.fonts.ready);
const host=d.url.replace(/^https?:\/\//,'').replace(/\/$/,'');
await p.pdf({path:path.join(dir,'syllabus.pdf'),format:'A4',printBackground:true,displayHeaderFooter:true,headerTemplate:'<span></span>',footerTemplate:`<div style="width:100%;font:8px sans-serif;color:#888;padding:0 16mm;display:flex;justify-content:space-between"><span>Smart Academy · ${host}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`});
fs.unlinkSync(tmp);await p.close();console.log('built',path.join('courses',slug,'syllabus.pdf'));}
await b.close();})();
