/* Armador de equipos: 3 personajes (potenciales con nivel) + 6 discos. Se guarda en el telefono (localStorage), con exportar/importar y codigo para compartir. */
(function(){
const KEY="ssv_teams";
const e=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const norm=t=>String(t||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
function load(){try{const j=JSON.parse(localStorage.getItem(KEY)||"null");if(j&&Array.isArray(j.teams))return j}catch(x){}return{v:1,teams:[]}}
let ST=load();
function save(){try{localStorage.setItem(KEY,JSON.stringify(ST));return true}catch(x){return false}}
const FC={},DC={};let IDX=null;
async function getF(id){if(FC[id]!==undefined)return FC[id];try{const r=await fetch("fichas/"+id+".json");FC[id]=r.ok?await r.json():null}catch(x){FC[id]=null}return FC[id]}
async function getIdx(){if(IDX)return IDX;try{const r=await fetch("discos/indice.json");IDX=r.ok?await r.json():{ids:{},notas:{}}}catch(x){IDX={ids:{},notas:{}}}return IDX}
async function getD(name){const I=await getIdx(),id=I.ids[name];if(!id)return null;if(DC[id]!==undefined)return DC[id];try{const r=await fetch("discos/"+id+".json");DC[id]=r.ok?await r.json():null}catch(x){DC[id]=null}return DC[id]}
function tpl(s,vals,tn){return e(s).replace(/⟦(\d+)⟧/g,(m,i)=>'<b class="fn">'+e(vals&&vals[i]!=null?(Array.isArray(vals[i])?vals[i][Math.min(tn||0,vals[i].length-1)]:vals[i]):"?")+"</b>").replace(/⟪(\d+)⟫/g,"<b class=\"fn\">?</b>").replace(/⟨([^⟩]*)⟩/g,'<i class="fk">$1</i>').replace(/\n/g,"<br>")}
const chars=()=>typeof CHARS!=="undefined"?CHARS:[],discs=()=>typeof DISCS!=="undefined"?DISCS:[];
const charOf=id=>chars().find(c=>c.id===id);
const ROLE=["Trekker principal","Trekker de apoyo 1","Trekker de apoyo 2"];
const nuevo=()=>({id:uid(),name:"",slots:[{c:"",p:{}},{c:"",p:{}},{c:"",p:{}}],discs:[null,null,null,null,null,null],note:"",score:""});
let root,T=null,mode="list";
const POT=[{},{},{}];

(function css(){const s=document.createElement("style");s.textContent=`
.tm-card{background:var(--sf);border:1px solid #2a2740;border-radius:12px;padding:12px;margin-bottom:10px;cursor:pointer}
.tm-card h4{margin:0 0 6px;font-size:1rem}.tm-th{display:flex;gap:6px;align-items:center}.tm-th img{width:44px;height:44px;border-radius:50%;object-fit:cover;object-position:top;background:#221E3A;border:1px solid #3D3A55}
.tm-io{display:flex;gap:8px}.tm-io .btn{margin-top:10px}
.tm-in{width:100%;box-sizing:border-box;padding:10px 12px;border-radius:10px;border:1px solid #3D3A55;background:var(--sf);color:var(--t);font-size:1rem;margin-bottom:8px;outline:none}
.tm-sl{background:var(--sf);border:1px solid #2a2740;border-radius:12px;padding:12px;margin-bottom:12px}
.tm-sh{font-size:.66rem;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--a);margin-bottom:6px}
.tm-pick{display:flex;align-items:center;gap:10px;width:100%;text-align:left;background:#221E3A;border:1px solid #3D3A55;color:var(--t);border-radius:10px;padding:8px 10px;font-size:.95rem}
.tm-pick img{width:46px;height:46px;border-radius:50%;object-fit:cover;object-position:top;flex:0 0 46px;background:#15122a}
.tm-pick .tm-x{margin-left:auto;color:var(--t2)}
.tm-sum{font-size:.78rem;color:var(--t2);margin:8px 0 2px;line-height:1.5}.tm-sum b{color:var(--t)}
.tm-bh{font-size:.78rem;letter-spacing:.05em;text-transform:uppercase;color:var(--t2);margin:12px 0 6px}
.tm-pr{border-top:1px solid #2a2740;padding:8px 0}.tm-pm{display:flex;align-items:center;gap:10px}
.tm-pm img{width:38px;height:48px;object-fit:contain;flex:0 0 38px}.tm-pn{flex:1;min-width:0;font-size:.86rem;cursor:pointer}.tm-pn small{display:block;color:var(--t2);font-size:.68rem}
.tm-lv{display:flex;align-items:center;gap:6px}.tm-lv button{width:30px;height:30px;border-radius:50%;border:1px solid #3D3A55;background:#221E3A;color:var(--t);font-size:1.05rem;line-height:1}.tm-lv span{min-width:22px;text-align:center;font-weight:700}
.tm-pr.on .tm-pn b{color:var(--a)}.tm-pd{font-size:.8rem;color:var(--t2);line-height:1.5;margin:6px 0 0 48px}
.tm-dg{display:grid;gap:8px}.tm-ds{display:flex;gap:6px;align-items:center}.tm-ds .tm-pick{flex:1;min-width:0}.tm-ds select{background:#221E3A;color:var(--t);border:1px solid #3D3A55;border-radius:10px;padding:10px 6px;font-size:.85rem}
.tm-pick span.tm-t{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tm-nt{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}.tm-nt span{font-size:.76rem;background:#221E3A;border-radius:6px;padding:4px 8px}.tm-nt img{width:20px;height:20px;vertical-align:middle;margin-right:4px}
.tm-md{position:fixed;inset:0;z-index:50;background:rgba(8,6,20,.92);display:flex;flex-direction:column;padding:12px}.tm-md>div:last-child{flex:1;overflow:auto}.tm-md>div:first-child{flex:0 0 auto}
.tm-it{display:flex;align-items:center;gap:10px;width:100%;text-align:left;background:none;border:0;border-bottom:1px solid #2a2740;color:var(--t);padding:8px 4px;font-size:.95rem}.tm-it img{width:44px;height:44px;border-radius:8px;object-fit:cover;object-position:top;background:#221E3A}.tm-it small{color:var(--t2)}
.tm-act{display:flex;gap:8px;flex-wrap:wrap}.tm-act .btn{flex:1;min-width:120px}.tm-bk{background:none;border:0;color:var(--a);font-size:.95rem;padding:4px 0 10px}
.tm-ta{width:100%;box-sizing:border-box;min-height:110px;padding:10px;border-radius:10px;border:1px solid #3D3A55;background:var(--sf);color:var(--t);font-size:.85rem}
`;document.head.appendChild(s)})();

function modal(titulo,items,onPick){
  const m=document.createElement("div");m.className="tm-md";
  m.innerHTML=`<div style="display:flex;gap:8px;margin-bottom:8px"><input class="tm-in" style="margin:0" type="search" placeholder="Buscar ${e(titulo)}..."><button class="chip" id="tm-cl">Cerrar</button></div><div></div>`;
  document.body.appendChild(m);
  const L=m.lastElementChild,inp=m.querySelector("input");
  const pint=()=>{const q=norm(inp.value);const R=items.filter(i=>!q||norm(i.n).includes(q));L.innerHTML=R.map((i,k)=>`<button class="tm-it" data-k="${k}">${i.img?`<img src="${e(i.img)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">`:""}<span>${e(i.n)}<br><small>${e(i.s||"")}</small></span></button>`).join("")||"<p class='nota'>Sin resultados</p>";L.querySelectorAll(".tm-it").forEach(b=>b.onclick=()=>{const it=R[+b.dataset.k];m.remove();onPick(it)})};
  inp.oninput=pint;m.querySelector("#tm-cl").onclick=()=>m.remove();pint();
}

function vList(){
  mode="list";T=null;
  const A=ST.teams;
  root.innerHTML=`<button class="btn" data-a="new">+ Nuevo equipo</button><div style="height:12px"></div>`+
  (A.length?A.map(t=>`<div class="tm-card" data-a="edit" data-id="${t.id}"><h4>${e(t.name||"Equipo sin nombre")}</h4><div class="tm-th">${t.slots.map(s=>{const c=charOf(s.c);return c?`<img src="${e(c.imageUrl)}" alt="${e(c.name)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.visibility='hidden'">`:`<img alt="" style="visibility:hidden">`}).join("")}<span class="nota" style="margin-left:auto;text-align:right">${t.discs.filter(Boolean).length}/6 discos${t.score?"<br>Récord: "+e(t.score):""}</span></div></div>`).join(""):`<p class="nota">Aún no tienes equipos guardados. Toca “Nuevo equipo” para armar el primero: elige 3 personajes, sus potenciales y los discos.</p>`)+
  `<div class="tm-io"><button class="btn out" data-a="exp">Exportar todo</button><button class="btn out" data-a="imp">Importar</button></div><div id="tm-io-box"></div>
   <p class="nota" style="margin-top:12px">Tus equipos se guardan solo en este dispositivo. Para pasarlos a otro, usa Exportar/Importar o copia el código de cada equipo.</p>
   <a class="btn out" href="#builds" data-nav="builds">Builds de la comunidad</a>`;
}
const code=t=>"SSV1:"+btoa(unescape(encodeURIComponent(JSON.stringify(t))));
function parse(txt){
  txt=txt.trim();let j;
  try{j=JSON.parse(txt)}catch(x){const m=txt.replace(/^SSV1:/,"").trim();try{j=JSON.parse(decodeURIComponent(escape(atob(m))))}catch(y){return null}}
  let a=Array.isArray(j)?j:(j&&j.teams)?j.teams:[j];
  return a.filter(t=>t&&Array.isArray(t.slots)).map(t=>({id:uid(),name:String(t.name||"").slice(0,60),slots:[0,1,2].map(i=>{const s=t.slots[i]||{};return{c:String(s.c||""),p:(s.p&&typeof s.p==="object")?s.p:{}}}),discs:[0,1,2,3,4,5].map(i=>{const d=(t.discs||[])[i];return d&&d.n?{n:String(d.n),a:Math.max(0,Math.min(8,+d.a||0))}:null}),note:String(t.note||"").slice(0,500),score:String(t.score||"").slice(0,20)}));
}
async function copiar(txt,box,msg){let ok=false;try{await navigator.clipboard.writeText(txt);ok=true}catch(x){}
  box.innerHTML=`<p class="nota">${ok?msg+" Copiado al portapapeles.":"No pude copiar solo; selecciona el texto y cópialo."}</p><textarea class="tm-ta" readonly>${e(txt)}</textarea>`;}
function descarga(txt,nombre){try{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([txt],{type:"application/json"}));a.download=nombre;document.body.appendChild(a);a.click();a.remove()}catch(x){}}

function slotHtml(s){
  const S=T.slots[s],c=charOf(S.c);
  return `<div class="tm-sl" data-s="${s}"><div class="tm-sh">${ROLE[s]}</div>
   <button class="tm-pick" data-a="char" data-s="${s}">${c?`<img src="${e(c.imageUrl)}" alt="" referrerpolicy="no-referrer" onerror="this.style.visibility='hidden'"><span class="tm-t">${e(c.name)}</span>`:`<span class="tm-t">Elegir personaje…</span>`}</button>
   <div class="tm-sum" id="tm-ps${s}"></div><div id="tm-pl${s}"></div></div>`;
}
function rowHtml(s,k,p){
  const mx=Math.max(1,...p.v.map(a=>a.length)),l=T.slots[s].p[k]||0;POT[s][k]={p,mx};
  return `<div class="tm-pr${l?" on":""}" data-s="${s}" data-k="${e(k)}"><div class="tm-pm">${p.iu?`<img src="${e(p.iu)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">`:""}<div class="tm-pn" data-a="pt"><b>${e(p.n)}</b><small>${p.t<3?"Núcleo":"Común"}${mx>1?" · hasta nivel "+mx:""}</small></div><div class="tm-lv"><button data-a="pd" aria-label="Bajar">−</button><span>${l||"—"}</span><button data-a="pu" aria-label="Subir">+</button></div></div><div class="tm-pd" hidden></div></div>`;
}
async function pintaSlot(s){
  const S=T.slots[s],pl=root.querySelector("#tm-pl"+s);POT[s]={};
  if(!S.c){pl.innerHTML="";root.querySelector("#tm-ps"+s).textContent="";return}
  pl.innerHTML="<p class='nota'>Cargando potenciales…</p>";
  const F=await getF(S.c);
  if(!F||!F.potenciales){pl.innerHTML="<p class='nota'>Este personaje aún no tiene datos de potenciales.</p>";return}
  const role=s===0?"main":"support",Tt=F.potenciales[role]||F.potenciales.main;
  pl.innerHTML=`<details${S.o?" open":""}><summary style="color:var(--a);margin-top:8px;cursor:pointer">Potenciales</summary>`+Tt.builds.map(b=>{
    const L=Tt.l.filter(p=>p.g===b.id);if(!L.length)return"";
    const nm=/(\d+)\s*$/.test(b.n)?"Build "+b.n.match(/(\d+)\s*$/)[1]:b.n;
    return `<div class="tm-bh">${e(nm)}</div>`+(b.d?`<p class="fk-bd">${e(b.d)}</p>`:"")+L.map(p=>rowHtml(s,role+"|"+p.g+"|"+p.ne,p)).join("")}).join("")+`</details>`;
  pl.querySelector("details").ontoggle=ev=>{S.o=ev.target.open};
  resumen(s);
}
function resumen(s){
  const S=T.slots[s],el=root.querySelector("#tm-ps"+s);if(!el)return;
  const ks=Object.keys(S.p).filter(k=>S.p[k]>0&&POT[s][k]);
  el.innerHTML=ks.length?`<b>Elegidos (${ks.length}):</b> `+ks.map(k=>e(POT[s][k].p.n)+" <b>"+S.p[k]+"</b>").join(" · "):"Ningún potencial elegido.";
}
function setLv(row,d){
  const s=+row.dataset.s,k=row.dataset.k,o=POT[s][k];if(!o)return;
  const S=T.slots[s];let l=Math.max(0,Math.min(o.mx,(S.p[k]||0)+d));
  if(l)S.p[k]=l;else delete S.p[k];
  row.classList.toggle("on",l>0);row.querySelector(".tm-lv span").textContent=l||"—";
  const pd=row.querySelector(".tm-pd");if(!pd.hidden)pd.innerHTML=tpl(o.p.s,o.p.v,Math.max(0,l-1));
  resumen(s);
}
function discHtml(i){
  const D=T.discs[i],d=D&&discs().find(x=>x.name===D.n);
  return `<div class="tm-ds" data-i="${i}"><button class="tm-pick" data-a="disc" data-i="${i}">${d?`<img src="${e(d.imageUrl)}" alt="" referrerpolicy="no-referrer" onerror="this.style.visibility='hidden'" style="border-radius:8px"><span class="tm-t">${e(d.name)}</span>`:`<span class="tm-t">Elegir disco…</span>`}</button>${D?`<select data-a="asc" data-i="${i}" aria-label="Ascensión">${[0,1,2,3,4,5,6,7,8].map(a=>`<option value="${a}"${a===D.a?" selected":""}>${a===0?"Sin asc.":"Asc. "+a}</option>`).join("")}</select><button class="chip" data-a="dx" data-i="${i}" aria-label="Quitar">✕</button>`:""}</div>`;
}
async function pintaNotas(){
  const box=root.querySelector("#tm-notes");if(!box)return;
  const I=await getIdx(),tot={},hs=[];let n=0;
  for(const D of T.discs){if(!D)continue;n++;const F=await getD(D.n);if(!F)continue;
    const nf=(F.nf||[]).find(x=>x.f===D.a);if(nf)for(const k in nf.n)tot[k]=(tot[k]||0)+nf.n[k];
    hs.push({D,F})}
  if(!n){box.innerHTML="";return}
  const ks=Object.keys(tot);
  box.innerHTML=`<h4 class="fk-h">Notas del equipo</h4><div class="tm-nt">${ks.length?ks.map(k=>{const r=I.notas[k]||{};return `<span>${r.ic?`<img src="${e(r.ic)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">`:""}${e((r.n||k).replace(/^Melodía de /,""))} <b>×${tot[k]}</b></span>`}).join(""):"<span>Sin notas</span>"}</div>
   <h4 class="fk-h">Armonías alcanzables</h4>`+hs.map(({D,F})=>(F.arm||[]).map(a=>{
      let lv=0;(a.nt||[]).forEach((req,j)=>{if(Object.keys(req).every(k=>(tot[k]||0)>=req[k]))lv=j+1});
      return `<div class="kv"><span>${e(a.n)}<br><small class="nota">${e(D.n)}</small></span><b style="flex:0 0 auto;text-align:right;color:${lv?"var(--a)":"var(--t2)"}">${lv?"Nivel "+lv+" / "+a.v.length:"Sin activar"}</b></div>`}).join("")).join("")+
   `<p class="nota">Estimación: suma las notas de los 6 discos a la ascensión elegida y calcula hasta qué nivel de cada armonía alcanzan.</p>`;
}
function vEdit(){
  mode="edit";
  root.innerHTML=`<button class="tm-bk" data-a="back">‹ Mis equipos</button>
   <input class="tm-in" id="tm-name" placeholder="Nombre del equipo" maxlength="60" value="${e(T.name)}">
   ${[0,1,2].map(slotHtml).join("")}
   <div class="tm-sl"><div class="tm-sh">Discos</div><div class="tm-sh" style="color:var(--t2)">Principales</div><div class="tm-dg">${[0,1,2].map(discHtml).join("")}</div><div class="tm-sh" style="color:var(--t2);margin-top:10px">De apoyo</div><div class="tm-dg">${[3,4,5].map(discHtml).join("")}</div><div id="tm-notes"></div></div>
   <div class="tm-sl"><div class="tm-sh">Récord y notas</div><input class="tm-in" id="tm-score" inputmode="numeric" placeholder="Récord (puntaje), opcional" maxlength="20" value="${e(T.score)}"><textarea class="tm-ta" id="tm-note" placeholder="Notas: cómo se juega, rotación, etc." maxlength="500">${e(T.note)}</textarea></div>
   <button class="btn" data-a="save">Guardar equipo</button>
   <div class="tm-act"><button class="btn out" data-a="code">Copiar código</button><button class="btn out" data-a="dup">Duplicar</button><button class="btn out" data-a="del">Eliminar</button></div><div id="tm-io-box"></div>`;
  [0,1,2].forEach(pintaSlot);pintaNotas();
}
function leer(){if(mode!=="edit")return;const a=root.querySelector("#tm-name");if(!a)return;T.name=a.value.trim();T.score=root.querySelector("#tm-score").value.trim();T.note=root.querySelector("#tm-note").value}
function guardar(){
  leer();const i=ST.teams.findIndex(x=>x.id===T.id);
  const cp=JSON.parse(JSON.stringify(T));cp.slots.forEach(s=>delete s.o);
  if(!cp.name)cp.name="Equipo "+(ST.teams.length+(i<0?1:0));
  if(i<0)ST.teams.unshift(cp);else ST.teams[i]=cp;
  T.name=cp.name;return save();
}
function flash(t){const b=root.querySelector("[data-a=save]");if(!b)return;const o=b.textContent;b.textContent=t;setTimeout(()=>{b.textContent=o},1400)}

function onClick(ev){
  const el=ev.target.closest("[data-a]");if(!el)return;const a=el.dataset.a;
  if(a==="new"){T=nuevo();vEdit()}
  else if(a==="edit"){T=JSON.parse(JSON.stringify(ST.teams.find(x=>x.id===el.dataset.id)));vEdit()}
  else if(a==="back"){vList()}
  else if(a==="save"){flash(guardar()?"✓ Guardado":"No se pudo guardar (almacenamiento bloqueado)")}
  else if(a==="del"){if(confirm("¿Eliminar este equipo?")){ST.teams=ST.teams.filter(x=>x.id!==T.id);save();vList()}}
  else if(a==="dup"){leer();const c=JSON.parse(JSON.stringify(T));c.id=uid();c.name=(c.name||"Equipo")+" (copia)";ST.teams.unshift(c);save();T=JSON.parse(JSON.stringify(c));vEdit()}
  else if(a==="code"){leer();copiar(code(T),root.querySelector("#tm-io-box"),"Código del equipo.")}
  else if(a==="exp"){const t=JSON.stringify({v:1,teams:ST.teams});copiar(t,root.querySelector("#tm-io-box"),"Todos tus equipos.");descarga(t,"equipos-stella-sora.json")}
  else if(a==="imp"){const b=root.querySelector("#tm-io-box");b.innerHTML=`<p class="nota">Pega aquí un código o el texto exportado, o elige el archivo.</p><textarea class="tm-ta" id="tm-imp-t"></textarea><input type="file" id="tm-imp-f" accept=".json,.txt" style="margin:8px 0"><button class="btn" data-a="imp2">Importar</button><p class="nota" id="tm-imp-m"></p>`;
    b.querySelector("#tm-imp-f").onchange=async f=>{const x=f.target.files[0];if(x)b.querySelector("#tm-imp-t").value=await x.text()}}
  else if(a==="imp2"){const r=parse(root.querySelector("#tm-imp-t").value),m=root.querySelector("#tm-imp-m");
    if(!r||!r.length){m.textContent="No reconocí ese código o archivo.";return}
    ST.teams=r.concat(ST.teams);save();vList()}
  else if(a==="char"){const s=+el.dataset.s;
    modal("personaje",chars().map(c=>({n:c.name,s:c.element+" · "+c.rarity+"★",img:c.imageUrl,id:c.id})),it=>{leer();T.slots[s]={c:it.id,p:{}};vEdit()})}
  else if(a==="disc"){const i=+el.dataset.i;
    modal("disco",discs().map(d=>({n:d.name,s:d.element+" · "+d.rarity+"★",img:d.imageUrl})),it=>{leer();T.discs[i]={n:it.n,a:(T.discs[i]&&T.discs[i].a)||8};vEdit()})}
  else if(a==="dx"){leer();T.discs[+el.dataset.i]=null;vEdit()}
  else if(a==="pu"||a==="pd"){setLv(el.closest(".tm-pr"),a==="pu"?1:-1)}
  else if(a==="pt"){const row=el.closest(".tm-pr"),pd=row.querySelector(".tm-pd"),o=POT[+row.dataset.s][row.dataset.k];
    if(pd.hidden){const l=T.slots[+row.dataset.s].p[row.dataset.k]||1;pd.innerHTML=tpl(o.p.s,o.p.v,l-1);pd.hidden=false}else pd.hidden=true}
}
function onChange(ev){const el=ev.target;if(el.dataset&&el.dataset.a==="asc"){T.discs[+el.dataset.i].a=+el.value;pintaNotas()}}

window.teamsShow=function(){
  root=document.getElementById("teams-root");if(!root)return;
  if(!root._ok){root._ok=1;root.addEventListener("click",onClick);root.addEventListener("change",onChange)}
  ST=load();vList();
};
})();
