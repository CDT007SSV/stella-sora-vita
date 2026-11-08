/* Ranking de equipos por daño. Datos: hoja "Stella Sora Team Rankings" de ZiLenTz, en ranking.json. */
(function(){
const EC={Aqua:"#1e90d6",Ignis:"#e5533d",Lux:"#e0a82a",Terra:"#a9783a",Umbra:"#8b5cf6",Ventus:"#2fb585"};
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const norm=s=>String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
const RN={DPS:"DPS","Sub-DPS":"Sub-DPS",Support:"Apoyo"};
let D=null,fe="",q="",cp=0,open=null;
(function css(){const s=document.createElement("style");s.textContent=`
#rk-root .rk-h{padding:14px;border-radius:16px;border:1px solid #3a3560;background:linear-gradient(135deg,rgba(123,108,255,.2),rgba(92,225,230,.08));margin-bottom:10px}
#rk-root .rk-h h3{margin:0 0 4px}#rk-root .rk-h p{margin:4px 0;font-size:.82rem;color:#cfc8ff;line-height:1.4}
#rk-root .rk-cr{font-size:.76rem;color:#b9b3e8}#rk-root .rk-cr a{color:#9d93ff}
#rk-root details{margin-top:6px;font-size:.78rem;color:#b9b3e8}#rk-root details summary{cursor:pointer;color:#cfc8ff}
#rk-root .rk-f{display:flex;gap:6px;overflow-x:auto;padding:2px 0 8px;scrollbar-width:none}#rk-root .rk-f::-webkit-scrollbar{display:none}
#rk-root .rk-c{--tc:#7B6CFF;border:1px solid #2c2850;border-left:4px solid var(--tc);border-radius:14px;background:rgba(20,16,50,.7);padding:10px 12px;margin-bottom:8px}
#rk-root .rk-t{display:flex;align-items:center;gap:8px}#rk-root .rk-n{flex:none;width:26px;height:26px;border-radius:8px;background:rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:800;color:#ffd76a}
#rk-root .rk-t b{font-size:.92rem;line-height:1.25;flex:1;min-width:0}
#rk-root .rk-p{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:8px 0}
#rk-root .rk-m{text-align:center;font-size:.72rem;color:#cfc8ff;min-width:0}
#rk-root .rk-m .av{display:block;width:100%;aspect-ratio:1;max-width:64px;margin:0 auto 3px;border-radius:12px;border:2px solid var(--mc,#3a3560);background:#15122a;object-fit:cover;object-position:top}
#rk-root .rk-m .av.x{display:flex;align-items:center;justify-content:center;font-weight:800;color:#9a95c4}
#rk-root .rk-m b{display:block;color:#fff;font-size:.74rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#rk-root .rk-m i{font-style:normal;color:#9a95c4}
#rk-root .rk-b{height:8px;border-radius:5px;background:rgba(255,255,255,.08);overflow:hidden}#rk-root .rk-b span{display:block;height:100%;background:linear-gradient(90deg,#7B6CFF,#5CE1E6)}
#rk-root .rk-d{display:flex;justify-content:space-between;font-size:.76rem;color:#b9b3e8;margin:4px 0 6px}
#rk-root .rk-a{display:flex;flex-wrap:wrap;gap:6px}
#rk-root .rk-a a,#rk-root .rk-a button{font:inherit;font-size:.76rem;padding:6px 10px;border-radius:10px;border:1px solid #3a3560;background:rgba(123,108,255,.14);color:#e9e5ff;text-decoration:none;cursor:pointer}
#rk-root .rk-a .go{background:#5b4fe0;border-color:#5b4fe0;font-weight:700}
#rk-root .rk-g{font-size:.7rem;padding:2px 7px;border-radius:8px;background:rgba(255,255,255,.08);color:#cfc8ff}`;document.head.appendChild(s)})();
function chOf(n){return typeof CHARS!=="undefined"?CHARS.find(c=>c.name===n):null}
function card(x,i){
  const col=EC[x.el]||"#7B6CFF";
  const mem=x.s.map(m=>{const c=chOf(m.n),mc=c?(EC[c.element]||"#3a3560"):"#3a3560";
    return `<div class="rk-m" style="--mc:${mc}">${c&&c.imageUrl?`<img class="av" src="${esc(c.imageUrl)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.visibility='hidden'">`:`<span class="av x">${esc(m.n[0])}</span>`}<b>${esc(m.n)}</b><i>${esc(RN[m.r]||m.r)}${m.t?" · "+esc(m.t):""}</i></div>`}).join("");
  const au=x.auto==="Yes"?"Auto ✓":x.auto==="Decent"?"Auto ~":x.auto==="No"?"Auto ✗":"";
  return `<div class="rk-c" style="--tc:${col}"><div class="rk-t"><span class="rk-n">${i+1}</span><b>${esc(x.team)}</b>${au?`<span class="rk-g">${au}</span>`:""}</div>
   <div class="rk-p">${mem}</div>
   <div class="rk-b"><span style="width:${Math.max(2,Math.round(x.pct*100))}%"></span></div>
   <div class="rk-d"><span>${(x.pct*100).toFixed(1)}% del mejor</span><span>${(x.dmg/1e9).toFixed(1)} mil M de daño</span></div>
   <div class="rk-a">${x.code?`<button class="go" data-rk="${D.equipos.indexOf(x)}">Abrir en el armador</button>`:""}${x.guide?`<a href="${esc(x.guide)}" target="_blank" rel="noopener noreferrer">▶ Guía</a>`:""}${x.src?`<a href="${esc(x.src)}" target="_blank" rel="noopener noreferrer">📊 Cálculo</a>`:""}</div></div>`;
}
function paint(){
  const r=document.getElementById("rk-root");if(!r)return;
  const els=[...new Set(D.equipos.map(x=>x.el))];
  const n=norm(q);
  const R=D.equipos.filter(x=>(!fe||x.el===fe)&&(!cp||x.code)&&(!n||norm(x.team+" "+x.s.map(m=>m.n).join(" ")).includes(n)));
  const dt=D.meta.generado?new Date(D.meta.generado).toLocaleDateString("es",{day:"numeric",month:"short"}):"";
  r.innerHTML=`<div class="rk-h"><h3>Ranking de equipos</h3><p>Los equipos con más daño en las pruebas de la comunidad. Toca “Abrir en el armador” para ver el equipo y guardarlo.</p>
   <p class="rk-cr">Datos: <b>Stella Sora Team Rankings</b> de ZiLenTz. <a href="${esc(D.meta.url)}" target="_blank" rel="noopener noreferrer">Ver la hoja original</a> · <a href="${esc(D.meta.kofi)}" target="_blank" rel="noopener noreferrer">☕ Apoyar al autor</a>${dt?` · actualizado ${dt}`:""}</p>
   <details><summary>Cómo se compararon los equipos</summary><ul>${D.meta.supuestos.map(s=>`<li>${esc(s)}</li>`).join("")}</ul><p>Tu daño real puede variar según tu cuenta, tus discos y tus emblemas.</p></details></div>
   <input class="tm-in" id="rk-q" type="search" placeholder="Buscar equipo o personaje…" value="${esc(q)}" style="margin-bottom:8px">
   <div class="rk-f"><button class="chip${fe?"":" on"}" data-e="">Todos</button>${els.map(e=>`<button class="chip${fe===e?" on":""}" data-e="${e}">${e}</button>`).join("")}<button class="chip${cp?" on":""}" data-cp="1">Con preset</button></div>
   ${R.length?R.map(x=>card(x,D.equipos.indexOf(x))).join(""):'<p class="nota">Sin resultados.</p>'}`;
  const i=r.querySelector("#rk-q");if(open){i.focus();i.setSelectionRange(q.length,q.length)}
}
window.rankShow=async function(){
  const r=document.getElementById("rk-root");if(!r)return;
  if(!r._ok){r._ok=1;
    r.addEventListener("click",async ev=>{
      const e=ev.target.closest("[data-e]");if(e){fe=e.dataset.e;open=0;paint();return}
      if(ev.target.closest("[data-cp]")){cp=cp?0:1;open=0;paint();return}
      const b=ev.target.closest("[data-rk]");if(b){const x=D.equipos[+b.dataset.rk];b.disabled=true;
        const ok=window.teamsOpen?await window.teamsOpen({code:x.code,alias:"ZiLenTz · Team Rankings",title:x.team}):false;b.disabled=false;
        if(!ok)alert("No se pudo abrir este equipo en el armador.")}
    });
    r.addEventListener("input",ev=>{if(ev.target.id==="rk-q"){q=ev.target.value;open=1;paint()}});
  }
  if(!D){r.innerHTML='<p class="nota">Cargando…</p>';
    try{const x=await fetch("ranking.json",{cache:"no-cache"});D=await x.json()}catch(e){r.innerHTML='<p class="nota">No se pudo cargar el ranking. Revisa tu conexión.</p>';return}}
  open=0;paint();
};
})();
