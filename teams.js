/* Armador de equipos: 3 personajes (potenciales con nivel y prioridad) + 3 discos principales + 6 de apoyo/recomendados.
   Se guarda en el telefono (localStorage), con exportar/importar y codigo para compartir. Incluye ficha visual del equipo. */
(function(){
const KEY="ssv_teams";
const e=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const norm=t=>String(t||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const EC={Aqua:"#1e90d6",Ignis:"#e5533d",Lux:"#e0a82a",Terra:"#a9783a",Umbra:"#8b5cf6",Ventus:"#2fb585",Neutral:"#7d8096"};
const ec=el=>EC[el]||"#7B6CFF";
const PRI={c:"Clave",m:"Medio",o:"Opcional"},PORD={c:0,m:1,o:2};
const ROLE=["Trekker principal","Trekker de apoyo 1","Trekker de apoyo 2"];
const NDISC=9;
function load(){try{const j=JSON.parse(localStorage.getItem(KEY)||"null");if(j&&Array.isArray(j.teams))return{v:2,teams:j.teams.map(fix)}}catch(x){}return{v:2,teams:[]}}
function fix(t){
  t.slots=[0,1,2].map(i=>{const s=(t.slots||[])[i]||{},p={};
    for(const k in (s.p||{})){const v=s.p[k];if(typeof v==="number"){if(v>0)p[k]={l:v,pr:"m"}}else if(v&&v.l>0)p[k]={l:Math.min(9,+v.l|0),pr:PRI[v.pr]?v.pr:"m"}}
    return{c:String(s.c||""),p}});
  const d=(t.discs||[]).slice(0,NDISC).map(x=>x&&x.n?{n:String(x.n),a:Math.max(0,Math.min(8,+x.a||0))}:null);while(d.length<NDISC)d.push(null);
  t.discs=d;t.name=String(t.name||"").slice(0,60);t.note=String(t.note||"").slice(0,500);t.score=String(t.score||"").slice(0,20);t.id=t.id||uid();return t}
let ST=load();
function save(){try{localStorage.setItem(KEY,JSON.stringify(ST));return true}catch(x){return false}}
const FC={},DC={};let IDX=null;
async function getF(id){if(FC[id]!==undefined)return FC[id];try{const r=await fetch("fichas/"+id+".json");FC[id]=r.ok?await r.json():null}catch(x){FC[id]=null}return FC[id]}
async function getIdx(){if(IDX)return IDX;try{const r=await fetch("discos/indice.json");IDX=r.ok?await r.json():{ids:{},notas:{}}}catch(x){IDX={ids:{},notas:{}}}return IDX}
async function getD(name){const I=await getIdx(),id=I.ids[name];if(!id)return null;if(DC[id]!==undefined)return DC[id];try{const r=await fetch("discos/"+id+".json");DC[id]=r.ok?await r.json():null}catch(x){DC[id]=null}return DC[id]}
function tpl(s,vals,tn){return e(s).replace(/⟦(\d+)⟧/g,(m,i)=>'<b class="fn">'+e(vals&&vals[i]!=null?(Array.isArray(vals[i])?vals[i][Math.min(tn||0,vals[i].length-1)]:vals[i]):"?")+"</b>").replace(/⟪(\d+)⟫/g,'<b class="fn">?</b>').replace(/⟨([^⟩]*)⟩/g,'<i class="fk">$1</i>').replace(/\n/g,"<br>")}
const chars=()=>typeof CHARS!=="undefined"?CHARS:[],discs=()=>typeof DISCS!=="undefined"?DISCS:[];
const charOf=id=>chars().find(c=>c.id===id),discOf=n=>discs().find(d=>d.name===n);
const star=(n,h)=>typeof estr==="function"?estr(n,h||14):n+"★";
const eli=el=>typeof elIcon==="function"?elIcon(el):"";
let PR=null;
async function getPresets(){if(PR)return PR;try{const r=await fetch("presets.json");PR=r.ok?await r.json():{}}catch(x){PR={}}return PR}
const gidOf=(P,slug)=>{const c=charOf(slug);if(!c)return null;for(const i in P)if(P[i].n===c.name)return +i;return null};
/* Codigo de preset del juego: 3 ids de personaje (uint32 BE) + 40 bits por personaje (4 nucleo + 9x3 normales + 3x3 comunes). Solo personajes y potenciales. */
async function gameCode(){
  const P=await getPresets(),ids=T.slots.map(s=>gidOf(P,s.c));
  if(ids.some(x=>x==null))return null;
  const by=[];ids.forEach(i=>by.push((i>>>24)&255,(i>>>16)&255,(i>>>8)&255,i&255));
  let bits="";
  for(let s=0;s<3;s++){
    const g=P[ids[s]],lv={};
    for(const k in T.slots[s].p){lv[k.split("|").slice(2).join("|")]=T.slots[s].p[k].l}
    const get=id=>Math.max(0,Math.min(7,lv[g.names[id]]||0));
    bits+=(s===0?g.ms:g.as).map(id=>get(id)>0?"1":"0").join("");
    bits+=(s===0?g.mn:g.an).concat(g.cm).map(id=>get(id).toString(2).padStart(3,"0")).join("");
  }
  for(let i=0;i<bits.length;i+=8)by.push(parseInt(bits.slice(i,i+8),2));
  return btoa(String.fromCharCode(...by));
}
async function gameDecode(txt){
  txt=txt.trim();if(!/^[A-Za-z0-9+/]{36}$/.test(txt))return null;
  let b;try{b=atob(txt)}catch(x){return null}
  if(b.length!==27)return null;
  const P=await getPresets(),by=[...b].map(c=>c.charCodeAt(0));
  const ids=[0,1,2].map(i=>((by[4*i]<<24)|(by[4*i+1]<<16)|(by[4*i+2]<<8)|by[4*i+3])>>>0);
  if(ids.some(i=>!P[i]))return null;
  const bits=by.slice(12).map(x=>x.toString(2).padStart(8,"0")).join(""),t=nuevo();t.name="Preset importado";
  for(let s=0;s<3;s++){
    const g=P[ids[s]],c=chars().find(x=>x.name===g.n);if(!c)continue;
    const role=s===0?"main":"support",blk=bits.slice(s*40,s*40+40),F=await getF(c.id),L={};
    (s===0?g.ms:g.as).forEach((id,j)=>{if(blk[j]==="1")L[id]=1});
    (s===0?g.mn:g.an).concat(g.cm).forEach((id,j)=>{const v=parseInt(blk.slice(4+3*j,7+3*j),2);if(v>0)L[id]=v});
    t.slots[s]={c:c.id,p:{}};
    if(F&&F.potenciales){const T2=F.potenciales[role]||F.potenciales.main;
      for(const id in L){const p=T2.l.find(x=>x.ne===g.names[id]);if(p)t.slots[s].p[role+"|"+p.g+"|"+p.ne]={l:L[id],pr:p.t===1?"c":"m"}}}
  }
  return t;
}
const nuevo=()=>fix({id:uid(),name:"",slots:[],discs:[],note:"",score:""});
let root,T=null,mode="list";

(function css(){const s=document.createElement("style");s.textContent=`
#teams-root{--tc:#7B6CFF}
.tm-hero{position:relative;border-radius:16px;padding:16px;margin-bottom:14px;background:linear-gradient(135deg,#2a2160,#14102c 70%);border:1px solid rgba(123,108,255,.5);overflow:hidden}
.tm-hero:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 85% 0,rgba(123,108,255,.45),transparent 55%);pointer-events:none}
.tm-hero>*{position:relative}.tm-hero h3{margin:0 0 4px;font-size:1.15rem}.tm-hero p{margin:0 0 12px;font-size:.82rem;color:var(--t2)}
.tm-card{position:relative;border-radius:14px;margin-bottom:12px;cursor:pointer;overflow:hidden;border:1px solid #2a2740;background:var(--sf)}
.tm-ctop{height:8px}.tm-cb{padding:12px 14px}.tm-cb h4{margin:0 0 8px;font-size:1.02rem}
.tm-th{display:flex;align-items:center}.tm-th img,.tm-th i{width:48px;height:48px;border-radius:50%;object-fit:cover;object-position:top;background:#221E3A;border:2px solid var(--sf);margin-right:-10px;flex:0 0 48px}.tm-th i{display:block}
.tm-cm{margin-left:auto;text-align:right;font-size:.76rem;color:var(--t2);line-height:1.5}
.tm-in{width:100%;box-sizing:border-box;padding:11px 13px;border-radius:12px;border:1px solid #3D3A55;background:rgba(14,12,30,.7);color:var(--t);font-size:1rem;margin-bottom:8px;outline:none}
.tm-name{font-size:1.25rem;font-weight:800;border-color:rgba(123,108,255,.5)}
.tm-sl{border-radius:16px;margin-bottom:14px;overflow:hidden;border:1px solid #2a2740;background:var(--sf)}
.tm-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;width:100%;padding:26px 10px;background:none;border:0;color:var(--t2);font-weight:700}
.tm-empty b{display:flex;align-items:center;justify-content:center;width:56px;height:56px;border:2px dashed #4a4670;border-radius:50%;font-size:1.6rem;color:var(--a)}
.tm-lab{font-size:.64rem;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--t2);padding:8px 12px 0}
.tm-bn{display:flex;align-items:center;gap:12px;padding:12px;color:#fff;background:linear-gradient(120deg,var(--tc),color-mix(in srgb,var(--tc) 35%,#0b0920));position:relative}
.tm-bn img.tm-av{width:66px;height:66px;border-radius:50%;object-fit:cover;object-position:top;border:3px solid rgba(255,255,255,.85);background:#15122a;flex:0 0 66px}
.tm-bn h4{margin:0;font-size:1.15rem;text-shadow:0 1px 4px rgba(0,0,0,.5)}.tm-bn .tm-m{display:flex;gap:6px;align-items:center;margin-top:5px;font-size:.75rem}
.tm-bn .tm-m span{background:rgba(0,0,0,.35);border-radius:8px;padding:2px 8px}
.tm-bx{margin-left:auto;display:flex;flex-direction:column;gap:6px}.tm-bx button{background:rgba(0,0,0,.38);border:1px solid rgba(255,255,255,.35);color:#fff;border-radius:8px;font-size:.72rem;padding:5px 9px}
.tm-pb{padding:10px 12px 12px}.tm-pbh{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;font-size:.78rem;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--t2)}
.tm-add{background:var(--tc);border:0;color:#fff;border-radius:10px;padding:8px 14px;font-weight:700;font-size:.82rem}
.tm-pl{display:flex;align-items:center;gap:9px;padding:6px 0;border-top:1px solid #2a2740;font-size:.84rem}
.tm-pl img{width:34px;height:42px;object-fit:contain;flex:0 0 34px}.tm-pl .tm-n{flex:1;min-width:0}
.tm-lvc{background:#221E3A;border-radius:7px;padding:2px 7px;font-size:.7rem;font-weight:800;white-space:nowrap}
.tm-pr-c{background:#ff6ec7;color:#1a0b18}.tm-pr-m{background:#a78bfa;color:#140a2b}.tm-pr-o{background:#4b4870;color:#ddd}
.tm-tg{border-radius:7px;padding:2px 7px;font-size:.66rem;font-weight:800;white-space:nowrap}
.tm-hint{font-size:.8rem;color:var(--t2);margin:2px 0 4px}
.tm-dh{display:flex;align-items:baseline;justify-content:space-between;padding:12px 12px 6px}.tm-dh b{font-size:1rem}.tm-dh small{color:var(--t2);font-size:.72rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
.tm-dg{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:0 12px 10px}
.tm-dt{position:relative;aspect-ratio:1;border-radius:12px;overflow:hidden;border:2px dashed #4a4670;background:rgba(14,12,30,.5);display:flex;align-items:center;justify-content:center;color:var(--a);font-size:1.7rem;cursor:pointer;padding:0}
.tm-dt.f{border:2px solid var(--tc);}.tm-dt img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.tm-dt .tm-dn{position:absolute;left:0;right:0;bottom:0;background:linear-gradient(transparent,rgba(0,0,0,.85));color:#fff;font-size:.62rem;font-weight:700;padding:14px 4px 3px;text-align:center;line-height:1.15}
.tm-dt .tm-dx{position:absolute;top:3px;right:3px;width:22px;height:22px;border-radius:50%;background:rgba(0,0,0,.65);color:#fff;font-size:.7rem;display:flex;align-items:center;justify-content:center;z-index:2}
.tm-dt .tm-da{position:absolute;top:3px;left:3px;z-index:2;background:rgba(0,0,0,.65);border-radius:8px;font-size:.62rem;color:#fff;border:0;padding:2px 3px}
.tm-dt .tm-st{position:absolute;top:26px;left:4px;z-index:2}
.tm-nt{display:flex;flex-wrap:wrap;gap:6px;padding:0 12px 6px}.tm-nt span{font-size:.76rem;background:#221E3A;border-radius:8px;padding:4px 9px}.tm-nt img{width:20px;height:20px;vertical-align:middle;margin-right:4px}
.tm-sec{padding:0 12px 12px}.tm-ta{width:100%;box-sizing:border-box;min-height:90px;padding:10px;border-radius:12px;border:1px solid #3D3A55;background:rgba(14,12,30,.7);color:var(--t);font-size:.9rem}
.tm-md{position:fixed;inset:0;z-index:60;background:#0b0920;display:flex;flex-direction:column}
.tm-mh{padding:12px;border-bottom:1px solid #2a2740;background:linear-gradient(120deg,#241d55,#0b0920)}
.tm-mt{display:flex;align-items:center;gap:8px;margin-bottom:8px}.tm-mt b{flex:1;font-size:1.02rem}
.tm-mb{flex:1;overflow:auto;padding:10px 12px 40px}
.tm-fl{display:flex;gap:6px;overflow-x:auto;padding:2px 0 6px;scrollbar-width:none}.tm-fl::-webkit-scrollbar{display:none}
.tm-fl .chip{flex:0 0 auto;display:flex;align-items:center;white-space:nowrap}
.tm-fl .chip.on{background:var(--a);color:#fff}
.tm-gr{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.tm-gt{position:relative;border-radius:12px;overflow:hidden;background:#15122a;border:2px solid transparent;aspect-ratio:3/4;padding:0;color:#fff;text-align:left}
.tm-gt img.tm-pa{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top}
.tm-gt .tm-pn{position:absolute;left:0;right:0;bottom:0;padding:18px 6px 6px;background:linear-gradient(transparent,rgba(0,0,0,.88));font-size:.74rem;font-weight:700;line-height:1.15}
.tm-gt .tm-pe{position:absolute;top:0;left:0;right:0;height:5px}.tm-gt .tm-ps{position:absolute;top:10px;left:6px;display:flex;align-items:center;gap:3px;background:rgba(0,0,0,.55);border-radius:8px;padding:1px 5px}
.tm-gt.dsq{aspect-ratio:1}
.tm-pk{display:flex;gap:10px;align-items:flex-start;padding:10px;border-radius:12px;border:1px solid #2a2740;background:var(--sf);margin-bottom:8px}
.tm-pk.on{border-color:var(--tc);box-shadow:0 0 0 1px var(--tc) inset}
.tm-pk img.tm-pi{width:46px;height:58px;object-fit:contain;flex:0 0 46px}
.tm-pk .tm-pq{flex:1;min-width:0}.tm-pk h5{margin:0;font-size:.92rem}.tm-pk small{color:var(--t2);font-size:.68rem}
.tm-pk .tm-d{font-size:.78rem;color:var(--t2);line-height:1.45;margin:3px 0 0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.tm-pk .tm-d.x{display:block}
.tm-ck{flex:0 0 28px;height:28px;border-radius:50%;border:2px solid #4a4670;display:flex;align-items:center;justify-content:center;color:transparent;font-weight:900}
.tm-pk.on .tm-ck{background:var(--tc);border-color:var(--tc);color:#fff}
.tm-ctl{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-top:8px}
.tm-ctl select{background:#221E3A;color:var(--t);border:1px solid #3D3A55;border-radius:8px;padding:6px 8px;font-size:.8rem}
.tm-seg{display:flex;border-radius:8px;overflow:hidden;border:1px solid #3D3A55}.tm-seg button{background:#221E3A;border:0;color:var(--t2);font-size:.74rem;font-weight:700;padding:6px 9px}.tm-seg button.on{background:var(--tc);color:#fff}
.tm-act{display:flex;gap:8px;flex-wrap:wrap}.tm-act .btn{flex:1;min-width:110px;margin-top:8px}
.tm-bk{background:none;border:0;color:var(--a);font-size:.95rem;padding:4px 0 10px}
.tm-io{display:flex;gap:8px}.tm-io .btn{margin-top:10px}
.tm-tb{width:100%;box-sizing:border-box;min-height:100px;padding:10px;border-radius:10px;border:1px solid #3D3A55;background:var(--sf);color:var(--t);font-size:.85rem}
.tm-fh{border-radius:16px;padding:16px;margin-bottom:12px;background:linear-gradient(135deg,#2a2160,#14102c 70%);border:1px solid rgba(123,108,255,.5)}
.tm-fh h3{margin:0;font-size:1.3rem}.tm-fh p{margin:6px 0 0;font-size:.85rem;color:var(--t2);white-space:pre-line}
`;document.head.appendChild(s)})();

/* ---------- selector con filtros (personajes y discos) ---------- */
function picker(titulo,items,onPick,opts){
  opts=opts||{};let fe="",fr=0,q="";
  const m=document.createElement("div");m.className="tm-md";
  const els=[...new Set(items.map(i=>i.el).filter(Boolean))],rs=[...new Set(items.map(i=>i.r).filter(Boolean))].sort((a,b)=>b-a);
  m.innerHTML=`<div class="tm-mh"><div class="tm-mt"><b>${e(titulo)}</b><button class="chip" data-x="1">Cerrar</button></div>
   <input class="tm-in" style="margin-bottom:6px" type="search" placeholder="Buscar…">
   <div class="tm-fl" data-f="e"><button class="chip on" data-v="">Todos</button>${els.map(x=>`<button class="chip" data-v="${e(x)}">${eli(x)}${e(x)}</button>`).join("")}</div>
   <div class="tm-fl" data-f="r"><button class="chip on" data-v="0">Todas</button>${rs.map(x=>`<button class="chip" data-v="${x}">${x}★</button>`).join("")}</div></div><div class="tm-mb"><div class="tm-gr"></div></div>`;
  document.body.appendChild(m);
  const G=m.querySelector(".tm-gr");
  const pint=()=>{const n=norm(q);const R=items.filter(i=>(!n||norm(i.n).includes(n))&&(!fe||i.el===fe)&&(!fr||i.r===fr));
    G.innerHTML=R.map((i,k)=>`<button class="tm-gt${opts.sq?" dsq":""}" data-k="${k}" style="--tc:${ec(i.el)}"><span class="tm-pe" style="background:${ec(i.el)}"></span>${i.img?`<img class="tm-pa" src="${e(i.img)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.visibility='hidden'">`:""}<span class="tm-ps">${i.r?star(i.r,12):""}</span><span class="tm-pn">${e(i.n)}</span></button>`).join("")||"<p class='nota' style='grid-column:1/-1'>Sin resultados.</p>";
    G.querySelectorAll(".tm-gt").forEach(b=>b.onclick=()=>{const it=R[+b.dataset.k];m.remove();onPick(it)})};
  m.querySelector("input").oninput=ev=>{q=ev.target.value;pint()};
  m.querySelectorAll(".tm-fl").forEach(f=>f.onclick=ev=>{const b=ev.target.closest("[data-v]");if(!b)return;f.querySelectorAll(".chip").forEach(c=>c.classList.toggle("on",c===b));if(f.dataset.f==="e")fe=b.dataset.v;else fr=+b.dataset.v;pint()});
  m.querySelector("[data-x]").onclick=()=>m.remove();pint();
}
const charItems=()=>chars().map(c=>({n:c.name,el:c.element,r:c.rarity,img:c.imageUrl,id:c.id}));
const discItems=()=>discs().map(d=>({n:d.name,el:d.element,r:d.rarity,img:d.imageUrl}));

/* ---------- modal de potenciales ---------- */
async function potModal(s){
  const S=T.slots[s],c=charOf(S.c);if(!c)return;
  const F=await getF(S.c);
  if(!F||!F.potenciales){alert("Este personaje aún no tiene datos de potenciales.");return}
  const role=s===0?"main":"support",Tt=F.potenciales[role]||F.potenciales.main;
  const bn=b=>/\b(\d+)\b/.test(b.n)?"Build "+b.n.match(/\b(\d+)\b/)[1]:b.n;
  const keyOf=p=>role+"|"+p.g+"|"+p.ne;
  let tab=String(Tt.builds[0].id),open=null;
  const m=document.createElement("div");m.className="tm-md";m.style.setProperty("--tc",ec(c.element));
  m.innerHTML=`<div class="tm-mh"><div class="tm-mt"><b>${e(c.name)} · Potenciales</b><button class="chip" data-x="1">Listo</button></div><div class="tm-hint" id="tm-cnt"></div>
   <div class="tm-fl">${Tt.builds.map(b=>`<button class="chip" data-t="${b.id}">${e(bn(b))}</button>`).join("")}<button class="chip" data-t="sel">Elegidos</button></div></div><div class="tm-mb"></div>`;
  document.body.appendChild(m);
  const B=m.querySelector(".tm-mb");
  const pk=p=>{const k=keyOf(p),v=S.p[k],mx=Math.max(1,...p.v.map(a=>a.length));
    return `<div class="tm-pk${v?" on":""}" data-k="${e(k)}"><img class="tm-pi" src="${e(p.iu||"")}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.visibility='hidden'">
     <div class="tm-pq"><h5>${e(p.n)}</h5><small>${p.t<3?"Núcleo":"Común"}${mx>1?" · hasta nivel "+mx:""}</small>
     <p class="tm-d${open===k?" x":""}" data-a="ex">${open===k?tpl(p.s,p.v,(v?v.l:1)-1):tpl(p.b)}</p>
     ${v?`<div class="tm-ctl">${mx>1?`<select data-a="lv" aria-label="Nivel">${Array.from({length:mx},(_, i)=>`<option value="${i+1}"${v.l===i+1?" selected":""}>Nivel ${i+1}</option>`).join("")}</select>`:""}<div class="tm-seg">${["c","m","o"].map(x=>`<button data-a="pr" data-v="${x}" class="${v.pr===x?"on":""}">${PRI[x]}</button>`).join("")}</div></div>`:""}</div>
     <div class="tm-ck" data-a="tg">✓</div></div>`};
  const pint=()=>{
    const y=B.scrollTop,nsel=Object.keys(S.p).length;
    m.querySelector("#tm-cnt").textContent=nsel?nsel+" elegido(s). Toca un potencial para elegirlo; luego define su nivel y prioridad.":"Toca un potencial para elegirlo; luego define su nivel y prioridad.";
    m.querySelectorAll("[data-t]").forEach(b=>b.classList.toggle("on",b.dataset.t===tab));
    let h="";
    if(tab==="sel"){const L=Tt.l.filter(p=>S.p[keyOf(p)]);h=L.length?L.map(pk).join(""):"<p class='nota'>Aún no eliges ninguno.</p>"}
    else{const L=Tt.l.filter(p=>String(p.g)===tab),b=Tt.builds.find(x=>String(x.id)===tab);
      if(b&&b.d)h+=`<p class="fk-bd">${e(b.d)}</p>`;
      const nu=L.filter(p=>p.t<3),co=L.filter(p=>p.t===3);
      if(nu.length)h+=`<h4 class="fk-h">Núcleo</h4>`+nu.map(pk).join("");
      if(co.length)h+=`<h4 class="fk-h">Comunes</h4>`+co.map(pk).join("")}
    B.innerHTML=h;B.scrollTop=y};
  m.onclick=ev=>{
    if(ev.target.closest("[data-x]")){m.remove();if(mode==="edit")vEdit();return}
    const t=ev.target.closest("[data-t]");if(t){tab=t.dataset.t;B.scrollTop=0;pint();return}
    const row=ev.target.closest(".tm-pk");if(!row)return;const k=row.dataset.k,a=ev.target.closest("[data-a]"),act=a&&a.dataset.a;
    if(act==="lv")return;
    const p=Tt.l.find(x=>keyOf(x)===k);
    if(act==="pr"){S.p[k].pr=a.dataset.v}
    else if(act==="ex"){open=open===k?null:k}
    else{if(S.p[k])delete S.p[k];else S.p[k]={l:1,pr:p.t===1?"c":"m"}}
    pint()};
  m.onchange=ev=>{const a=ev.target.closest("[data-a=lv]");if(!a)return;const k=a.closest(".tm-pk").dataset.k;S.p[k].l=+a.value;pint()};
  pint();
}

/* ---------- lista ---------- */
function vList(){
  mode="list";T=null;const A=ST.teams;
  root.innerHTML=`<div class="tm-hero"><h3>Arma tu equipo</h3><p>Elige 3 Trekkers, sus potenciales y los discos. Guárdalo y consúltalo cuando quieras.</p><button class="btn" data-a="new" style="margin:0">+ Nuevo equipo</button></div>`+
  (A.length?A.map(t=>{const c0=charOf(t.slots[0].c);return `<div class="tm-card" data-a="view" data-id="${t.id}"><div class="tm-ctop" style="background:linear-gradient(90deg,${t.slots.map(s=>{const c=charOf(s.c);return c?ec(c.element):"#3a3660"}).join(",")})"></div><div class="tm-cb"><h4>${e(t.name||"Equipo sin nombre")}</h4><div class="tm-th">${t.slots.map(s=>{const c=charOf(s.c);return c?`<img src="${e(c.imageUrl)}" alt="${e(c.name)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.visibility='hidden'" style="border-color:${ec(c.element)}">`:`<i></i>`}).join("")}<span class="tm-cm">${t.discs.filter(Boolean).length} discos${t.score?"<br>Récord: "+e(t.score):""}</span></div></div></div>`}).join(""):`<p class="nota">Aún no tienes equipos guardados.</p>`)+
  `<div class="tm-io"><button class="btn out" data-a="exp">Exportar todo</button><button class="btn out" data-a="imp">Importar</button></div><div id="tm-io-box"></div>
   <p class="nota" style="margin-top:12px">Tus equipos se guardan solo en este dispositivo. Para pasarlos a otro, usa Exportar/Importar o copia el código de cada equipo.</p>
   <a class="btn out" href="#builds" data-nav="builds">Builds de la comunidad</a>`;
}
const code=t=>"SSV2:"+btoa(unescape(encodeURIComponent(JSON.stringify(t))));
function parse(txt){
  txt=txt.trim();let j;
  try{j=JSON.parse(txt)}catch(x){const m=txt.replace(/^SSV\d:/,"").trim();try{j=JSON.parse(decodeURIComponent(escape(atob(m))))}catch(y){return null}}
  const a=Array.isArray(j)?j:(j&&j.teams)?j.teams:[j];
  return a.filter(t=>t&&Array.isArray(t.slots)).map(t=>{t=fix(JSON.parse(JSON.stringify(t)));t.id=uid();return t});
}
async function copiar(txt,box,msg){let ok=false;try{await navigator.clipboard.writeText(txt);ok=true}catch(x){}
  box.innerHTML=`<p class="nota">${ok?msg+" Copiado al portapapeles.":"No pude copiar solo; selecciona el texto y cópialo."}</p><textarea class="tm-tb" readonly>${e(txt)}</textarea>`}
function descarga(txt,nombre){try{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([txt],{type:"application/json"}));a.download=nombre;document.body.appendChild(a);a.click();a.remove()}catch(x){}}

/* ---------- piezas compartidas editor / ficha ---------- */
const sortedPots=(S,F)=>{
  if(!F||!F.potenciales)return[];const role=S.__r,Tt=F.potenciales[role]||F.potenciales.main,out=[];
  for(const p of Tt.l){const v=S.p[role+"|"+p.g+"|"+p.ne];if(v)out.push({p,v})}
  return out.sort((a,b)=>PORD[a.v.pr]-PORD[b.v.pr]||a.p.t-b.p.t)};
function potLines(list){return list.map(({p,v})=>`<div class="tm-pl">${p.iu?`<img src="${e(p.iu)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">`:""}<div class="tm-n"><b>${e(p.n)}</b></div><span class="tm-lvc">LV ${v.l}</span><span class="tm-tg tm-pr-${v.pr}">${PRI[v.pr]}</span></div>`).join("")}
function banner(s,ed){
  const S=T.slots[s],c=charOf(S.c);
  return `<div class="tm-bn" style="--tc:${ec(c.element)}"><img class="tm-av" src="${e(c.imageUrl)}" alt="" referrerpolicy="no-referrer" onerror="this.style.visibility='hidden'"><div><h4>${e(c.name)}</h4><div class="tm-m"><span>${star(c.rarity,13)}</span><span>${eli(c.element)}${e(c.element)}</span></div></div>${ed?`<div class="tm-bx"><button data-a="char" data-s="${s}">Cambiar</button><button data-a="cx" data-s="${s}">Quitar</button></div>`:""}</div>`;
}
function discTile(i,ed){
  const D=T.discs[i],d=D&&discOf(D.n);
  if(!D)return ed?`<button class="tm-dt" data-a="disc" data-i="${i}" aria-label="Elegir disco">+</button>`:"";
  return `<div class="tm-dt f" style="--tc:${ec(d&&d.element)}"${ed?` data-a="disc" data-i="${i}"`:""}>${d?`<img src="${e(d.imageUrl)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.visibility='hidden'">`:""}<span class="tm-dn">${e(D.n)}</span>${ed?`<span class="tm-dx" data-a="dx" data-i="${i}">✕</span><select class="tm-da" data-a="asc" data-i="${i}" aria-label="Ascensión">${[0,1,2,3,4,5,6,7,8].map(a=>`<option value="${a}"${a===D.a?" selected":""}>${a===0?"Asc 0":"Asc "+a}</option>`).join("")}</select>`:`<span class="tm-da" style="position:absolute;top:3px;left:3px;padding:2px 6px">Asc ${D.a}</span>`}</div>`;
}
async function notasHtml(){
  const I=await getIdx(),tot={},hs=[];let n=0;
  for(const D of T.discs){if(!D)continue;n++;const F=await getD(D.n);if(!F)continue;const nf=(F.nf||[]).find(x=>x.f===D.a);if(nf)for(const k in nf.n)tot[k]=(tot[k]||0)+nf.n[k];hs.push({D,F})}
  if(!n)return"";
  const ks=Object.keys(tot);
  return `<div class="tm-dh"><b>Notas del equipo</b><small>estimación</small></div><div class="tm-nt">${ks.length?ks.map(k=>{const r=I.notas[k]||{};return `<span>${r.ic?`<img src="${e(r.ic)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">`:""}${e((r.n||k).replace(/^Melodía de /,""))} <b>×${tot[k]}</b></span>`}).join(""):"<span>Sin notas</span>"}</div>
   <div class="tm-sec">`+hs.map(({D,F})=>(F.arm||[]).map(a=>{let lv=0;(a.nt||[]).forEach((req,j)=>{if(Object.keys(req).every(k=>(tot[k]||0)>=req[k]))lv=j+1});
     return `<div class="kv"><span>${e(a.n)}<br><small class="nota">${e(D.n)}</small></span><b style="flex:0 0 auto;text-align:right;color:${lv?"var(--a)":"var(--t2)"}">${lv?"Nivel "+lv+" / "+a.v.length:"Sin activar"}</b></div>`}).join("")).join("")+`<p class="nota">Suma las notas de todos los discos elegidos a su ascensión y calcula hasta qué nivel llegaría cada armonía.</p></div>`;
}

/* ---------- editor ---------- */
function slotHtml(s){
  const S=T.slots[s],c=charOf(S.c);S.__r=s===0?"main":"support";
  return `<div class="tm-sl" data-s="${s}"><div class="tm-lab">${ROLE[s]}</div>`+(c?banner(s,true)+`<div class="tm-pb"><div class="tm-pbh"><span>Potenciales · <span id="tm-pc${s}">0</span></span><button class="tm-add" style="--tc:${ec(c.element)}" data-a="pots" data-s="${s}">Editar</button></div><div id="tm-pl${s}"><p class="tm-hint">Cargando…</p></div></div>`
   :`<button class="tm-empty" data-a="char" data-s="${s}"><b>+</b>Elegir Trekker</button>`)+`</div>`;
}
async function pintaPots(s,esVista){
  const S=T.slots[s],box=root.querySelector("#tm-pl"+s),cnt=root.querySelector("#tm-pc"+s);if(!S.c||!box)return;
  const F=await getF(S.c);if(!box.isConnected)return;
  const L=sortedPots(S,F);if(cnt)cnt.textContent=L.length;
  box.innerHTML=L.length?potLines(L):`<p class="tm-hint">${esVista?"Sin potenciales.":"Aún sin potenciales. Toca “Editar” para elegirlos (opcional)."}</p>`;
}
async function pintaNotas(){const b=root.querySelector("#tm-notes");if(b)b.innerHTML=await notasHtml()}
function vEdit(){
  mode="edit";const y=window.scrollY;
  root.innerHTML=`<button class="tm-bk" data-a="back">‹ Mis equipos</button>
   <input class="tm-in tm-name" id="tm-name" placeholder="Ponle nombre a tu equipo" maxlength="60" value="${e(T.name)}">
   ${[0,1,2].map(slotHtml).join("")}
   <div class="tm-sl"><div class="tm-dh"><b>Discos principales</b><small>${T.discs.slice(0,3).filter(Boolean).length}/3</small></div><div class="tm-dg">${[0,1,2].map(i=>discTile(i,true)).join("")}</div>
    <div class="tm-dh"><b>De apoyo y recomendados</b><small>${T.discs.slice(3).filter(Boolean).length}/6</small></div><div class="tm-dg">${[3,4,5,6,7,8].map(i=>discTile(i,true)).join("")}</div><div id="tm-notes"></div></div>
   <div class="tm-sl"><div class="tm-dh"><b>Récord y notas</b><small>opcional</small></div><div class="tm-sec"><input class="tm-in" id="tm-score" inputmode="numeric" placeholder="Tu récord (puntaje)" maxlength="20" value="${e(T.score)}"><textarea class="tm-ta" id="tm-note" placeholder="Cómo se juega, qué tomar si no sale un potencial, rotación…" maxlength="500">${e(T.note)}</textarea></div></div>
   <button class="btn" data-a="save">Guardar equipo</button>
   <div class="tm-act"><button class="btn out" data-a="vv">Ver ficha</button><button class="btn out" data-a="code">Copiar código</button></div><button class="btn out" data-a="gcode">Código de preset del juego</button><div id="tm-io-box"></div>`;
  [0,1,2].forEach(s=>pintaPots(s));pintaNotas();window.scrollTo(0,y);
}
function leer(){if(mode!=="edit")return;const a=root.querySelector("#tm-name");if(!a)return;T.name=a.value.trim();T.score=root.querySelector("#tm-score").value.trim();T.note=root.querySelector("#tm-note").value}
function clean(){const cp=JSON.parse(JSON.stringify(T));cp.slots.forEach(s=>delete s.__r);return cp}
function guardar(){
  leer();const i=ST.teams.findIndex(x=>x.id===T.id),cp=clean();
  if(!cp.name)cp.name="Equipo "+(ST.teams.length+(i<0?1:0));
  if(i<0)ST.teams.unshift(cp);else ST.teams[i]=cp;T.name=cp.name;return save();
}
function flash(t){const b=root.querySelector("[data-a=save]");if(!b)return;const o=b.textContent;b.textContent=t;setTimeout(()=>{b.textContent=o},1500)}

/* ---------- ficha (vista) ---------- */
function vView(){
  mode="view";
  root.innerHTML=`<button class="tm-bk" data-a="back">‹ Mis equipos</button>
   <div class="tm-fh"><div class="nota" style="margin:0">FICHA DE EQUIPO</div><h3>${e(T.name||"Equipo sin nombre")}</h3>${T.score?`<p>Récord: <b>${e(T.score)}</b></p>`:""}${T.note?`<p>${e(T.note)}</p>`:""}</div>
   ${[0,1,2].map(s=>{T.slots[s].__r=s===0?"main":"support";const c=charOf(T.slots[s].c);return `<div class="tm-sl"><div class="tm-lab">${ROLE[s]}</div>`+(c?banner(s,false)+`<div class="tm-pb"><div class="tm-pbh"><span>Potenciales · <span id="tm-pc${s}">0</span></span></div><div id="tm-pl${s}"></div></div>`:`<p class="tm-hint" style="padding:12px">Sin personaje.</p>`)+`</div>`}).join("")}
   <div class="tm-sl"><div class="tm-dh"><b>Discos principales</b></div><div class="tm-dg">${[0,1,2].map(i=>discTile(i,false)||"").join("")}</div>
    ${T.discs.slice(3).some(Boolean)?`<div class="tm-dh"><b>De apoyo y recomendados</b></div><div class="tm-dg">${[3,4,5,6,7,8].map(i=>discTile(i,false)).join("")}</div>`:""}<div id="tm-notes"></div></div>
   <button class="btn" data-a="edit">Editar equipo</button>
   <div class="tm-act"><button class="btn out" data-a="code">Copiar código</button><button class="btn out" data-a="gcode">Preset del juego</button><button class="btn out" data-a="dup">Duplicar</button><button class="btn out" data-a="del">Eliminar</button></div><div id="tm-io-box"></div>`;
  [0,1,2].forEach(s=>pintaPots(s,true));pintaNotas();window.scrollTo(0,0);
}

function onClick(ev){
  const el=ev.target.closest("[data-a]");if(!el)return;const a=el.dataset.a;
  if(a==="asc")return;
  if(a==="new"){T=nuevo();vEdit()}
  else if(a==="view"){T=fix(JSON.parse(JSON.stringify(ST.teams.find(x=>x.id===el.dataset.id))));vView()}
  else if(a==="edit"){vEdit()}
  else if(a==="vv"){guardar();vView()}
  else if(a==="back"){vList()}
  else if(a==="save"){flash(guardar()?"✓ Guardado":"No se pudo guardar")}
  else if(a==="del"){if(confirm("¿Eliminar este equipo?")){ST.teams=ST.teams.filter(x=>x.id!==T.id);save();vList()}}
  else if(a==="dup"){const c=clean();c.id=uid();c.name=(c.name||"Equipo")+" (copia)";ST.teams.unshift(c);save();vList()}
  else if(a==="code"){leer();copiar(code(clean()),root.querySelector("#tm-io-box"),"Código del equipo.")}
  else if(a==="gcode"){leer();const bx=root.querySelector("#tm-io-box");bx.innerHTML='<p class="nota">Generando…</p>';gameCode().then(c=>{if(!c)bx.innerHTML='<p class="nota">Elige los 3 personajes para generar el código de preset del juego.</p>';else copiar(c,bx,"Código de preset del juego (incluye los 3 personajes y sus potenciales; no incluye discos).")})}
  else if(a==="exp"){const t=JSON.stringify({v:2,teams:ST.teams});copiar(t,root.querySelector("#tm-io-box"),"Todos tus equipos.");descarga(t,"equipos-stella-sora.json")}
  else if(a==="imp"){const b=root.querySelector("#tm-io-box");b.innerHTML=`<p class="nota">Pega aquí un código de equipo, un código de preset del juego o el texto exportado, o elige el archivo.</p><textarea class="tm-tb" id="tm-imp-t"></textarea><input type="file" id="tm-imp-f" accept=".json,.txt" style="margin:8px 0"><button class="btn" data-a="imp2">Importar</button><p class="nota" id="tm-imp-m"></p>`;
    b.querySelector("#tm-imp-f").onchange=async f=>{const x=f.target.files[0];if(x)b.querySelector("#tm-imp-t").value=await x.text()}}
  else if(a==="imp2"){const txt=root.querySelector("#tm-imp-t").value,m=root.querySelector("#tm-imp-m");
    gameDecode(txt).then(g=>{const r=g?[g]:parse(txt);
      if(!r||!r.length){m.textContent="No reconocí ese código o archivo.";return}
      ST.teams=r.concat(ST.teams);save();vList()})}
  else if(a==="char"){const s=+el.dataset.s;picker("Elegir Trekker",charItems(),it=>{leer();const old=T.slots[s];T.slots[s]={c:it.id,p:old&&old.c===it.id?old.p:{}};vEdit()})}
  else if(a==="cx"){leer();T.slots[+el.dataset.s]={c:"",p:{}};vEdit()}
  else if(a==="pots"){leer();potModal(+el.dataset.s)}
  else if(a==="disc"){const i=+el.dataset.i;picker("Elegir disco",discItems(),it=>{leer();T.discs[i]={n:it.n,a:(T.discs[i]&&T.discs[i].a)||8};vEdit()},{sq:true})}
  else if(a==="dx"){ev.stopPropagation();leer();T.discs[+el.dataset.i]=null;vEdit()}
}
function onChange(ev){const el=ev.target;if(el.dataset&&el.dataset.a==="asc"){T.discs[+el.dataset.i].a=+el.value;pintaNotas()}}
window.teamsShow=function(){
  root=document.getElementById("teams-root");if(!root)return;
  if(!root._ok){root._ok=1;root.addEventListener("click",onClick);root.addEventListener("change",onChange)}
  ST=load();vList();
};
})();
