/* Cumpleaños de los Trekkers + ventana a pantalla completa reutilizable (window.ssvOverlay).
   Los cumpleaños salen de presets.json (campo "bd" = "mes-dia", generado con generar_presets.py). */
(function(){
"use strict";
const MES=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const EC={Aqua:"#1e90d6",Ignis:"#e5533d",Lux:"#e0a82a",Terra:"#a9783a",Umbra:"#8b5cf6",Ventus:"#2fb585",Neutral:"#7d8096"};
const e=t=>String(t==null?"":t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const css=document.createElement("style");css.textContent=`
.ov{position:fixed;inset:0;z-index:9000;overflow:auto;background:#0b0818;color:var(--t);padding:16px 16px 40px;-webkit-overflow-scrolling:touch}
.ov .ovh{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.ov .ovx{width:38px;height:38px;border-radius:12px;border:1px solid #3a3560;background:rgba(123,108,255,.14);color:#cfc8ff;font-size:1.1rem;cursor:pointer}
.ov .ovt{font-size:1.2rem;line-height:1.3;margin:6px 0 4px;overflow-wrap:anywhere}.ov .ovd{font-size:.78rem;color:var(--t2);margin-bottom:12px}
.ov .ovi{width:100%;border-radius:14px;margin:0 0 12px;display:block}.ov .ovp{white-space:pre-line;font-size:.92rem;line-height:1.5;margin:0 0 14px;overflow-wrap:anywhere}
.ov .btn{display:block;text-align:center;margin:0 0 10px}.ov iframe{width:100%;height:560px;border:0;border-radius:14px;background:#000;margin-bottom:10px}
.bd-ov{text-align:center;background:radial-gradient(circle at 50% 0,var(--bc,#6a55ff) -40%,#0b0818 62%)}
.bd-ov .bd-art{position:relative;margin:4px auto 6px;max-width:360px}.bd-ov .bd-art img{width:100%;display:block;border-radius:22px;box-shadow:0 12px 40px rgba(0,0,0,.55);border:2px solid rgba(255,255,255,.18)}
.bd-ov h2{font-size:1.5rem;margin:14px 0 4px}.bd-ov .bd-d{font-size:1rem;color:#ffe9a8;margin-bottom:14px}
.bd-v{margin:6px auto 14px;max-width:420px;text-align:left;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14);border-radius:16px;padding:12px 14px}
.bd-v .row{display:flex;gap:8px;margin-bottom:8px}.bd-v .row .btn{flex:1;margin:0;padding:10px}.bd-v .jp{font-size:.95rem;line-height:1.45;margin:4px 0}.bd-v .es{font-size:.9rem;color:#fff;line-height:1.45;margin:6px 0 0}.bd-v .en{font-size:.82rem;color:#cfc8ff;line-height:1.4;margin:4px 0 0;font-style:italic}
.bd-conf{position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:9001}.bd-conf i{position:absolute;top:-20px;width:8px;height:14px;opacity:.9;animation:bdf linear infinite}
@keyframes bdf{to{transform:translateY(110vh) rotate(540deg)}}
.cu-hero{position:relative;display:flex;gap:14px;align-items:center;border-radius:18px;padding:14px;margin-bottom:16px;background:linear-gradient(135deg,#6a55ff,#a24bd8);cursor:pointer;overflow:hidden}
.cu-hero img{width:92px;height:92px;border-radius:16px;object-fit:cover;border:2px solid rgba(255,255,255,.3);flex-shrink:0}
.cu-hero small{display:block;font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;opacity:.85}.cu-hero b{display:block;font-size:1.15rem;margin:2px 0}.cu-hero span{font-size:.85rem;opacity:.9}
.cu-m{font-size:.8rem;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--a);margin:18px 0 8px}.cu-m.now{color:var(--gold)}
.cu-r{display:flex;align-items:center;gap:12px;background:var(--sf);border:1px solid #2f2a52;border-radius:14px;padding:9px 11px;margin-bottom:8px;cursor:pointer}
.cu-r img{width:48px;height:48px;border-radius:12px;object-fit:cover;background:var(--s2);flex-shrink:0}.cu-r b{display:block;font-size:.92rem}.cu-r span{font-size:.78rem;color:var(--t2)}
.cu-r .cu-t{margin-left:auto;font-size:.72rem;font-weight:800;padding:3px 8px;border-radius:8px;background:rgba(123,108,255,.22);color:#cfc8ff;white-space:nowrap}.cu-r .cu-t.hoy{background:var(--gold);color:#1a1530}
.cu-btn{display:flex;align-items:center;gap:8px;width:100%;margin:0 0 10px;padding:11px 14px;border-radius:12px;border:1px solid rgba(232,196,106,.5);background:rgba(232,196,106,.1);color:#f3d98a;font-weight:700;font-size:.88rem;cursor:pointer}`;
document.head.appendChild(css);

/* ventana a pantalla completa con soporte del boton "atras" del telefono */
const OV=[];let selfB=0;
window.ssvOverlay=function(html,cls){
  const o=document.createElement("div");o.className="ov "+(cls||"");o.innerHTML=html;document.body.appendChild(o);OV.push(o);
  try{history.pushState({ov:1},"",location.href)}catch(x){}
  o.addEventListener("click",ev=>{if(ev.target.closest("[data-ovx]"))cerrar(o)});
  return o};
function cerrar(o){const i=OV.indexOf(o);if(i<0)return;OV.splice(i,1);if(o._stop)o._stop();o.remove();document.querySelectorAll(".bd-conf").forEach(x=>x.remove());selfB++;try{history.back()}catch(x){selfB--}}
window.addEventListener("popstate",()=>{if(selfB>0){selfB--;return}const o=OV.pop();if(o){if(o._stop)o._stop();o.remove();document.querySelectorAll(".bd-conf").forEach(x=>x.remove())}});

let LIST=null,VOZ={};
async function lista(){
  if(LIST)return LIST;
  let P={};try{const r=await fetch("presets.json");if(r.ok)P=await r.json()}catch(x){}
  try{const r=await fetch("cumples_voz.json");if(r.ok)VOZ=await r.json()}catch(x){}
  LIST=[];
  Object.entries(P).forEach(([gid,p])=>{if(!p.bd)return;const c=(typeof CHARS!=="undefined"?CHARS:[]).find(x=>x.name===p.n);if(!c)return;const a=p.bd.split("-").map(Number);LIST.push({c,m:a[0],d:a[1],gid})});
  return LIST}
function dias(m,d){const h=new Date(),a=new Date(h.getFullYear(),h.getMonth(),h.getDate());let t=new Date(a.getFullYear(),m-1,d);if(t<a)t=new Date(a.getFullYear()+1,m-1,d);return Math.round((t-a)/864e5)}
const fecha=(m,d)=>d+" de "+MES[m-1];
const cuando=n=>n===0?"¡Hoy!":n===1?"Mañana":"en "+n+" días";

window.cumplesHoy=async function(){const L=await lista();return L.filter(x=>dias(x.m,x.d)===0)};

function confeti(){
  const w=document.createElement("div");w.className="bd-conf";const col=["#ffd166","#ff6b9d","#5ce1e6","#9b7bff","#7ee787"];
  for(let i=0;i<46;i++){const s=document.createElement("i");s.style.left=Math.random()*100+"%";s.style.background=col[i%5];s.style.animationDuration=(3+Math.random()*3)+"s";s.style.animationDelay=(Math.random()*3)+"s";w.appendChild(s)}
  document.body.appendChild(w)}
window.cumplesOv=async function(c,m,d){
  await lista();
  const n=dias(m,d),col=EC[c.element]||"#6a55ff",it=LIST.find(x=>x.c.id===c.id),v=VOZ[c.name],gid=it&&it.gid;
  const BASE="https://stellasora.miraheze.org/wiki/Special:FilePath/";
  const fj=(v&&v.f)||(gid?"vo_"+gid+"_ui_birth_001_jp.ogg":""),fc=(v&&v.fc)||(gid?"vo_"+gid+"_ui_birth_001_cn.ogg":"");
  const cap=f=>f?BASE+encodeURIComponent(f.charAt(0).toUpperCase()+f.slice(1)):"";
  const o=window.ssvOverlay(`<div class="ovh"><span class="ntype t-cumple">Cumpleaños</span><button class="ovx" data-ovx aria-label="Cerrar">✕</button></div>
   <div class="bd-art"><img src="${e(c.imageUrl)}" alt="${e(c.name)}" referrerpolicy="no-referrer"></div>
   <h2>${n===0?"¡Feliz cumpleaños, ":""}${e(c.name)}${n===0?"!":""}</h2><div class="bd-d">🎂 ${fecha(m,d)} · ${cuando(n)}</div>
   ${fj?`<div class="bd-v"><div class="row"><button class="btn" data-play="jp">▶ Escuchar su voz (japonés)</button></div>
   ${v&&v.tj?`<div class="jp">${e(v.tj)}</div>`:""}${v&&(v.es||v.en)?`<div class="es">${e(v.es||v.en)}</div>${v.es?"":`<div class="en">(traducción al español pendiente)</div>`}`:`<div class="en">${v?"":"Subtítulos no disponibles todavía para este personaje."}</div>`}</div>`:""}
   <button class="btn" data-ficha>Ver ficha de ${e(c.name)}</button>`,"bd-ov");
  o.style.setProperty("--bc",col);if(n===0)confeti();
  let au=null;o._stop=()=>{if(au){try{au.pause()}catch(x){}au=null}};
  const play=k=>{o._stop();au=new Audio(cap(k==="cn"?fc:fj));au.play().catch(()=>{const b=o.querySelector("[data-play="+k+"]");if(b)b.textContent="No se pudo reproducir el audio"})};
  o.querySelectorAll("[data-play]").forEach(b=>b.onclick=()=>play(b.dataset.play));
  if(n===0&&fj)play("jp");
  o.querySelector("[data-ficha]").addEventListener("click",()=>{cerrar(o);setTimeout(()=>{if(window.nav)window.nav("c/"+c.id)},80)});
};

window.cumplesShow=async function(){
  const root=document.getElementById("cu-root");if(!root)return;
  root.innerHTML='<p class="nota">Cargando…</p>';
  const L=await lista();
  if(!L.length){root.innerHTML='<p class="nota">No hay datos de cumpleaños todavía.</p>';return}
  const S=L.map(x=>Object.assign({n:dias(x.m,x.d)},x)).sort((a,b)=>a.n-b.n),prox=S[0];
  const hoy=S.filter(x=>x.n===0);
  let h=`<div class="cu-hero" data-k="${e(prox.c.id)}"><img src="${e(prox.c.imageUrl)}" alt="" referrerpolicy="no-referrer"><div><small>${hoy.length?"Hoy cumple":"Próximo cumpleaños"}</small><b>${e(prox.c.name)}</b><span>${fecha(prox.m,prox.d)} · ${cuando(prox.n)}</span></div></div>`;
  const mes=new Date().getMonth()+1;
  for(let m=1;m<=12;m++){
    const A=L.filter(x=>x.m===m).sort((a,b)=>a.d-b.d);if(!A.length)continue;
    h+=`<div class="cu-m${m===mes?" now":""}">${MES[m-1]}${m===mes?" · este mes":""}</div>`+A.map(x=>{const n=dias(x.m,x.d);return `<div class="cu-r" data-k="${e(x.c.id)}"><img src="${e(x.c.imageUrl)}" alt="" loading="lazy" referrerpolicy="no-referrer"><div><b>${e(x.c.name)}</b><span>${fecha(x.m,x.d)}</span></div><span class="cu-t${n===0?" hoy":""}">${cuando(n)}</span></div>`}).join("")}
  root.innerHTML=h;
  root.onclick=ev=>{const t=ev.target.closest("[data-k]");if(!t)return;const x=L.find(y=>y.c.id===t.dataset.k);if(x)window.cumplesOv(x.c,x.m,x.d)};
};
})();
