/* Ficha ampliada de personaje: Habilidades, Potenciales, Afinidad y Stats.
   Lee fichas/<id>.json (generado desde la wiki + traducción). Si el personaje no tiene ficha, no muestra nada. */
(function(){
const FILE="https://stellasora.miraheze.org/wiki/Special:FilePath/";
const e=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const TIPO={auto:"Ataque normal",main:"Habilidad principal",support:"Habilidad de apoyo",ultimate:"Definitiva"};
const CACHE={};
function tpl(s,vals,tier,tn){
  return e(s).replace(/⟦(\d+)⟧/g,(m,i)=>'<b class="fn">'+e(vals&&vals[i]!=null?(Array.isArray(vals[i])?vals[i][Math.min(tn||0,vals[i].length-1)]:vals[i]):"?")+"</b>")
    .replace(/⟪(\d+)⟫/g,(m,i)=>{const t=(tier||[])[i]||[];return '<b class="fn tier" title="Depende del Tier del personaje">'+e(t[0])+'–'+e(t[t.length-1])+'</b>'})
    .replace(/⟨([^⟩]*)⟩/g,'<i class="fk">$1</i>').replace(/\n/g,"<br>");
}
function skill(h,i){
  const max=Math.max(...h.tpl.flatMap(g=>g.l));
  return `<div class="fk-card" data-i="${i}"><div class="fk-top"><span class="fk-t">${TIPO[h.tipo]||e(h.tipo)}</span>${h.cd?`<span class="fk-cd">CD ${e(h.cd)} s</span>`:""}</div>
    <h4>${e(h.n)}</h4>${h.ne!==h.n?`<div class="fk-en">${e(h.ne)}</div>`:""}<p class="fk-b">${tpl(h.b)}</p>
    <div class="fk-lv"><button class="fk-st" data-d="-1" aria-label="Bajar nivel">−</button><span>Nivel <b class="fk-n">1</b> / ${max}</span><button class="fk-st" data-d="1" aria-label="Subir nivel">+</button></div>
    <div class="fk-d"></div><div class="fk-m"></div></div>`;
}
function pintaSkill(card,h,l){
  const g=h.tpl.find(g=>g.l.includes(l))||h.tpl[0];
  card.querySelector(".fk-n").textContent=l;
  card.querySelector(".fk-d").innerHTML=tpl(g.s,h.v[l-1],h.tier);
  const m=h.mats[l-1]||[];
  card.querySelector(".fk-m").innerHTML=m.length?`<div class="fk-mh">Para subir al nivel ${l+1}</div><div class="fk-mi">${m.map(x=>`<span>${e(x.n)} <b>×${x.q.toLocaleString("es-MX")}</b></span>`).join("")}</div>`:(l>=Math.max(...h.tpl.flatMap(g=>g.l))?'<div class="fk-mh">Nivel máximo</div>':'');
}
function pot(p,det){
  const lv=p.v.some(a=>a.length>1);
  return `<div class="fk-pot" data-t="${p.t}">${p.ic?`<img src="${FILE}${encodeURIComponent(p.ic)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">`:""}
    <div><h5>${e(p.n)}</h5>${p.ne!==p.n?`<div class="fk-en">${e(p.ne)}</div>`:""}<p class="fk-pb">${tpl(p.b)}</p>
    <details><summary>Detalle${lv?" y niveles":""}</summary>${lv?'<div class="fk-lv sm"><button class="fk-st" data-d="-1">−</button><span>Nivel <b class="fk-n">1</b> / 6</span><button class="fk-st" data-d="1">+</button></div>':""}<p class="fk-pd">${tpl(p.s,p.v,null,0)}</p></details></div></div>`;
}
function panelPot(F,modo,build){
  const T=F.potenciales[modo]||F.potenciales.main, bs=T.builds;
  const b=bs.find(x=>x.id===build)||bs[0], L=T.l.filter(p=>p.g===b.id);
  const nuc=L.filter(p=>p.t<3), com=L.filter(p=>p.t===3);
  return `<div class="fk-sw">${Object.keys(F.potenciales).map(k=>`<button class="chip${k===modo?" on":""}" data-m="${k}">${k==="main"?"Trekker principal":"Trekker de apoyo"}</button>`).join("")}</div>
   <div class="fk-sw">${bs.map(x=>`<button class="chip${x.id===b.id?" on":""}" data-b="${x.id}">${e(/(\d+)\s*$/.test(x.n)?"Build "+x.n.match(/(\d+)\s*$/)[1]:x.n)}</button>`).join("")}</div>
   ${b.d?`<p class="fk-bd">${e(b.d)}</p>`:""}
   ${nuc.length?`<h4 class="fk-h">Potenciales de núcleo (${nuc.length})</h4>${nuc.map(p=>pot(p)).join("")}`:""}
   ${com.length?`<h4 class="fk-h">Potenciales comunes (${com.length})</h4>${com.map(p=>pot(p)).join("")}`:""}
   <p class="nota">Los potenciales comunes se pueden mejorar hasta el nivel 6; usa el control de nivel dentro de cada uno.</p>`;
}
function panelStats(F){
  const r=F.stats&&F.stats.rows; if(!r)return "<p class='nota'>Sin datos de nivel.</p>";
  const max=r[r.length-1][0];
  return `<div class="fk-lv"><button class="fk-st" data-d="-1">−</button><span>Nivel <b class="fk-n">${max}</b> / ${max}</span><button class="fk-st" data-d="1">+</button></div>
   <input type="range" class="fk-rg" min="1" max="${max}" value="${max}"><div class="fk-sv"></div>
   <p class="nota">Valores base del personaje según los datos del juego (sin discos, potenciales ni mejoras). Al ascender (niveles 10, 20, 30…) el valor sube: aquí se muestra el valor tras ascender.</p>`;
}
function pintaStats(box,F,l){
  const rows=F.stats.rows.filter(x=>x[0]===l), x=rows[rows.length-1]||F.stats.rows[0];
  box.querySelector(".fk-n").textContent=l;
  box.querySelector(".fk-sv").innerHTML=`<div class="stats"><div class="stat"><b>${x[1].toLocaleString("es-MX")}</b><span>HP</span></div><div class="stat"><b>${x[2].toLocaleString("es-MX")}</b><span>ATK</span></div><div class="stat"><b>${F.stats.cr}%</b><span>Prob. crítica</span></div><div class="stat"><b>${F.stats.cd}%</b><span>Daño crítico</span></div></div>`;
}
function panelAfin(F){
  return `<h4 class="fk-h">Regalos favoritos</h4><div class="fk-gifts">${F.regalos.map(g=>`<div class="fk-gf"><b>${e(g.n)}</b>${g.ne!==g.n?`<span>${e(g.ne)}</span>`:""}</div>`).join("")}</div>
   <h4 class="fk-h">Tareas de afinidad</h4>${F.tareas.map(t=>`<div class="kv"><span>${e(t.t)}</span><b style="flex:0 0 auto;color:var(--a)">+${t.exp} EXP</b></div>`).join("")}`;
}
function montar(box,F){
  let tab="hab",modo="main",build=1;
  const out=box.querySelector(".fk-body");
  function pinta(){
    box.querySelectorAll(".fk-tabs .chip").forEach(c=>c.classList.toggle("on",c.dataset.t===tab));
    if(tab==="hab"){
      out.innerHTML=F.habilidades.map(skill).join("");
      out.querySelectorAll(".fk-card").forEach((c,i)=>{const h=F.habilidades[i],max=Math.max(...h.tpl.flatMap(g=>g.l));let l=1;
        pintaSkill(c,h,l);c.querySelectorAll(".fk-st").forEach(b=>b.onclick=()=>{l=Math.max(1,Math.min(max,l+(+b.dataset.d)));pintaSkill(c,h,l)})});
    }else if(tab==="pot"){
      out.innerHTML=panelPot(F,modo,build);
      out.querySelectorAll("[data-m]").forEach(b=>b.onclick=()=>{modo=b.dataset.m;build=1;pinta()});
      out.querySelectorAll("[data-b]").forEach(b=>b.onclick=()=>{build=+b.dataset.b;pinta()});
      const T=F.potenciales[modo],bb=T.builds.find(x=>x.id===build)||T.builds[0],L=T.l.filter(p=>p.g===bb.id);
      out.querySelectorAll(".fk-pot").forEach((c,i)=>{const nuc=L.filter(p=>p.t<3).concat(L.filter(p=>p.t===3)),p=nuc[i];if(!p)return;
        let l=0;const n=c.querySelector(".fk-n"),d=c.querySelector(".fk-pd");
        c.querySelectorAll(".fk-st").forEach(b=>b.onclick=ev=>{ev.preventDefault();l=Math.max(0,Math.min(5,l+(+b.dataset.d)));n.textContent=l+1;d.innerHTML=tpl(p.s,p.v,null,l)})});
    }else if(tab==="afi"){out.innerHTML=panelAfin(F)}
    else{out.innerHTML=panelStats(F);if(F.stats&&F.stats.rows){const rg=out.querySelector(".fk-rg"),pintar=l=>pintaStats(out,F,l),max=F.stats.rows[F.stats.rows.length-1][0];let l=max;pintar(l);
      rg.oninput=()=>{l=+rg.value;pintar(l)};out.querySelectorAll(".fk-st").forEach(b=>b.onclick=()=>{l=Math.max(1,Math.min(max,l+(+b.dataset.d)));rg.value=l;pintar(l)})}}
  }
  box.querySelectorAll(".fk-tabs .chip").forEach(c=>c.onclick=()=>{tab=c.dataset.t;pinta()});
  pinta();
}
window.fichaCargar=async function(c){
  const box=document.getElementById("ficha-box"); if(!box)return;
  const id=c.id;
  try{
    let F=CACHE[id]; if(F===undefined){const r=await fetch("fichas/"+id+".json");F=r.ok?await r.json():null;CACHE[id]=F}
    if(!F||!document.getElementById("ficha-box"))return;
    box.innerHTML=`<div class="fk-tabs"><button class="chip on" data-t="hab">Habilidades</button><button class="chip" data-t="pot">Potenciales</button><button class="chip" data-t="afi">Afinidad</button><button class="chip" data-t="sta">Stats</button></div><div class="fk-body"></div>`;
    montar(box,F);
    const st=document.querySelectorAll("#det .stats .stat");
    if(F.stats&&F.stats.rows&&st.length>=2){const r=F.stats.rows[F.stats.rows.length-1];
      st[0].querySelector("b").textContent=r[1].toLocaleString("es-MX");st[1].querySelector("b").textContent=r[2].toLocaleString("es-MX");
      if(F.cumple&&st[2]&&/^\s*[—-]?\s*$/.test(st[2].querySelector("b").textContent))st[2].querySelector("b").textContent=F.cumple;
      st[0].querySelector("span").textContent="HP (Nv. "+r[0]+")";st[1].querySelector("span").textContent="ATK (Nv. "+r[0]+")"}
  }catch(x){}
};
})();
