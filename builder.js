/* WARDOGS TTK LAB // Weapon Builder. Sourced CL-516586, 2026-10-16. */
(()=>{
'use strict';
const source=window.WARDOGS_TEST;
if(!source||!source.WEAPONS)return;
const G=source.WEAPONS;
const el=id=>document.getElementById(id);
const safe=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const usd=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
const gr="Evo-3 Ultra|TCX-SPR|BMR-308|AK74|M4|T-21|Super-45|M249 SAW|M500|AMP-9|MP5|Galil|FAL|PP-19 Vityaz".split("|");
const cq="Evo-3 Ultra|AK74|M4|M249 SAW|M500|Galil|FAL".split("|");
const si="BMR-308|PKM|AK74|M4|T-21|Super-45|M249 SAW|M500|AMP-9|MP5|Galil|FAL|PP-19 Bizon|Evo-3 Ultra|TCX-SPR|PP-19 Vityaz".split("|");
const sn="M4|KH-2002|A-91|T-21|M249 SAW|Bushmaster M17S".split("|");
const P=[
["kobra","Sight","Kobra Reflex",520,.41,si,{ads:-15},"kobra-reflex"],
["t2","Sight","Compact T-2 Red Dot",340,.13,si,{ads:-10},"compact-t-2-red-dot"],
["vektor","Sight","Vektor Frenix-X Micro Reflex",820,.03,si.filter(x=>x!=="M249 SAW"),{ads:-13},"vektor-frenix-x-micro-reflex-sight"],
["afg","Underbarrel","AFG Angled Foregrip",800,.08,gr,{v:-6,h:-25,s:-22,ads:-15},"afg-angled-foregrip"],
["shift","Underbarrel","Shift Foregrip",840,.12,gr,{v:-8,h:-29,s:-24,ads:-13},"shift-foregrip"],
["rvg","Underbarrel","RVG Vertical Foregrip",720,.12,gr,{v:-25,h:-13,s:-19,ads:-10},"rvg-vertical-foregrip"],
["tdg","Underbarrel","TDG Vertical Foregrip",820,.13,gr,{v:-30,h:-15,s:-17,ads:10},"tdg-vertical-foregrip"],
["cqr","Underbarrel","CQR Tactical Front Rail Grip",950,.15,cq,{v:-30,h:-3,s:-9,ads:15},"cqr-tactical-front-rail-grip"],
["angled45","Underbarrel","45° Angled Foregrip",640,.09,gr,{v:5,h:-18,s:-18,ads:-17},"45-angled-foregrip"],
["stanag20","Magazine","STANAG 20 RND",10,.31,sn,{v:-16,h:-15,ads:-15},"stanag-20-rnd-magazine",20],
["stanag30","Magazine","STANAG 30 RND",55,.53,sn,{},"stanag-30-rnd-magazine-5",30],
["stanag60","Magazine","STANAG 60 RND",180,1.01,sn,{v:19,h:21,ads:19},"stanag-60-rnd-magazine",60]
].map(([id,slot,n,price,kg,fit,mods,ref,cap])=>({id,slot,n,price,kg,fit,mods,ref,cap}));
const MAP=Object.fromEntries(P.map(p=>[p.id,p]));
const WEIGHTS={"M4":2.92,"M500":3.52,"TCX-SPR":3.5,"AK74":3,"FAL":4.25,"Super-45":3,"Evo-3 Ultra":6.3,"T-21":3.27,"M249 SAW":7.5,"AMP-9":1.4,"MP5":2.54,"BMR-308":3.9,"Galil":3.95,"PP-19 Vityaz":2.9,"PP-19 Bizon":2.1,"PKM":7.5};
const ADS_BASE={"M4":.49,"M500":.365};
const SLOTS=["Sight","Underbarrel","Magazine"];
const q=new URLSearchParams(location.search);
const ST={gun:q.get("buildWeapon")||"M4",parts:{}};
if(!G.some(g=>g.n===ST.gun))ST.gun="M4";
for(const slot of SLOTS){const id=q.get("build"+slot),p=MAP[id];ST.parts[slot]=p&&p.slot===slot&&p.fit.includes(ST.gun)?id:"";}
const host=document.createElement("section");
host.className="panel wb";host.id="builder";host.setAttribute("aria-label","Weapon builder");
host.innerHTML='<div class="wbHeader"><div><div class="smallcaps">03 / Build and compare</div><h2>WEAPON <span>WORKBENCH</span></h2><p>Weapon selection, sourced compatible attachments, price and handling impact.</p></div><div class="wbButtons"><button type="button" class="ghost" id="wbClear">↺ Clear build</button><button type="button" class="ghost primary" id="wbShare">↗ Share build</button></div></div>'+
'<div class="wbMain"><div class="wbConfig"><div class="field"><label for="wbGun">Weapon</label><select id="wbGun"></select></div><p id="wbCoverage" class="wbMuted"></p><div id="wbSlots"></div><button id="wbCopy" class="ghost" type="button">Copy parts list</button></div>'+
'<div class="wbResults"><div class="smallcaps">Per-life loadout cost</div><div class="wbCost" id="wbCost"></div><p id="wbCostSub" class="wbMuted"></p><div id="wbTiles" class="wbTiles"></div><div class="smallcaps">Combined modifier preview</div><div id="wbStats"></div><div id="wbSummary"></div>'+
'<div class="wbWarning"><b>Testing, not proven:</b> Each individual attachment and fit listed here is supported by the 2026-10-16 extracted database. Summing modifiers across parts is a comparison-only approximation, not an in-game-verified stacking rule. STK/TTK are not changed: handling, recoil, magazine effects on reloads and pellet hit chance require separate testing. Muzzles/chokes are excluded because this extraction does not provide reliable weapon fit mappings.</div></div></div>';
const css=document.createElement("style");
css.textContent='.wb{margin:24px 0;overflow:hidden;scroll-margin-top:20px}.wbHeader{padding:25px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;background:#1b302a;border-bottom:1px solid var(--line)}.wbHeader h2{margin:5px 0;font-size:clamp(24px,3vw,40px);letter-spacing:-.04em}.wbHeader h2 span{color:var(--lime)}.wbHeader p,.wbMuted{font-size:12px;color:var(--muted)}.wbButtons{display:flex;gap:9px;flex-wrap:wrap}.wbMain{display:grid;grid-template-columns:1fr 1fr}.wbConfig,.wbResults{padding:24px}.wbConfig{border-right:1px solid var(--line)}.wbSlot{margin:19px 0}.wbSlot label{display:flex;justify-content:space-between;gap:10px;font-size:12px;font-weight:800;text-transform:uppercase;color:#cadfdd}.wbSlot small{color:var(--muted);font-weight:500;text-transform:none}.wbSlot select{width:100%;background:#0c171d;border:1px solid #3a5056;border-radius:10px;color:var(--text);padding:12px;margin:6px 0}.wbSlotMeta{color:var(--muted);font-size:11px;min-height:20px}.wbCost{font-size:42px;color:var(--lime);font-weight:850;font-variant-numeric:tabular-nums}.wbTiles{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:18px 0}.wbTile{background:#1c3032;border:1px solid #36524c;padding:13px 8px;border-radius:10px}.wbTile b{display:block;font-size:18px}.wbTile small{color:var(--muted);font-size:10px}.wbStat{margin:14px 0}.wbLine{display:flex;justify-content:space-between;gap:9px;font-size:12px}.wbGood{color:#bbf391}.wbBad{color:#ffad9e}.wbTrack{height:7px;background:#2c4245;border-radius:6px;margin-top:7px;overflow:hidden}.wbFill{height:100%;background:var(--lime)}.wbWarning{margin-top:18px;padding:14px;border-left:3px solid var(--gold);background:#2a2a24;border-radius:8px;font-size:11px;color:#dcd0b4;line-height:1.6}#wbSummary{font-size:12px;color:var(--muted);line-height:1.8}#wbSummary ul{padding-left:20px}@media(max-width:800px){.wbMain{grid-template-columns:1fr}.wbConfig{border:0;border-bottom:1px solid var(--line)}}@media(max-width:600px){.wbHeader,.wbConfig,.wbResults{padding:16px}.wbTile b{font-size:15px}}';
document.head.append(css);
const anchor=document.querySelector(".footergrid");
if(anchor)anchor.before(host);else document.querySelector("main").append(host);
el("wbGun").innerHTML=G.slice().sort((a,b)=>a.c.localeCompare(b.c)||a.n.localeCompare(b.n)).map(w=>'<option value="'+safe(w.n)+'">'+safe(w.n)+' · '+safe(w.c)+'</option>').join("");
el("wbGun").value=ST.gun;
const options=slot=>P.filter(p=>p.slot===slot&&p.fit.includes(ST.gun));
const chosen=()=>SLOTS.map(s=>MAP[ST.parts[s]]).filter(Boolean);
const weapon=()=>G.find(w=>w.n===ST.gun);
function url(){const u=new URL(location.href);u.hash="builder";u.searchParams.set("buildWeapon",ST.gun);for(const slot of SLOTS){const k="build"+slot;if(ST.parts[slot])u.searchParams.set(k,ST.parts[slot]);else u.searchParams.delete(k);}return u.href;}
function sync(){if(location.protocol!=="file:")try{history.replaceState(null,"",url());}catch(e){}}
const pct=n=>(n>0?"+":"")+n+"%";
function summary(){const w=weapon(),p=chosen(),mods={v:0,h:0,s:0,ads:0};for(const t of p)for(const k in mods)mods[k]+=t.mods[k]||0;return {cost:w.p+p.reduce((n,t)=>n+t.price,0),weight:WEIGHTS[w.n]==null?null:WEIGHTS[w.n]+p.reduce((n,t)=>n+t.kg,0),mods,p,w};}
function render(){
 const {cost,weight,mods,p,w}=summary();
 const totalOptions=SLOTS.reduce((n,slot)=>n+options(slot).length,0);
 el("wbCoverage").textContent=totalOptions?totalOptions+" confirmed item/weapon fit relationships in this curated build. Select a part to view its extracted modifier.":"No compatible items have been independently mapped for this weapon yet.";
 el("wbSlots").innerHTML=SLOTS.map(slot=>{
 const items=options(slot),selected=MAP[ST.parts[slot]];
 const entries=items.map(t=>'<option value="'+safe(t.id)+'" '+(ST.parts[slot]===t.id?'selected':'')+'>'+safe(t.n)+' · '+usd(t.price)+'</option>').join("");
 const mods=selected?Object.entries(selected.mods).map(([k,v])=>({v:"Vertical recoil",h:"Horizontal recoil",s:"Spread",ads:"ADS time"}[k])+": "+pct(v)).join(" · "):"";
 return '<div class="wbSlot"><label for="wb'+slot+'">'+slot+'<small>'+items.length+' fit(s)</small></label><select data-slot="'+slot+'" id="wb'+slot+'" '+(!items.length?'disabled':'')+'><option value="">'+(items.length?"None / stock":"No mapped options")+'</option>'+entries+'</select><div class="wbSlotMeta">'+(selected?safe(mods||"No stat modifier")+' · <a target="_blank" rel="noopener noreferrer" href="https://wardo.gs/items/'+safe(selected.ref)+'/">source ↗</a>':"")+'</div></div>';
 }).join("");
 el("wbCost").textContent=usd(cost);
 el("wbCostSub").textContent="Weapon "+usd(w.p)+" + "+usd(cost-w.p)+" attachments. Excludes unlocks, ammo and gear.";
 const cap=p.find(t=>t.slot==="Magazine")?.cap;
 el("wbTiles").innerHTML='<div class="wbTile"><b>'+p.length+'</b><small>Equipped attachments</small></div><div class="wbTile"><b>'+(weight===null?'—':weight.toFixed(2)+" kg")+'</b><small>Total weapon + parts</small></div><div class="wbTile"><b>'+(cap||"—")+'</b><small>Chosen mag capacity</small></div>';
 el("wbStats").innerHTML=[["v","Vertical recoil"],["h","Horizontal recoil"],["s","Spread"],["ads","ADS time"]].map(([k,label])=>{
   const n=mods[k],ncss=n<0?"wbGood":n>0?"wbBad":"";
   return '<div class="wbStat"><div class="wbLine"><span>'+label+'</span><strong class="'+ncss+'">'+pct(n)+'</strong></div><div class="wbTrack"><div class="wbFill" style="width:'+Math.min(100,Math.max(0,50-n))+'%"></div></div></div>';
 }).join("");
 el("wbSummary").innerHTML=p.length?'<b>Selected parts</b><ul>'+p.map(t=>'<li>'+safe(t.slot)+': '+safe(t.n)+'</li>').join('')+'</ul>':'No attachments selected.';
 if(ADS_BASE[w.n])el("wbSummary").innerHTML+='<p>Reference base ADS: '+ADS_BASE[w.n].toFixed(3)+'s. Estimated percentages above must not be treated as a verified final ADS time.</p>';
 sync();
}
function copy(s){const ok=()=>{const toast=el("toast");if(toast){toast.textContent="Copied to clipboard";toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),2400);}};if(navigator.clipboard?.writeText)navigator.clipboard.writeText(s).then(ok).catch(()=>window.prompt("Copy:",s));else window.prompt("Copy:",s);}
el("wbGun").addEventListener("change",e=>{ST.gun=e.target.value;for(const s of SLOTS)ST.parts[s]="";render();});
el("wbSlots").addEventListener("change",e=>{const s=e.target.dataset.slot,id=e.target.value,p=MAP[id];if(SLOTS.includes(s)){ST.parts[s]=p&&p.slot===s&&p.fit.includes(ST.gun)?id:"";render();}});
el("wbClear").addEventListener("click",()=>{for(const s of SLOTS)ST.parts[s]="";render();});
el("wbShare").addEventListener("click",()=>copy(url()));
el("wbCopy").addEventListener("click",()=>{const v=summary();copy([v.w.n+" · WARDOGS TTK Lab","Weapon: "+usd(v.w.p),...v.p.map(t=>t.slot+": "+t.n+" ("+usd(t.price)+")"),"Total: "+usd(v.cost),"Attachment stacking: unverified estimate",url()].join("\n"));});
window.WARDOGS_BUILDER_TEST={parts:P,compatible:(n,slot)=>P.filter(p=>p.slot===slot&&p.fit.includes(n)),summarize:summary};
render();
})();