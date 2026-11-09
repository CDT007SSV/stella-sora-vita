/* Galería de arte: las ilustraciones (CG) de las historias, dentro de la app. Datos: galeria.json (se actualiza solo). */
(function(){
const FILE="https://stellasora.miraheze.org/wiki/Special:FilePath/";
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let D=null,VW=null,lista=[],ix=0;
function urls(x,w){ /* posibles direcciones de la imagen (la wiki nombra distinto a veces); w = ancho de miniatura */
  const q=w?"?width="+w:"",n=x.n,lo=n.toLowerCase();
  if(x.k==="o")return [FILE+"Story_element_"+n+".png"+q];
  if(x.k==="d")return ["https://raw.githubusercontent.com/AutumnVN/ssassets/main/export/assets/assetbundles/icon/datingeventcg/"+n+".webp"];
  if(x.k==="u")return [x.u,...(x.f||[])].map(u=>u+(w&&/Special:FilePath/.test(u)?"?width="+w:""));
  return [...new Set([FILE+cap(n)+".png",FILE+cap(lo)+".png",FILE+cap(n)+".jpg",FILE+cap(lo)+".jpg"])].map(u=>u+q);
}
function img(x,w,cls){
  const l=urls(x,w);
  return `<img class="${cls}" loading="lazy" decoding="async" alt="" referrerpolicy="no-referrer" src="${esc(l[0])}" data-q="${esc(l.slice(1).join("|"))}" onerror="galFb(this)">`;
}
window.galFb=function(im){const q=(im.dataset.q||"").split("|").filter(Boolean);if(q.length){im.src=q.shift();im.dataset.q=q.join("|")}else if(im.classList.contains("gl-t")){im.style.display="none"}else{im.style.visibility="hidden"}};
(function css(){const s=document.createElement("style");s.textContent=`
#gal-root .gl-cat{margin:14px 2px 6px;font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;color:#9a95c4;font-weight:800}
#gal-root .gl-g{border:1px solid #2c2850;border-radius:12px;background:rgba(20,16,50,.7);margin-bottom:8px;overflow:hidden}
#gal-root .gl-h{display:flex;align-items:center;gap:10px;width:100%;padding:8px;background:none;border:0;color:#e9e5ff;font:inherit;text-align:left;cursor:pointer}
#gal-root .gl-h .gl-c{flex:none;width:64px;height:40px;border-radius:6px;object-fit:cover;background:#15122a}
#gal-root .gl-h b{flex:1;min-width:0;font-size:.86rem;line-height:1.25}#gal-root .gl-h small{color:#9a95c4;font-size:.72rem;white-space:nowrap}
#gal-root .gl-gr{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;padding:0 8px 8px}
#gal-root .gl-t{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:5px;background:#15122a;display:block;cursor:pointer}
#gal-vw{position:fixed;inset:0;z-index:100000;background:rgba(5,4,14,.96);display:none;flex-direction:column;touch-action:pan-y}
#gal-vw.on{display:flex}
#gal-vw .gv-top{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:calc(env(safe-area-inset-top,0px) + 10px) 12px 8px;color:#cfc8ff;font-size:.8rem}
#gal-vw .gv-top b{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#gal-vw button,#gal-vw a{font:inherit;font-size:.8rem;padding:6px 12px;border-radius:10px;border:1px solid #3a3560;background:rgba(123,108,255,.18);color:#e9e5ff;text-decoration:none;cursor:pointer}
#gal-vw .gv-im{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
#gal-vw .gv-im img{max-width:100%;max-height:100%;object-fit:contain}
#gal-vw .gv-nv{position:absolute;top:50%;transform:translateY(-50%);width:44px;height:64px;padding:0;font-size:1.6rem;background:rgba(10,8,30,.55)}
#gal-vw .gv-nv.p{left:6px}#gal-vw .gv-nv.n{right:6px}
#gal-vw .gv-bt{display:flex;justify-content:center;gap:8px;padding:10px 12px calc(env(safe-area-inset-bottom,0px) + 12px)}`;document.head.appendChild(s)})();
const COL=["c-pur","c-pink","c-teal","c-gold","c-lav"];
let vc="",vg=""; /* nivel 1: categorias; nivel 2: grupos de una categoria; nivel 3: imagenes de un grupo */
function portada(imgs){const l=imgs.slice(0,12).flatMap(x=>urls(x,0));return {k:"u",u:l[0],f:l.slice(1)}} /* si la primera imagen no existe, prueba con las siguientes */
function tarjeta(attr,col,im,sub,tit,w){
  return `<div class="hm hm-sub ${w?"w ":""}${col}" ${attr}>${im?img(im,420,"bg"):""}<div class="hm-sh"></div><div class="hm-cn"><i>${esc(sub)}</i><strong>${esc(tit)}</strong></div></div>`;
}
function cuerpo(){
  if(!vc){
    const cats=[...new Set(D.grupos.map(g=>g.cat))];
    return `<p class="nota" style="margin:2px 2px 10px">Ilustraciones del juego dentro de la app. Se agregan solas cuando salen historias nuevas.</p><div class="hm-subgrid">`+
      cats.map((c,i)=>{const gs=D.grupos.filter(g=>g.cat===c),n=gs.reduce((t,g)=>t+g.imgs.length,0);return tarjeta('data-c="'+esc(c)+'"',COL[i%COL.length],portada(gs.flatMap(g=>g.imgs)),n+" ilustraciones",c,i%3===0)}).join("")+`</div>`;
  }
  if(!vg){
    const gs=D.grupos.filter(g=>g.cat===vc);
    return (vc==="Recuerdos de cita"?`<p class="nota" style="margin:0 0 10px">✨ Las escenas animadas (Live2D) de las historias de afinidad, como las del acto 4, no están en los archivos del juego y no se pueden mostrar aquí. Si se encuentran, se agregarán.</p>`:"")+`<div class="hm-subgrid">`+gs.map((g,i)=>tarjeta('data-g="'+esc(g.id)+'"',COL[i%COL.length],portada(g.imgs),g.imgs.length+" ilustraciones",g.titulo,0)).join("")+`</div>`;
  }
  const g=D.grupos.find(z=>z.id===vg);
  return `<h3 style="margin:2px 2px 10px">${esc(g.titulo)}</h3><div class="gl-gr" style="padding:0">${g.imgs.map((x,i)=>img(x,360,"gl-t").replace("<img ",`<img data-i="${i}" `)).join("")}</div>`;
}
function titulo(){const t=document.querySelector("#s-galeria .topbar h2");if(t)t.textContent=vg?"Ilustraciones":vc||"Galería de arte"}
function pinta(){const r=document.getElementById("gal-root");if(r){r.innerHTML=cuerpo();titulo();window.scrollTo(0,0);const m=r.closest("main");if(m)m.scrollTop=0}}
function visor(){
  if(VW)return VW;
  VW=document.createElement("div");VW.id="gal-vw";
  VW.innerHTML=`<div class="gv-top"><b></b><span class="gv-c"></span><button data-x>✕</button></div><div class="gv-im"><button class="gv-nv p" data-d="-1">‹</button><img alt="" referrerpolicy="no-referrer"><button class="gv-nv n" data-d="1">›</button></div><div class="gv-bt"><a data-o target="_blank" rel="noopener noreferrer">Abrir original</a></div>`;
  document.body.appendChild(VW);
  VW.addEventListener("click",e=>{if(e.target.closest("[data-x]")){cierra();return}const d=e.target.closest("[data-d]");if(d)ve(ix+ +d.dataset.d)});
  let x0=null;VW.addEventListener("touchstart",e=>{x0=e.touches[0].clientX},{passive:true});
  VW.addEventListener("touchend",e=>{if(x0==null)return;const dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>60)ve(ix+(dx<0?1:-1))},{passive:true});
  return VW;
}
function ve(i){
  if(i<0||i>=lista.length)return;ix=i;const x=lista[i],l=urls(x,0),w=visor(),im=w.querySelector(".gv-im img");
  im.style.visibility="";im.dataset.q=l.slice(1).join("|");im.onerror=()=>galFb(im);im.src=l[0];
  w.querySelector(".gv-top b").textContent=x.titulo;w.querySelector(".gv-c").textContent=(i+1)+" / "+lista.length;
  w.querySelector("[data-o]").href=l[0];
  w.querySelector(".gv-nv.p").style.display=i?"":"none";w.querySelector(".gv-nv.n").style.display=i<lista.length-1?"":"none";
  [lista[i+1],lista[i-1]].forEach(y=>{if(y){const p=new Image();p.referrerPolicy="no-referrer";p.src=urls(y,0)[0]}});
}
function cierra(){if(VW)VW.classList.remove("on")}
window.galShow=async function(){
  const r=document.getElementById("gal-root");if(!r)return;
  if(!r._ok){r._ok=1;
    r.addEventListener("click",e=>{
      const t=e.target.closest(".gl-t");
      if(t){const g=D.grupos.find(z=>z.id===vg);if(!g)return;lista=g.imgs.map(x=>Object.assign({titulo:g.titulo},x));visor().classList.add("on");ve(+t.dataset.i);return}
      const g=e.target.closest("[data-g]");if(g){vg=g.dataset.g;pinta();return}
      const c=e.target.closest("[data-c]");if(c){vc=c.dataset.c;pinta()}
    });
    const tb=document.querySelector("#s-galeria [data-back]");
    if(tb&&!tb._gl){tb._gl=1;tb.addEventListener("click",ev=>{if(vg||vc){ev.stopPropagation();ev.preventDefault();if(vg)vg="";else vc="";pinta()}},true)}
    window.addEventListener("hashchange",cierra);
  }
  if(!D){r.innerHTML='<p class="nota">Cargando…</p>';
    try{const x=await fetch("galeria.json",{cache:"no-cache"});D=await x.json()}catch(e){r.innerHTML='<p class="nota">No se pudo cargar la galería. Revisa tu conexión.</p>';return}}
  vc="";vg="";pinta();
};
})();
