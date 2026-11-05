/* Lector de historias (prueba). Abre con abrirLector("STm01_01"). */
(function(){
const FILE="https://stellasora.miraheze.org/wiki/Special:FilePath/";
const SEX={"==SEX==":["ella","él"],"==SEX1==":["Ella","Él"],"==SEX2==":["Su","Su"],"==SEX3==":["su","su"],"==SEX4==":["ella","él"],"==SEX5==":["suya","suyo"],"==SEX6==":["Sra.","Sr."],"==SEX7==":["Srta.","Sr."],"==SEX8==":["sí misma","sí mismo"],"==SEX9==":["chica","chico"],"==SEX10==":["hermanas","hermanos"],"==SEX11==":["señora","señor"],"==SEX12==":["Señora","Señor"],"==SEX13==":["dama","caballero"],"==SEX14==":["cabello blanco","cabello negro"],"==SEX15==":["mujer","hombre"],"==SEX16==":["bruja","brujo"],"==SEX17==":["Señorita","Señor"],"==SEX18==":["falda","pantalón"],"==SEX19==":["criada","mayordomo"],"==SEX20==":["camisa","camiseta"],"==SEX21==":["dama","caballero"]};
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const css=`#rd{position:fixed;inset:0;z-index:99999;background:#000;display:none;flex-direction:column;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent}
#rd.on{display:flex}
#rd .rd-st{position:relative;flex:1;overflow:hidden;background:#0a0818}
#rd .rd-bg{position:absolute;inset:0;background-size:cover;background-position:center;transition:opacity .5s,background-image .3s}
#rd .rd-sp{position:absolute;bottom:0;height:82%;max-width:70%;object-fit:contain;transform:translateX(-50%);filter:drop-shadow(0 0 8px rgba(0,0,0,.6));animation:rdIn .35s}
@keyframes rdIn{from{opacity:0}to{opacity:1}}
#rd .rd-top{position:absolute;top:0;left:0;right:0;display:flex;gap:8px;padding:10px;z-index:5;justify-content:space-between}
#rd .rd-top button{background:rgba(10,8,24,.65);color:#fff;border:1px solid rgba(255,255,255,.25);border-radius:99px;padding:8px 14px;font-size:.85rem}
#rd .rd-box{position:absolute;left:10px;right:10px;bottom:10px;min-height:150px;background:rgba(14,10,32,.88);border:1px solid rgba(255,255,255,.22);border-radius:10px;padding:26px 16px 14px;color:#fff;z-index:4}
#rd .rd-nm{position:absolute;top:-14px;left:14px;background:#7b5cff;color:#fff;font-weight:700;font-size:.85rem;padding:4px 14px;border-radius:99px}
#rd .rd-nm:empty{display:none}
#rd .rd-tx{font-size:1.02rem;line-height:1.55;white-space:pre-wrap}
#rd .rd-tx.nar{font-style:italic;color:#e6e0ff}
#rd .rd-nx{position:absolute;right:14px;bottom:8px;opacity:.7;animation:rdBl 1s infinite}
@keyframes rdBl{50%{opacity:.15}}
#rd .rd-card{position:absolute;inset:0;z-index:6;background:rgba(5,3,14,.92);display:none;flex-direction:column;justify-content:center;align-items:center;padding:28px;text-align:center;color:#fff}
#rd .rd-card.on{display:flex}
#rd .rd-card h2{font-size:1.4rem;margin:6px 0 14px}
#rd .rd-card p{line-height:1.6;color:#d8d2f0;max-width:34rem}
#rd .rd-card small{letter-spacing:.2em;text-transform:uppercase;color:#f3c969}
#rd .rd-ch{display:flex;flex-direction:column;gap:10px;width:100%;max-width:30rem;margin-top:14px}
#rd .rd-ch button,#rd .rd-card .rd-b{background:rgba(123,92,255,.25);border:1px solid #9d86ff;color:#fff;border-radius:10px;padding:13px;font-size:1rem}
#rd .rd-log{align-items:stretch;justify-content:flex-start;text-align:left;overflow:auto}
#rd .rd-log div{margin-bottom:10px;line-height:1.5}#rd .rd-log b{color:#f3c969;display:block;font-size:.8rem}`;
let el=null,S=null;
function build(){
  if(el)return;
  const st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
  el=document.createElement("div");el.id="rd";
  el.innerHTML=`<div class="rd-st"><div class="rd-bg"></div><div class="rd-chars"></div>
   <div class="rd-top"><button data-a="x">✕ Cerrar</button><span style="display:flex;gap:8px"><button data-a="g"></button><button data-a="l">Registro</button></span></div>
   <div class="rd-box"><span class="rd-nm"></span><div class="rd-tx"></div><span class="rd-nx">▼</span></div>
   <div class="rd-card" id="rd-c"></div></div>`;
  document.body.appendChild(el);
  el.addEventListener("click",e=>{
    const a=e.target.closest("[data-a]");
    if(a){const k=a.dataset.a;
      if(k==="x")cierra();else if(k==="g")gen();else if(k==="l")log();else if(k==="lx"){card(false);}
      else if(k==="c"){pick(+a.dataset.i)}else if(k==="ok"){card(false);avanza()}
      return}
    if(e.target.closest(".rd-card"))return;
    avanza();
  });
}
function cierra(){if(S&&S.timer)clearInterval(S.timer);el.classList.remove("on");S=null}
function gen(){S.g=S.g?0:1;try{localStorage.setItem("rdg",S.g)}catch(e){}btnG()}
function btnG(){el.querySelector('[data-a="g"]').textContent="Protagonista: "+(S.g?"él":"ella")}
function card(h){const c=el.querySelector("#rd-c");if(h==null||h===false){c.classList.remove("on");c.innerHTML="";S.card=0;return}c.innerHTML=h;c.classList.add("on");S.card=1}
function fx(t){return t.replace(/==PLAYER_NAME==/g,"Sylar").replace(/==SEX\d*==/g,m=>SEX[m]?SEX[m][S.g]:"")}
function esc(t){return String(t).replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]))}
function log(){
  card('<div class="rd-log" style="display:block;width:100%;max-height:100%;overflow:auto"><h2>Registro</h2>'+(S.log.map(l=>"<div><b>"+esc(l[0])+"</b>"+esc(l[1])+"</div>").join("")||"<p>Aún no hay nada.</p>")+'<button class="rd-b" data-a="lx" style="margin-top:12px">Volver</button></div>');
}
function setBg(n){
  const bg=el.querySelector(".rd-bg");
  if(/^BG_Black/i.test(n)){bg.style.backgroundImage="none";bg.style.background="#000";return}
  if(/^BG_White/i.test(n)){bg.style.backgroundImage="none";bg.style.background="#fff";return}
  const u=FILE+cap(n)+".png";const im=new Image();
  im.onload=()=>{bg.style.background="";bg.style.backgroundSize="cover";bg.style.backgroundPosition="center";bg.style.backgroundImage="url('"+u+"')"};
  im.onerror=()=>{bg.style.backgroundImage="none";bg.style.background="radial-gradient(circle at 50% 30%,#2a1f55,#0a0818)"};
  im.referrerPolicy="no-referrer";im.src=u;
}
function charUrl(id){
  const nm=(S.names[id]||"").trim();if(!nm||nm==="???"||id==="avg3_100")return null;
  let c=null;try{c=CHARS.find(x=>x.name===nm)}catch(e){}
  return c&&c.imageUrl?c.imageUrl:FILE+nm.replace(/ /g,"_")+".png";
}
function setChar(id,x){
  const u=charUrl(id);if(!u)return;
  const box=el.querySelector(".rd-chars");let im=S.chars[id];
  if(!im){im=document.createElement("img");im.className="rd-sp";im.referrerPolicy="no-referrer";im.onerror=()=>{im.remove();delete S.chars[id]};im.src=u;box.appendChild(im);S.chars[id]=im}
  if(x!=null)im.style.left=Math.round(Math.min(.85,Math.max(.15,x))*100)+"%";else if(!im.style.left)im.style.left="50%";
}
function hideAll(){el.querySelector(".rd-chars").innerHTML="";S.chars={}}
function say(spk,t){
  const nm=spk==="0"?"":(S.names[spk]||"");t=fx(t);
  el.querySelector(".rd-nm").textContent=nm;
  const tx=el.querySelector(".rd-tx");tx.className="rd-tx"+(spk==="0"?" nar":"");
  S.log.push([nm||"—",t]);
  const nx=el.querySelector(".rd-nx");nx.style.display="none";
  let i=0;tx.textContent="";S.full=t;
  if(S.timer)clearInterval(S.timer);
  S.timer=setInterval(()=>{i+=2;tx.textContent=t.slice(0,i);if(i>=t.length){clearInterval(S.timer);S.timer=0;nx.style.display=""}},18);
}
function finTipeo(){clearInterval(S.timer);S.timer=0;el.querySelector(".rd-tx").textContent=S.full;el.querySelector(".rd-nx").style.display=""}
function pick(i){
  const c=S.choice;S.choice=null;card(false);
  S.log.push(["Elegiste",c.o[i]]);
  if(c.b[i])S.stack.push({a:c.b[i],i:0});
  avanza();
}
function avanza(){
  if(!S||S.card)return;
  if(S.timer){finTipeo();return}
  if(S.choice)return;
  for(;;){
    let f=S.stack[S.stack.length-1];
    if(!f){fin();return}
    if(f.i>=f.a.length){S.stack.pop();continue}
    const s=f.a[f.i++];
    switch(s[0]){
      case"bg":setBg(s[1]);break;
      case"show":setChar(s[1],s[4]);break;
      case"hide":{const im=S.chars[s[1]];if(im){im.remove();delete S.chars[s[1]]}break}
      case"clear":hideAll();break;
      case"intro":card('<small>'+esc(s[1])+'</small><h2>'+esc(s[2])+'</h2><p>'+esc(s[3])+'</p><button class="rd-b" data-a="ok" style="margin-top:18px;padding:12px 30px">Comenzar</button>');return;
      case"head":card('<p style="font-size:1.1rem">'+esc(s[1])+'</p><button class="rd-b" data-a="ok" style="margin-top:18px;padding:12px 30px">Continuar</button>');return;
      case"say":say(s[1],s[2]);return;
      case"choice":S.choice={o:s[1],b:s[2]};card('<div class="rd-ch">'+s[1].map((o,i)=>'<button data-a="c" data-i="'+i+'">'+esc(fx(o))+'</button>').join("")+'</div>');return;
      case"end":fin();return;
    }
  }
}
function fin(){card('<small>Fin de esta escena</small><h2>Prueba del lector</h2><p>Esto es una versión de prueba. Cuéntame qué te pareció.</p><button class="rd-b" data-a="x" style="margin-top:18px;padding:12px 30px">Cerrar</button>')}
window.abrirLector=async function(id){
  build();
  let d;try{const r=await fetch("lector/"+id+".json");if(!r.ok)throw 0;d=await r.json()}catch(e){alert("No se pudo cargar la historia.");return}
  let g=1;try{const v=localStorage.getItem("rdg");if(v!=null)g=+v}catch(e){}
  S={names:d.names,stack:[{a:d.steps,i:0}],chars:{},log:[],g:g,timer:0,card:0,choice:null};
  el.querySelector(".rd-tx").textContent="";el.querySelector(".rd-nm").textContent="";
  el.querySelector(".rd-chars").innerHTML="";el.querySelector(".rd-bg").style.cssText="";
  btnG();card(false);el.classList.add("on");avanza();
};
})();
