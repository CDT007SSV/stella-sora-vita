/* Ilustraciones animadas (Live2D) en la ficha del personaje.
   Los modelos vienen de la galería comunitaria srpg-kr/l2d-assets; el motor se descarga solo al tocar "Cargar". */
(function(){
const RUTA="Resources/StellarSora/assets/assetbundles/actor2d/";
const FUENTES=["https://srpg-kr.github.io/l2d-assets/"+RUTA,"https://cdn.jsdelivr.net/gh/srpg-kr/l2d-assets@main/"+RUTA];
const LIBS=["https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js","https://cdn.jsdelivr.net/npm/pixi.js@6.5.10/dist/browser/pixi.min.js","https://cdn.jsdelivr.net/npm/pixi-live2d-display@0.4.0/dist/cubism4.min.js"];
const VISOR="https://srpg-kr.github.io/live2d/stellarsora/";
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const activo=()=>{try{return localStorage.getItem("ssv_l2d")!=="0"}catch(e){return true}};
window.l2dActivo=activo;
let IDX=null;const indice=()=>IDX||(IDX=fetch("l2d.json").then(r=>r.ok?r.json():{}).catch(()=>({})));
const cargaJs=u=>new Promise((ok,ko)=>{const s=document.createElement("script");s.src=u;s.onload=ok;s.onerror=()=>ko(new Error("No se pudo cargar "+u));document.head.appendChild(s)});
let LP=null;const libs=()=>LP||(LP=(async()=>{for(const u of LIBS)await cargaJs(u)})().catch(e=>{LP=null;throw e}));
const st=document.createElement("style");
st.textContent=".l2d-card .nota{margin:4px 0 10px}#l2d-stage{position:relative;width:100%;height:440px;border-radius:16px;margin-top:10px;overflow:hidden;background:radial-gradient(circle at 50% 35%,rgba(123,108,255,.25),rgba(10,10,18,.2) 70%);border:1px solid rgba(123,108,255,.3)}#l2d-stage canvas{width:100%;height:100%;display:block}.l2d-card .l2d-btn2{margin-top:6px}#l2d-stage canvas{touch-action:none}#l2d-stage.fs{position:fixed;inset:0;z-index:9000;height:100%;border-radius:0;border:0;background:#0b0a16}.l2d-tb{position:absolute;right:8px;top:8px;display:flex;gap:6px;z-index:2}.l2d-tb button{width:38px;height:38px;border-radius:50%;border:1px solid rgba(255,255,255,.25);background:rgba(15,12,35,.75);color:#fff;font-size:1.05rem;font-weight:700;cursor:pointer}";
document.head.appendChild(st);
let app=null,mdl=null,tok=0,Z=1,PX=0,PY=0,BK=1;
function ajusta(){
  if(!app||!mdl)return;const w=app.screen.width,h=app.screen.height;
  BK=Math.min(w/mdl.internalModel.width,h/mdl.internalModel.height)*.95;
  mdl.scale.set(BK*Z);mdl.position.set(w/2+PX,h/2+PY);
}
function zoom(f){Z=Math.max(1,Math.min(5,Z*f));if(Z===1){PX=0;PY=0}ajusta()}
function gestos(stg){
  const cv=stg.querySelector("canvas"),P=new Map();let d0=0;
  cv.addEventListener("wheel",e=>{e.preventDefault();zoom(e.deltaY<0?1.12:1/1.12)},{passive:false});
  cv.addEventListener("pointerdown",e=>{P.set(e.pointerId,[e.clientX,e.clientY]);if(P.size===2){const a=[...P.values()];d0=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1])}});
  cv.addEventListener("pointermove",e=>{
    if(!P.has(e.pointerId))return;const o=P.get(e.pointerId);
    if(P.size===2){P.set(e.pointerId,[e.clientX,e.clientY]);const a=[...P.values()],d=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1]);if(d0)zoom(d/d0);d0=d}
    else if(P.size===1&&Z>1){PX+=e.clientX-o[0];PY+=e.clientY-o[1];P.set(e.pointerId,[e.clientX,e.clientY]);ajusta()}
  });
  const fin=e=>{P.delete(e.pointerId);d0=0};cv.addEventListener("pointerup",fin);cv.addEventListener("pointercancel",fin);cv.addEventListener("pointerleave",fin);
  cv.addEventListener("dblclick",()=>{Z=1;PX=0;PY=0;ajusta()});
}
function pantalla(stg,btn){
  const fs=stg.classList.toggle("fs");btn.textContent=fs?"✕":"⛶";btn.setAttribute("aria-label",fs?"Cerrar pantalla completa":"Pantalla completa");
  document.body.style.overflow=fs?"hidden":"";
  setTimeout(()=>{try{app.resize()}catch(e){}Z=1;PX=0;PY=0;ajusta()},60);
}
function limpia(){try{if(mdl){mdl.destroy();mdl=null}}catch(e){}}
function cierra(){document.body.style.overflow="";limpia();try{if(app){app.destroy(true,{children:true});app=null}}catch(e){}}
async function pon(p,msg){
  const my=++tok,stg=document.getElementById("l2d-stage");if(!stg)return;
  msg("Cargando modelo…");
  const L=PIXI.live2d.Live2DModel;let m=null,err=null;
  for(const f of FUENTES){try{m=await L.from(f+p+".model3.json");break}catch(e){err=e}}
  if(my!==tok||!document.getElementById("l2d-stage")){try{m&&m.destroy()}catch(e){}return}
  if(!m){msg("No se pudo cargar este modelo. Puedes verlo en la galería externa.");return}
  limpia();mdl=m;app.stage.addChild(m);
  const w=app.renderer.width/app.renderer.resolution,h=app.renderer.height/app.renderer.resolution;
  m.anchor.set(.5,.5);Z=1;PX=0;PY=0;ajusta();
  msg("Pellizca o usa ＋/－ para acercar, arrastra para mover. Doble toque: restablecer.");
}
async function inicia(el,lista){
  const msg=t=>{const x=el.querySelector("#l2d-st");if(x)x.textContent=t};
  const go=el.querySelector("#l2d-go");go.disabled=true;msg("Descargando el reproductor…");
  try{await libs()}catch(e){go.disabled=false;msg("No se pudo cargar el reproductor (revisa tu conexión).");return}
  go.hidden=true;const stg=el.querySelector("#l2d-stage");stg.hidden=false;
  if(!stg.querySelector(".l2d-tb")){stg.insertAdjacentHTML("beforeend",'<div class="l2d-tb"><button type="button" data-z="in" aria-label="Acercar">＋</button><button type="button" data-z="out" aria-label="Alejar">－</button><button type="button" data-z="fs" aria-label="Pantalla completa">⛶</button></div>');
    stg.querySelector('[data-z="in"]').onclick=()=>zoom(1.35);stg.querySelector('[data-z="out"]').onclick=()=>zoom(1/1.35);
    const fb=stg.querySelector('[data-z="fs"]');fb.onclick=()=>pantalla(stg,fb);gestos(stg)}
  cierra();
  try{
    PIXI.live2d.Live2DModel.registerTicker(PIXI.Ticker);
    app=new PIXI.Application({view:stg.querySelector("canvas"),backgroundAlpha:0,resizeTo:stg,antialias:true,autoDensity:true,resolution:Math.min(window.devicePixelRatio||1,2)});
  }catch(e){msg("Tu navegador no pudo iniciar el reproductor.");go.hidden=false;go.disabled=false;stg.hidden=true;return}
  const bar=el.querySelector("#l2d-bar"),on=bar.querySelector(".chip.on")||bar.querySelector(".chip");
  pon(on.dataset.p,msg);
}
window.l2dInit=async function(c){
  cierra();tok++;
  const el=document.getElementById("l2d-box");if(!el||!activo())return;
  const I=await indice(),lista=I&&I[c.name];if(!lista||!lista.length||!document.getElementById("l2d-box"))return;
  el.innerHTML=`<div class="card l2d-card"><h3 style="margin:0 0 6px;font-size:1rem">✨ Ilustración animada (L2D)</h3><p class="nota">Versión animada de ${esc(c.name)}. Se descarga solo cuando la abres (unos MB). Puedes apagarla en Ajustes.</p><div class="skin3d" id="l2d-bar">${lista.map((v,i)=>`<button type="button" class="chip${i?"":" on"}" data-p="${esc(v.p)}">${esc(v.n)}</button>`).join("")}</div><button type="button" class="btn l2d-btn2" id="l2d-go">▶ Cargar L2D</button><div id="l2d-stage" hidden><canvas></canvas></div><p class="nota" id="l2d-st"></p><a class="btn out" href="${VISOR}" target="_blank" rel="noopener noreferrer" style="margin-top:4px">Abrir en la galería externa</a></div>`;
  const bar=el.querySelector("#l2d-bar");
  bar.querySelectorAll(".chip").forEach(b=>b.onclick=()=>{bar.querySelectorAll(".chip").forEach(x=>x.classList.toggle("on",x===b));if(app)pon(b.dataset.p,t=>{const x=el.querySelector("#l2d-st");if(x)x.textContent=t})});
  el.querySelector("#l2d-go").onclick=()=>inicia(el,lista);
};
})();
