/* WARDOGS TTK LAB // Weapon Builder. Sourced CL-516586, 2026-10-16. */
(()=>{
'use strict';
const source=window.WARDOGS_TEST;
if(!source||!source.WEAPONS)return;
const G=source.WEAPONS;
const BASE=window.WARDOGS_BASE_STATS||{};

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
].map(([id,slot,n,price,kg,fit,mods,ref,cap])=>({id,slot,n,price,kg,fit,mods,ref,cap})).concat(window.WARDOGS_EXTRA_PARTS||[],window.WARDOGS_MUZZLE_PARTS||[]);
// Optic fits are computed from game-file slot filters (shared sights + weapon-specific exceptions).
// Never fall back to a curated partial list: a missing match means the fit remains unverified.
const SIGHT_FITS=window.WARDOGS_SIGHT_RULES?.fits||{};
const SIGHT_META=window.WARDOGS_SIGHT_RULES?.meta||{};
let OPTIC_BAND="All";
const opticBand=p=>{const category=SIGHT_META[p.n]?.category;if(["Short","Medium","Long"].includes(category))return category;const zoom=p.zoom||1.2;return zoom<=2?"Short":zoom<=4?"Medium":"Long";};
for(const part of P){
 if(part.slot!=="Sight")continue;
 part.fit=Object.prototype.hasOwnProperty.call(SIGHT_FITS,part.n)?SIGHT_FITS[part.n]:[];
 part.fitEvidence="cooked slot filter";
}
const MAP=Object.fromEntries(P.map(p=>[p.id,p]));
const WEIGHTS={"M4":2.92,"M500":3.52,"TCX-SPR":3.5,"AK74":3,"FAL":4.25,"Super-45":3,"Evo-3 Ultra":6.3,"T-21":3.27,"M249 SAW":7.5,"AMP-9":1.4,"MP5":2.54,"BMR-308":3.9,"Galil":3.95,"PP-19 Vityaz":2.9,"PP-19 Bizon":2.1,"PKM":7.5};
const ADS_BASE={"M4":.49,"M500":.365,"MP43":.35,"M14":.53};
const SLOTS=["Sight","Muzzle","Underbarrel","Magazine"];
const q=new URLSearchParams(location.search);
const ST={gun:q.get("buildWeapon")||"M4",parts:{},ammo:null,armor:2};
if(!G.some(g=>g.n===ST.gun))ST.gun="M4";
const ammoFor=g=>g.c==="Shotgun"?["Buckshot","Slug"]:g.c==="Bow"?["STD"]:["FMJ","AP","HP"];
ST.ammo=ammoFor(G.find(g=>g.n===ST.gun)).includes(q.get("buildAmmo"))?q.get("buildAmmo"):ammoFor(G.find(g=>g.n===ST.gun))[0];
const parsedArmor=Number(q.get("buildArmor"));ST.armor=q.has("buildArmor")&&Number.isInteger(parsedArmor)&&parsedArmor>=0&&parsedArmor<=4?parsedArmor:2;
for(const slot of SLOTS){const id=q.get("build"+slot),p=MAP[id];ST.parts[slot]=p&&!p.listedOnly&&p.slot===slot&&p.fit.includes(ST.gun)?id:"";}
// Preserve open sections after each card selection redraw.
const hasSingleUnderbarrel=(gun)=>P.filter(part=>part.slot==="Underbarrel"&&part.fit.includes(gun)).length===1;
const EXPANDED=Object.fromEntries(SLOTS.map(slot=>[slot,slot==="Sight"||Boolean(ST.parts[slot])||(slot==="Underbarrel"&&hasSingleUnderbarrel(ST.gun))]));
let resetPanelsOnWeaponChange=false;
let pendingCollapseSlot=null;
const host=document.createElement("section");
host.className="panel wb";host.id="builder";host.setAttribute("aria-label","Weapon builder");
host.innerHTML='<div class="wbHeader"><div><div class="smallcaps">Build and compare</div><h2>WEAPON <span>WORKBENCH</span></h2><p>Weapon selection, sourced compatible attachments, price and handling impact.</p></div><div class="wbButtons"><button type="button" class="ghost" id="wbClear">↺ Clear build</button><button type="button" class="ghost primary" id="wbShare">↗ Share build</button></div></div>'+
'<div class="wbMain"><div class="wbConfig"><div class="field"><label for="wbGun">Weapon</label><select id="wbGun"></select></div><p id="wbCoverage" class="wbMuted"></p><div class="field wbChoice"><label for="wbAmmo">Loaded ammunition</label><select id="wbAmmo"></select></div><div class="field wbChoice"><label for="wbArmor">Target body armor (TTK reference)</label><select id="wbArmor"><option value="0">No armor</option><option value="1">Level 1</option><option value="2">Level 2</option><option value="3">Level 3</option><option value="4">Level 4</option></select></div><div id="wbSlots"></div><button id="wbCopy" class="ghost" type="button">Copy parts list</button></div>'+
'<div class="wbResults"><div class="smallcaps">Per-life loadout cost</div><div class="wbCost" id="wbCost"></div><p id="wbCostSub" class="wbMuted"></p><div id="wbBase" class="wbBase" aria-label="Unmodified weapon statistics"></div><div id="wbMOA" class="wbMOA" aria-live="polite" aria-label="Configured weapon accuracy"></div><div id="wbTiles" class="wbTiles"></div><div id="wbBallistics" class="wbBallistics"></div><div class="smallcaps">Combined modifier preview</div><div id="wbStats"></div><div id="wbSummary"></div>'+
'<div class="wbWarning"><b>Testing, not proven:</b> Each individual attachment and fit listed here is supported by the 2026-10-16 extracted database. Summing modifiers across parts is a comparison-only approximation, not an in-game-verified stacking rule. STK/TTK are not changed: handling, recoil, magazine effects on reloads and pellet hit chance require separate testing. Muzzle/choke fit data now comes from the extracted barrel muzzle-slot rules. Muzzle modifiers are included in the handling preview; shotgun pellet-pattern effects and live TTK impact are not modeled. Missing or unpriced parts remain source-only.</div></div></div>';
const css=document.createElement("style");
css.textContent='.wb{margin:24px 0;overflow:hidden;scroll-margin-top:20px}.wbHeader{padding:25px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;background:#1b302a;border-bottom:1px solid var(--line)}.wbHeader h2{margin:5px 0;font-size:clamp(24px,3vw,40px);letter-spacing:-.04em}.wbHeader h2 span{color:var(--lime)}.wbHeader p,.wbMuted{font-size:12px;color:var(--muted)}.wbButtons{display:flex;gap:9px;flex-wrap:wrap}.wbMain{display:grid;grid-template-columns:1fr 1fr}.wbConfig,.wbResults{padding:24px}.wbConfig{border-right:1px solid var(--line)} .wbChoice{margin-top:13px}.wbChoice select{background:#0c171d;border:1px solid #3a5056;border-radius:10px;color:var(--text);padding:12px;width:100%}.wbBallistics{padding:11px 13px;border:1px solid #36524c;background:#1c3032;margin:8px 0 18px;border-radius:9px;font-size:12px;line-height:1.6}.wbBallistics strong{color:var(--lime)}.wbSlot{margin:19px 0}.wbSlot label{display:flex;justify-content:space-between;gap:10px;font-size:12px;font-weight:800;text-transform:uppercase;color:#cadfdd}.wbSlot small{color:var(--muted);font-weight:500;text-transform:none}.wbSlot select{width:100%;background:#0c171d;border:1px solid #3a5056;border-radius:10px;color:var(--text);padding:12px;margin:6px 0}.wbSlotMeta{color:var(--muted);font-size:11px;min-height:20px}.wbCost{font-size:42px;color:var(--lime);font-weight:850;font-variant-numeric:tabular-nums}.wbTiles{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:18px 0}.wbTile{background:#1c3032;border:1px solid #36524c;padding:13px 8px;border-radius:10px}.wbTile b{display:block;font-size:18px}.wbTile small{color:var(--muted);font-size:10px}.wbStat{margin:14px 0}.wbLine{display:flex;justify-content:space-between;gap:9px;font-size:12px}.wbGood{color:#bbf391}.wbBad{color:#ffad9e}.wbTrack{height:7px;background:#2c4245;border-radius:6px;margin-top:7px;overflow:hidden}.wbFill{height:100%;background:var(--lime)}.wbWarning{margin-top:18px;padding:14px;border-left:3px solid var(--gold);background:#2a2a24;border-radius:8px;font-size:11px;color:#dcd0b4;line-height:1.6}#wbSummary{font-size:12px;color:var(--muted);line-height:1.8}#wbSummary ul{padding-left:20px}@media(max-width:800px){.wbMain{grid-template-columns:1fr}.wbConfig{border:0;border-bottom:1px solid var(--line)}}@media(max-width:600px){.wbHeader,.wbConfig,.wbResults{padding:16px}.wbTile b{font-size:15px}}';
css.textContent+= '.wbBase{margin:14px 0 19px;border:1px solid #3a5350;background:#14262c;border-radius:12px;padding:15px}.wbBaseHead{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:7px;margin-bottom:11px}.wbBaseHead h3{font-size:13px;letter-spacing:.09em;text-transform:uppercase;margin:0}.wbBaseHead a{font-size:11px}.wbBaseGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.wbBaseItem{border:1px solid #365047;background:#1a3032;padding:9px 11px;border-radius:7px;min-width:0}.wbBaseItem b{display:block;font-size:16px;overflow-wrap:anywhere}.wbBaseItem small{font-size:10px;color:var(--muted)}.wbBaseNote{font-size:10px;color:var(--muted);margin-top:9px}.wbSlotsHint{font-size:11px;color:var(--muted);margin:0 0 9px}.wbOptionGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.wbOptionWrap{border:1px solid #37504e;border-radius:10px;min-width:0;background:#122329;overflow:hidden}.wbOptionWrap.active{border-color:var(--lime);background:#22372c}.wbOption{width:100%;display:block;cursor:pointer;text-align:left;background:none;border:0;color:var(--text);padding:12px}.wbOption:focus-visible{outline:2px solid var(--lime);outline-offset:-2px}.wbOptionTitle{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}.wbOptionName{font-size:12px;font-weight:800;line-height:1.35;overflow-wrap:anywhere}.wbOptionPrice{font-size:12px;color:var(--lime);white-space:nowrap;font-weight:800}.wbOptionMeta{display:block;font-size:10px;color:var(--muted);margin-top:4px}.wbModGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px;margin-top:10px}.wbMod{display:flex;align-items:center;justify-content:space-between;gap:5px;font-size:10px;padding:5px 6px;border-radius:5px;background:#23373b}.wbMod b{white-space:nowrap}.wbOptionSource{border-top:1px solid #35504c;padding:4px 10px 7px;text-align:right;font-size:10px}.wbStock{font-weight:750;font-size:12px;margin:5px 0 10px;padding:8px 12px;border-radius:8px;border:1px solid #416158;background:#0e2125;color:#d5e3de;cursor:pointer}.wbStock.active{background:#203829;border-color:var(--lime);color:var(--lime)}.wbSlot{margin:20px 0 25px}.wbSlotLegend{font-size:10px;color:var(--muted);margin:5px 0 9px}.wbOptionWrap .wbGood{color:#bdf19d}.wbOptionWrap .wbBad{color:#ffb0a7}@media(max-width:1150px){.wbOptionGrid{grid-template-columns:1fr}}@media(max-width:800px){.wbOptionGrid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:460px){.wbOptionGrid{grid-template-columns:1fr}}';
css.textContent+=' .wbCollapsible{margin:13px 0;border:1px solid var(--line);border-radius:12px;overflow:hidden;background:#122128}.wbCollapsible>summary{list-style:none;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 17px;cursor:pointer;color:var(--text);font-size:12px;font-weight:850;letter-spacing:.1em;text-transform:uppercase;background:#1b2e33;user-select:none}.wbCollapsible>summary::-webkit-details-marker{display:none}.wbCollapsible>summary::after{content:"▾";font-size:16px;color:var(--lime);transition:transform .15s}.wbCollapsible:not([open])>summary::after{transform:rotate(-90deg)}.wbCollapsible>summary:hover{background:#243c41}.wbCollapsible>summary:focus-visible{outline:2px solid var(--lime);outline-offset:-2px}.wbSlotCount{margin-left:auto;margin-right:12px;color:var(--muted);font-weight:500;text-transform:none;letter-spacing:0;font-size:11px}.wbSlotContent{padding:12px 14px 17px;border-top:1px solid var(--line)}.wbCollapsible:not([open]){margin-bottom:10px}@media(max-width:460px){.wbSlotCount{font-size:10px;margin-right:5px}}';
css.textContent+=' .wbUnpriced{border-style:dashed;opacity:.64}.wbUnpriced .wbOption{cursor:not-allowed}.wbUnpriced .wbOptionPrice{color:#b4a9a3}.wbOptionMeta{line-height:1.45}';
css.textContent+='.wbSightTabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:11px}.wbSightTab{border:1px solid #425f5b;background:#15262e;color:#bbd2cd;border-radius:7px;padding:8px 13px;cursor:pointer;font-size:11px;font-weight:700}.wbSightTab.active,.wbSightTab:hover{background:#324d34;border-color:var(--lime);color:var(--lime)}.wbSightTab:focus-visible{outline:2px solid var(--lime);outline-offset:2px}';
css.textContent+='.wbMOA{border:1px solid #4e6c5c;background:linear-gradient(135deg,#19352f,#17282e);padding:15px;border-radius:11px;margin:14px 0 18px}.wbMOAHeader{display:flex;gap:12px;align-items:center;justify-content:space-between}.wbMOAHeader strong{font-size:13px;letter-spacing:.05em;text-transform:uppercase}.wbMOAHeader span{font-size:10px;color:var(--muted)}.wbMOAGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin:12px 0}.wbMOAGrid>div{min-width:0;border-radius:8px;border:1px solid #355348;background:#1c3431;padding:10px 8px}.wbMOAGrid small{color:var(--muted);font-size:10px;display:block;line-height:1.4;margin-bottom:5px}.wbMOAGrid strong{font-size:clamp(14px,1.7vw,21px);font-variant-numeric:tabular-nums;overflow-wrap:anywhere}.wbMOATotal{color:var(--lime)}.wbMOA p{font-size:11px;line-height:1.6;color:var(--muted);margin:0}.wbMOA a{color:var(--lime)}@media(max-width:390px){.wbMOAGrid{grid-template-columns:repeat(2,minmax(0,1fr))}}';
document.head.append(css);
const anchor=document.querySelector(".footergrid");
if(anchor)anchor.before(host);else document.querySelector("main").append(host);
// Group weapons by the same classes used in the main TTK table.
// Native optgroup labels remain visible in the browser dropdown, including Opera.
const WEAPON_GROUPS=[
 ["AR","Assault Rifles"],
 ["SMG","Submachine Guns"],
 ["LMG","Light Machine Guns"],
 ["DMR","Marksman Rifles"],
 ["Sniper","Sniper Rifles"],
 ["Shotgun","Shotguns"],
 ["Pistol","Pistols"],
 ["Bow","Bows"]
];
el("wbGun").innerHTML=WEAPON_GROUPS.map(([weaponClass,groupLabel])=>{
 const entries=G.filter(w=>w.c===weaponClass).sort((a,b)=>a.n.localeCompare(b.n));
 if(!entries.length)return "";
 return '<optgroup label="'+safe(groupLabel)+'">'+entries.map(w=>
  '<option value="'+safe(w.n)+'">'+safe(w.n)+'</option>'
 ).join("")+'</optgroup>';
}).join("");
el("wbGun").value=ST.gun;
const options=slot=>P.filter(p=>p.slot===slot&&p.fit.includes(ST.gun));
const chosen=()=>SLOTS.map(s=>MAP[ST.parts[s]]).filter(p=>p&&!p.listedOnly);
const weapon=()=>G.find(w=>w.n===ST.gun);
function url(){const u=new URL(location.href);u.hash="builder";u.searchParams.set("buildWeapon",ST.gun);u.searchParams.set("buildAmmo",ST.ammo);u.searchParams.set("buildArmor",String(ST.armor));for(const slot of SLOTS){const k="build"+slot;if(ST.parts[slot])u.searchParams.set(k,ST.parts[slot]);else u.searchParams.delete(k);}return u.href;}
function sync(){if(location.protocol!=="file:")try{history.replaceState(null,"",url());}catch(e){}}
const pct=n=>(n>0?"+":"")+n+"%";
// Native shot dispersion uses WeaponAccuracy (MOA) × Weapon.AccuracyMultiplier.
// The current cooked-data attachment effect inventory contains no modifiers
// of Weapon.AccuracyMultiplier. Recoil/SpreadMultiplier change other properties.
// Only an explicitly sourced accuracyMultiplier field can change this calculation.
function moaForBuild(w,installed){
 const base=BASE[w.n]?.moa;
 if(!Number.isFinite(base)||base<=0)return {base:null,total:null,changePct:null};
 const accuracyScale=installed.reduce((factor,part)=>{
  const multiplier=part.accuracyMultiplier;
  return factor*(Number.isFinite(multiplier)&&multiplier>0?multiplier:1);
 },1);
 return {base,total:base*accuracyScale,changePct:(accuracyScale-1)*100};
}
const fmtMoa=n=>n==null?"—":n.toFixed(2)+" MOA";
function summary(){const w=weapon(),p=chosen(),mods={v:0,h:0,s:0,ads:0};for(const t of p)for(const k in mods)mods[k]+=t.mods[k]||0;const baseWeight=BASE[w.n]?.weight??WEIGHTS[w.n];return {cost:w.p+p.reduce((n,t)=>n+t.price,0),weight:baseWeight==null||p.some(t=>t.kg==null)?null:baseWeight+p.reduce((n,t)=>n+t.kg,0),mods,p,w};}
function render(){
 const {cost,weight,mods,p,w}=summary();
 const incomplete=p.some(t=>!t.mods||!Object.keys(t.mods).length);
 const base=BASE[w.n]||{};
 const moa=moaForBuild(w,p);
 const showRange=base.range==null?'Not listed':base.range.toLocaleString('en-US')+' m';
 const showMoa=base.moa==null?'—':base.moa+' MOA';
 const baseValues=[
  ['Damage',w.c==='Shotgun'?w.d+' / pellet':String(w.d)],
  ['Fire rate',w.r==null?'Not listed':w.r.toLocaleString('en-US')+' RPM'],
  ['Base accuracy',showMoa],
  ['Effective range',showRange],
  ['Weight',base.weight==null?'Not listed':base.weight.toFixed(2).replace(/0+$/,'').replace(/\.$/,'')+' kg'],
  ['ADS time',ADS_BASE[w.n]==null?'Not extracted':ADS_BASE[w.n].toFixed(3)+' s'],
  ['Caliber',base.caliber||w.cal||'Not listed'],
  ['Fire modes',base.modes||'Not listed']
 ];
 el('wbBase').innerHTML='<div class="wbBaseHead"><h3>Base weapon stats</h3><a href="https://wardo.gs/weapons/" target="_blank" rel="noopener noreferrer">Game-file source ↗</a></div>'+
  '<div class="wbBaseGrid">'+baseValues.map(([label,value])=>'<div class="wbBaseItem"><small>'+safe(label)+'</small><b>'+safe(value)+'</b></div>').join('')+'</div>'+
  '<div class="wbBaseNote">Unmodified values · CL-516586. Lower MOA means tighter underlying per-shot mechanical accuracy in any fire mode (not recoil or shotgun pellet-cone spread). Range is the published effective range, not a hard damage cutoff. ADS is shown only when individually checked.'+(w.c==='Bow'?' Extracted 0 MOA for bow is not a verified arrow grouping.':'')+'</div>';
 el("wbMOA").innerHTML='<div class="wbMOAHeader"><strong>Build accuracy (MOA)</strong><span>Lower = tighter</span></div>'+
  '<div class="wbMOAGrid">'+
   '<div><small>Base MOA</small><strong>'+fmtMoa(moa.base)+'</strong></div>'+
   '<div><small>With attachments</small><strong class="wbMOATotal">'+fmtMoa(moa.total)+'</strong></div>'+
   '<div><small>MOA change</small><strong>'+(moa.changePct==null?'—':(Math.abs(moa.changePct)<1e-9?'0%':pct(Number(moa.changePct.toFixed(2)))))+'</strong></div>'+
  '</div><p>'+ (moa.total==null?'No verified positive base MOA for this weapon. The value is deliberately not calculated.':
   'Current extracted attachment effects do not modify the game’s mechanical-accuracy multiplier. Recoil, general spread and shotgun pellet pattern are separate; this is not a measured full-auto grouping.')+
  ' <a href="https://github.com/Kiyogitpy/wardogs-data-docs/blob/main/pipelines/Wardogs_WeaponSpread_v1.md" target="_blank" rel="noopener noreferrer">How MOA works ↗</a></p>';
 el("wbAmmo").innerHTML=ammoFor(w).map(a=>'<option value="'+a+'">'+({FMJ:"Standard FMJ",AP:"Armor Piercing",HP:"Hollow Point",Buckshot:"12g Buckshot",Slug:"12g Rifled Slug",STD:"Broadhead Arrow"}[a])+'</option>').join("");el("wbAmmo").value=ST.ammo;el("wbArmor").value=String(ST.armor);
 const totalOptions=SLOTS.reduce((n,slot)=>n+options(slot).length,0);
 const pricedOptions=SLOTS.reduce((n,slot)=>n+options(slot).filter(p=>!p.listedOnly&&p.price!=null).length,0);
 el("wbCoverage").textContent=totalOptions?pricedOptions+" priced attachment options for this weapon"+(totalOptions>pricedOptions?" ("+(totalOptions-pricedOptions)+" unpriced database entries shown but disabled).":".")+" Sight compatibility comes from cooked game-file filter rules; every card displays its recorded modifiers.":"No compatible items have been independently mapped for this weapon yet.";
 // Native <details> keeps keyboard support and its open state is captured before rebuilding the cards.
 const currentDetails=el("wbSlots").querySelectorAll?.("details[data-wb-slot]")||[];
 if(!resetPanelsOnWeaponChange){
  for(const node of currentDetails)if(SLOTS.includes(node.dataset.wbSlot))EXPANDED[node.dataset.wbSlot]=node.open;
 }
 if(pendingCollapseSlot){EXPANDED[pendingCollapseSlot]=false;pendingCollapseSlot=null;}
 resetPanelsOnWeaponChange=false;
 el("wbSlots").innerHTML=SLOTS.map(slot=>{
 const available=options(slot),items=slot==="Sight"?available.filter(p=>OPTIC_BAND==="All"||opticBand(p)===OPTIC_BAND):available,current=ST.parts[slot]||"";
 const labels=[["v","Vertical"],["h","Horizontal"],["s","Spread"],["ads","ADS"]];
 const stock='<button type="button" class="wbStock '+(!current?'active':'')+'" data-part="" data-slot="'+slot+'" aria-pressed="'+(!current)+'">✓ None / Stock</button>';
 const entries=items.map(t=>{
   const active=t.id===current&& !t.listedOnly;
   const chips=labels.map(([key,title])=>{
     const n=t.mods[key],mark=n===undefined?'—':pct(n),cls=n===undefined?'':n<0?'wbGood':n>0?'wbBad':'';
     return '<span class="wbMod"><span>'+title+'</span><b class="'+cls+'">'+mark+'</b></span>';
   }).join('');
   const isUnpriced=t.listedOnly||t.price==null;
   const url=t.ref?'https://wardo.gs/items/'+encodeURIComponent(t.ref)+'/':'https://wardo.gs/attachments/';
   const meta=[t.kg==null?null:t.kg.toFixed(2)+' kg',t.cap?t.cap+' rounds':null,t.zoom?t.zoom+'× zoom':null,t.note||null].filter(Boolean).join(' · ');
   return '<div class="wbOptionWrap '+(active?'active':'')+(isUnpriced?' wbUnpriced':'')+'"><button type="button" class="wbOption" data-slot="'+slot+'" data-part="'+safe(t.id)+'" '+(isUnpriced?'disabled':'')+' aria-pressed="'+active+'" aria-label="'+safe(isUnpriced?'Unpriced game data '+t.n:'Equip '+t.n)+'">'+
    '<span class="wbOptionTitle"><span class="wbOptionName">'+(active?'✓ ':'')+safe(t.n)+'</span><span class="wbOptionPrice">'+(isUnpriced?'Unpriced':usd(t.price))+'</span></span>'+
    '<span class="wbOptionMeta">'+safe(meta)+'</span><span class="wbModGrid">'+chips+'</span></button>'+
    '<div class="wbOptionSource"><a target="_blank" rel="noopener noreferrer" href="'+safe(url)+'">Source record ↗</a></div></div>';
 }).join('');
 const sightTabs=slot!=="Sight"?"":'<div class="wbSightTabs" aria-label="Optic magnification filters">'+["All","Short","Medium","Long"].map(cat=>
 '<button type="button" data-optic-band="'+cat+'" class="wbSightTab '+(OPTIC_BAND===cat?'active':'')+'" aria-pressed="'+(OPTIC_BAND===cat)+'">'+cat+'</button>').join("")+'</div>';
 return '<details class="wbSlot wbCollapsible" data-wb-slot="'+slot+'" '+(EXPANDED[slot]?'open':'')+'><summary><span>'+slot+'</span><span class="wbSlotCount">'+(slot==="Sight"?items.length+"/"+available.length:items.length)+' mapped option'+(available.length===1?'':'s')+'</span></summary>'+
  '<div class="wbSlotContent">'+sightTabs+(items.length?'<p class="wbSlotLegend">Negative recoil/spread/ADS = improvement. Dash = no recorded modifier. Unpriced source-only records cannot be equipped.</p>'+stock+
  '<div class="wbOptionGrid">'+entries+'</div>':'<p class="wbMuted">No options in this category for this weapon. Select All to restore the full list.</p>')+'</div></details>';
 }).join("");
 el("wbCost").textContent=usd(cost);
 el("wbCostSub").textContent="Weapon "+usd(w.p)+" + "+usd(cost-w.p)+" attachments. Excludes unlocks, ammo and gear.";
 const b=source.calc(w,ST.ammo,ST.armor);const bb=b.ttk==null?"Unavailable":(b.evidence==="model"?"~":"")+b.ttk.toFixed(2)+"s";const evidence=b.evidence==="source"?"Source model":b.evidence==="model"?"Experimental model":"Unavailable";
 el("wbBallistics").innerHTML="<b>Ballistic reference:</b> "+safe(ST.ammo)+" vs "+(ST.armor?"Level "+ST.armor:"no")+" armor · <strong>"+safe(bb)+"</strong> TTK · "+(b.stk??"—")+" STK · "+evidence+"<br><small>Base weapon at 50 m, upper chest, 100 HP. Attachments do not change this result in our model; accuracy and missed shots are not simulated.</small>";
 const cap=p.find(t=>t.slot==="Magazine")?.cap;
 el("wbTiles").innerHTML='<div class="wbTile"><b>'+p.length+'</b><small>Equipped attachments</small></div><div class="wbTile"><b>'+(weight===null?'—':weight.toFixed(2)+" kg")+'</b><small>Total weapon + parts</small></div><div class="wbTile"><b>'+(cap||"—")+'</b><small>Chosen mag capacity</small></div>';
 el("wbStats").innerHTML=[["v","Vertical recoil"],["h","Horizontal recoil"],["s","Spread"],["ads","ADS time"]].map(([k,label])=>{
   const n=mods[k],ncss=n<0?"wbGood":n>0?"wbBad":"";
   return '<div class="wbStat"><div class="wbLine"><span>'+label+'</span><strong class="'+ncss+'">'+pct(n)+'</strong></div><div class="wbTrack"><div class="wbFill" style="width:'+Math.min(100,Math.max(0,50-n))+'%"></div></div></div>';
 }).join("");
 el("wbSummary").innerHTML=(incomplete?'<p style="color:#f6c06b"><b>Partial stat preview:</b> at least one attachment lacks extracted handling modifiers, so combined values may be incomplete.</p>':"")+(p.length?'<b>Selected parts</b><ul>'+p.map(t=>'<li>'+safe(t.slot)+': '+safe(t.n)+'</li>').join('')+'</ul>':'No attachments selected.');
 if(ADS_BASE[w.n])el("wbSummary").innerHTML+='<p>Reference base ADS: '+ADS_BASE[w.n].toFixed(3)+'s. Estimated percentages above must not be treated as a verified final ADS time.</p>';
 sync();
}
function copy(s){const ok=()=>{const toast=el("toast");if(toast){toast.textContent="Copied to clipboard";toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),2400);}};if(navigator.clipboard?.writeText)navigator.clipboard.writeText(s).then(ok).catch(()=>window.prompt("Copy:",s));else window.prompt("Copy:",s);}
el("wbGun").addEventListener("change",e=>{
 ST.gun=e.target.value;
 OPTIC_BAND="All";
 ST.ammo=ammoFor(weapon())[0];
 for(const slot of SLOTS)ST.parts[slot]="";
 // Different weapons have different attachment sets. Show sights and any single
 // purpose-built underbarrel (e.g. M14 Bipod) rather than inheriting a collapsed
 // state from the previous weapon. Preserve toggles within the same weapon.
 EXPANDED.Sight=true;
 EXPANDED.Muzzle=false;
 EXPANDED.Underbarrel=hasSingleUnderbarrel(ST.gun);
 EXPANDED.Magazine=false;
 resetPanelsOnWeaponChange=true;
 render();
});
el("wbSlots").addEventListener("click",e=>{
 const band=e.target.closest('button[data-optic-band]');
 if(band){OPTIC_BAND=band.dataset.opticBand;render();return;}
 const button=e.target.closest('button[data-part]');
 if(!button)return;
 const slot=button.dataset.slot,id=button.dataset.part,p=MAP[id];
 if(SLOTS.includes(slot)){if(p?.listedOnly)return;ST.parts[slot]=p&&p.slot===slot&&p.fit.includes(ST.gun)?id:"";pendingCollapseSlot=slot;render();}
});
el("wbAmmo").addEventListener("change",e=>{ST.ammo=e.target.value;render();});
el("wbArmor").addEventListener("change",e=>{ST.armor=Number(e.target.value);render();});
el("wbClear").addEventListener("click",()=>{for(const s of SLOTS)ST.parts[s]="";render();});
el("wbShare").addEventListener("click",()=>copy(url()));
el("wbCopy").addEventListener("click",()=>{const v=summary();copy([v.w.n+" · WARDOGS TTK Lab","Base MOA: "+fmtMoa(moaForBuild(v.w,v.p).base),"Build MOA: "+fmtMoa(moaForBuild(v.w,v.p).total),"Ammo: "+ST.ammo,"Armor: L"+ST.armor,"Weapon: "+usd(v.w.p),...v.p.map(t=>t.slot+": "+t.n+" ("+usd(t.price)+")"),"Total: "+usd(v.cost),"Attachment stacking: unverified estimate",url()].join("\n"));});
window.WARDOGS_BUILDER_TEST={parts:P,moaForBuild,compatible:(n,slot)=>P.filter(p=>p.slot===slot&&p.fit.includes(n)),summarize:summary,select:(gun,slot,id)=>{ST.gun=gun;const p=MAP[id];ST.parts[slot]=p&&!p.listedOnly&&p.fit.includes(gun)?id:'';render();return ST.parts[slot];}};
render();
})();