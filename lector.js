/* Lector de historias (prueba). Abre con abrirLector("STm01_01"). */
(function(){
const FILE="https://stellasora.miraheze.org/wiki/Special:FilePath/";
const SEX={"==SEX==":["ella","él"],"==SEX1==":["Ella","Él"],"==SEX2==":["Su","Su"],"==SEX3==":["su","su"],"==SEX4==":["ella","él"],"==SEX5==":["suya","suyo"],"==SEX6==":["Sra.","Sr."],"==SEX7==":["Srta.","Sr."],"==SEX8==":["sí misma","sí mismo"],"==SEX9==":["chica","chico"],"==SEX10==":["hermanas","hermanos"],"==SEX11==":["señora","señor"],"==SEX12==":["Señora","Señor"],"==SEX13==":["dama","caballero"],"==SEX14==":["cabello blanco","cabello negro"],"==SEX15==":["mujer","hombre"],"==SEX16==":["bruja","brujo"],"==SEX17==":["Señorita","Señor"],"==SEX18==":["falda","pantalón"],"==SEX19==":["criada","mayordomo"],"==SEX20==":["camisa","camiseta"],"==SEX21==":["dama","caballero"]};
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const css=`#rd{position:fixed;inset:0;z-index:99999;background:#000;display:none;flex-direction:column;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;--u:7px;font-family:"Nunito","Segoe UI",system-ui,sans-serif;font-size:calc(var(--u)*3.6)}
#rd.rot{inset:auto;top:0;left:0;width:100vh;height:100vw;width:100dvh;height:100dvw;transform-origin:top left;transform:rotate(90deg) translateY(-100%)}
#rd.on{display:flex}
#rd .rd-st{position:relative;flex:1;overflow:hidden;background:#0a0818}
#rd .rd-bg{position:absolute;inset:0;background-size:cover;background-position:center;transition:background-image .3s}
#rd .rd-sp{position:absolute;bottom:-50%;height:145%;transform:translateX(-50%);animation:rdIn .35s;pointer-events:none}
@keyframes rdIn{from{opacity:0}to{opacity:1}}
#rd .rd-out{position:absolute;top:calc(var(--u)*2.6);left:calc(var(--u)*3);z-index:5;color:#fff;font-weight:800;font-size:calc(var(--u)*3.6);text-shadow:0 1px 4px rgba(0,0,0,.7);background:none;border:0;padding:0}
#rd .rd-bar{position:absolute;top:calc(var(--u)*2);right:calc(var(--u)*2.5);z-index:5;display:flex;align-items:center;background:rgba(255,255,255,.88);border-radius:99px;box-shadow:0 2px 8px rgba(0,0,0,.25)}
#rd .rd-bar button{background:none;border:0;color:#1f2a4d;font:inherit;font-weight:800;font-size:calc(var(--u)*3);padding:calc(var(--u)*1.8) calc(var(--u)*3);border-right:1px solid rgba(31,42,77,.15);display:flex;align-items:center;gap:calc(var(--u)*1)}
#rd .rd-bar button:last-child{border-right:0}
#rd .rd-bar svg{width:calc(var(--u)*4);height:calc(var(--u)*4);fill:none;stroke:#1f2a4d;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
#rd .rd-box{position:absolute;left:19%;right:19%;bottom:calc(var(--u)*4);min-height:calc(var(--u)*24);background:rgba(250,250,255,.86);background-image:radial-gradient(rgba(120,120,170,.10) 1px,transparent 1.2px);background-size:4px 4px;border:2px solid #fff;border-radius:calc(var(--u)*3);box-shadow:0 3px 12px rgba(0,0,0,.25);padding:calc(var(--u)*3.6) calc(var(--u)*4.4) calc(var(--u)*3.2);color:#1f2a4d;z-index:4;box-sizing:border-box}
#rd .rd-nm{position:absolute;top:calc(var(--u)*-6.2);left:calc(var(--u)*-3);min-width:calc(var(--u)*32);text-align:center;background:#e9e7f6;color:#1f2a4d;font-weight:800;font-size:calc(var(--u)*3.9);padding:calc(var(--u)*1.2) calc(var(--u)*4);border-radius:calc(var(--u)*1) calc(var(--u)*1) 0 0;border-bottom:calc(var(--u)*.8) solid #a99be8;box-shadow:calc(var(--u)*.8) 0 0 #a99be8}
#rd .rd-nm:empty{display:none}
#rd .rd-tx{font-size:calc(var(--u)*4.1);line-height:1.5;font-weight:700;white-space:pre-wrap;letter-spacing:.01em}
#rd .rd-tx.nar{color:#2b3566}
#rd .rd-nx{position:absolute;right:calc(var(--u)*3);bottom:calc(var(--u)*1.6);width:calc(var(--u)*3.4);height:calc(var(--u)*3.4);animation:rdBl 1s infinite}
#rd .rd-nx svg{width:100%;height:100%;fill:#16b6bf}
@keyframes rdBl{50%{opacity:.25}}
#rd .rd-card{position:absolute;inset:0;z-index:6;background:rgba(10,12,30,.9);display:none;flex-direction:column;justify-content:center;align-items:center;padding:calc(var(--u)*4) calc(var(--u)*10);text-align:center;color:#fff;overflow:auto}
#rd .rd-card.on{display:flex}
#rd .rd-card h2{font-size:calc(var(--u)*5.5);margin:6px 0 calc(var(--u)*2)}
#rd .rd-card p{line-height:1.55;color:#e3e0f5;max-width:60em;font-size:calc(var(--u)*3.8);font-weight:600}
#rd .rd-card small{letter-spacing:.2em;text-transform:uppercase;color:#f3c969;font-size:calc(var(--u)*3);font-weight:800}
#rd .rd-ch{display:flex;flex-direction:column;gap:calc(var(--u)*1.8);width:100%;max-width:64%;margin-top:6px}
#rd .rd-ch button{background:rgba(250,250,255,.92);border:2px solid #fff;color:#1f2a4d;font:inherit;font-weight:800;border-radius:calc(var(--u)*2.4);padding:calc(var(--u)*2.2);font-size:calc(var(--u)*3.9);box-shadow:0 2px 8px rgba(0,0,0,.3)}
#rd .rd-card .rd-b{background:#e9e7f6;border:2px solid #fff;color:#1f2a4d;font:inherit;font-weight:800;border-radius:calc(var(--u)*2.4);padding:calc(var(--u)*1.8) calc(var(--u)*8);font-size:calc(var(--u)*3.8)}
#rd .rd-log{align-items:stretch;justify-content:flex-start;text-align:left;overflow:auto}
#rd .rd-log div{margin-bottom:calc(var(--u)*1.6);line-height:1.45;font-size:calc(var(--u)*3.6);font-weight:600}#rd .rd-log b{color:#f3c969;display:block;font-size:calc(var(--u)*2.9)}`;
let el=null,S=null;
/* ---------- audio ---------- */
const BG=new Audio();BG.loop=true;BG.preload="none";let bgCur="",fT=0;
function fadeTo(v,ms,done){
  clearInterval(fT);const a=BG.volume,st=Math.max(1,ms/40);let n=0;
  fT=setInterval(()=>{n++;BG.volume=Math.max(0,Math.min(1,a+(v-a)*n/st));if(n>=st){clearInterval(fT);done&&done()}},40);
}
function bgm(code){
  if(S&&S.mute)return;
  if(!code){bgCur="";fadeTo(0,1200,()=>BG.pause());return}
  const m=/^m(\d+)$/.exec(code);if(!m)return;
  const u=FILE+"Bgm"+m[1]+".ogg";if(bgCur===u)return;bgCur=u;
  fadeTo(0,250,()=>{BG.src=u;BG.play().then(()=>fadeTo(.5,900)).catch(()=>{})});
}
function se(n){
  if(!S||S.mute)return;
  try{const a=new Audio(FILE+n+".ogg");a.volume=.6;a.play().catch(()=>{})}catch(e){}
}
function mute(){
  S.mute=S.mute?0:1;try{localStorage.setItem("rdm",S.mute)}catch(e){}
  if(S.mute){clearInterval(fT);BG.pause();bgCur=""}
  btnM();
}
function btnM(){const b=el.querySelector('[data-a="m"]');if(b)b.innerHTML=S.mute?"Sonido: no":"Sonido: sí"}
function pararAudio(){clearInterval(fT);BG.pause();bgCur=""}
/* ---------- interfaz ---------- */
function build(){
  if(el)return;
  const st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
  const fl=document.createElement("link");fl.rel="stylesheet";fl.href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800&display=swap";document.head.appendChild(fl);
  el=document.createElement("div");el.id="rd";
  el.innerHTML=`<div class="rd-st"><div class="rd-bg"></div><div class="rd-chars"></div>
   <button class="rd-out" data-a="x">✕ Salir</button>
   <div class="rd-bar"><button data-a="m"></button><button data-a="g"></button><button data-a="l"><svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9zM8.5 12h7M8.5 16h5"/></svg></button></div>
   <div class="rd-box"><span class="rd-nm"></span><div class="rd-tx"></div><span class="rd-nx"><svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 11 7 11s7-6 7-11a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg></span></div>
   <div class="rd-card" id="rd-c"></div></div>`;
  document.body.appendChild(el);
  el.addEventListener("click",e=>{
    const a=e.target.closest("[data-a]");
    if(a){const k=a.dataset.a;
      if(k==="x")cierra();else if(k==="g")gen();else if(k==="l")log();else if(k==="m")mute();else if(k==="lx"){card(false);}
      else if(k==="c"){pick(+a.dataset.i)}else if(k==="ok"){card(false);avanza()}
      return}
    if(e.target.closest(".rd-card"))return;
    avanza();
  });
}
function fit(){
  if(!el)return;
  const por=window.innerHeight>window.innerWidth;
  el.classList.toggle("rot",por);
  const h=por?window.innerWidth:window.innerHeight;
  el.style.setProperty("--u",(h/100)+"px");
}
window.addEventListener("resize",()=>{if(el&&el.classList.contains("on"))fit()});
function cierra(){if(S&&S.timer)clearInterval(S.timer);pararAudio();el.classList.remove("on");S=null;
  try{if(screen.orientation&&screen.orientation.unlock)screen.orientation.unlock()}catch(e){}
  try{if(document.fullscreenElement)document.exitFullscreen()}catch(e){}}
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
  const l=[FILE+cap(n)+".png",FILE+cap(n)+".jpg"];
  const probar=i=>{
    if(i>=l.length){bg.style.backgroundImage="none";bg.style.background="radial-gradient(circle at 50% 30%,#2a1f55,#0a0818)";return}
    const im=new Image();
    im.onload=()=>{bg.style.background="";bg.style.backgroundSize="cover";bg.style.backgroundPosition="center";bg.style.backgroundImage="url('"+l[i]+"')"};
    im.onerror=()=>probar(i+1);im.referrerPolicy="no-referrer";im.src=l[i];
  };probar(0);
}
function spriteList(id,pose,expr){
  const base0=id==="avg3_100"?(S.g?"Male":"Female")+"_tyrant":(S.names[id]||"").trim();
  if(!base0||base0==="???")return null;
  const base=base0.replace(/ /g,"_"),p=pose||"a",out=[];
  const n=parseInt(expr,10);
  if(!isNaN(n))out.push(FILE+base+"_"+p+"_"+String(n).padStart(2,"0")+".png");
  out.push(FILE+base+"_"+p+"_02.png");
  if(id!=="avg3_100"){let c=null;try{c=CHARS.find(x=>x.name===base0)}catch(e){}out.push(c&&c.imageUrl?c.imageUrl:FILE+base+".png")}
  return out;
}
function pon(im,l){im.dataset.q=JSON.stringify(l.slice(1));im.src=l[0]}
function setChar(id,pose,expr,x){
  const l=spriteList(id,pose,expr);if(!l)return;
  const box=el.querySelector(".rd-chars");let im=S.chars[id];
  if(!im){im=document.createElement("img");im.className="rd-sp";im.referrerPolicy="no-referrer";
    im.onerror=()=>{const q=JSON.parse(im.dataset.q||"[]");if(q.length){im.src=q.shift();im.dataset.q=JSON.stringify(q)}else{im.remove();if(S.chars[id]===im)delete S.chars[id]}};
    box.appendChild(im);S.chars[id]=im}
  im.dataset.pose=pose||"a";pon(im,l);
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
      case"bgm":bgm(s[1]);break;
      case"se":se(s[1]);break;
      case"show":setChar(s[1],s[2],s[3],s[4]);break;
      case"expr":{const im=S.chars[s[1]];if(im){const l=spriteList(s[1],im.dataset.pose,s[2]);if(l)pon(im,l)}break}
      case"hide":{const im=S.chars[s[1]];if(im){im.remove();delete S.chars[s[1]]}break}
      case"clear":hideAll();break;
      case"intro":card('<small>'+esc(s[1])+'</small><h2>'+esc(s[2])+'</h2><p>'+esc(s[3])+'</p><button class="rd-b" data-a="ok" style="margin-top:18px">Comenzar</button>');return;
      case"head":card('<p style="font-size:1.1rem">'+esc(s[1])+'</p><button class="rd-b" data-a="ok" style="margin-top:18px">Continuar</button>');return;
      case"say":say(s[1],s[2]);return;
      case"choice":S.choice={o:s[1],b:s[2]};card('<div class="rd-ch">'+s[1].map((o,i)=>'<button data-a="c" data-i="'+i+'">'+esc(fx(o))+'</button>').join("")+'</div>');return;
      case"end":fin();return;
    }
  }
}
function fin(){pararAudio();card('<small>Fin de esta escena</small><h2>Prueba del lector</h2><p>Esto es una versión de prueba. Cuéntame qué te pareció.</p><button class="rd-b" data-a="x" style="margin-top:18px">Cerrar</button>')}
window.abrirLector=async function(id){
  build();
  try{const st=document.getElementById("bgm-st");if(st&&document.getElementById("bgmbar").classList.contains("on"))st.click()}catch(e){}
  try{const de=document.documentElement;if(de.requestFullscreen)await de.requestFullscreen({navigationUI:"hide"})}catch(e){}
  try{if(screen.orientation&&screen.orientation.lock)await screen.orientation.lock("landscape")}catch(e){}
  let d;try{const r=await fetch("lector-"+id+".json");if(!r.ok)throw 0;d=await r.json()}catch(e){alert("No se pudo cargar la historia.");return}
  let g=1,m=0;try{const v=localStorage.getItem("rdg");if(v!=null)g=+v;m=+(localStorage.getItem("rdm")||0)}catch(e){}
  S={names:d.names,stack:[{a:d.steps,i:0}],chars:{},log:[],g:g,mute:m,timer:0,card:0,choice:null};
  el.querySelector(".rd-tx").textContent="";el.querySelector(".rd-nm").textContent="";
  el.querySelector(".rd-chars").innerHTML="";el.querySelector(".rd-bg").style.cssText="";
  btnG();btnM();card(false);el.classList.add("on");fit();setTimeout(fit,400);avanza();
};
})();
