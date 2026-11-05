/* Lector de historias (prueba). Abre con abrirLector("STm01_01"). */
(function(){
const FILE="https://stellasora.miraheze.org/wiki/Special:FilePath/";
const SEX={"==SEX==":["ella","él"],"==SEX1==":["Ella","Él"],"==SEX2==":["Su","Su"],"==SEX3==":["su","su"],"==SEX4==":["ella","él"],"==SEX5==":["suya","suyo"],"==SEX6==":["Sra.","Sr."],"==SEX7==":["Srta.","Sr."],"==SEX8==":["sí misma","sí mismo"],"==SEX9==":["chica","chico"],"==SEX10==":["hermanas","hermanos"],"==SEX11==":["señora","señor"],"==SEX12==":["Señora","Señor"],"==SEX13==":["dama","caballero"],"==SEX14==":["cabello blanco","cabello negro"],"==SEX15==":["mujer","hombre"],"==SEX16==":["bruja","brujo"],"==SEX17==":["Señorita","Señor"],"==SEX18==":["falda","pantalón"],"==SEX19==":["criada","mayordomo"],"==SEX20==":["camisa","camiseta"],"==SEX21==":["dama","caballero"]};
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const css=`#rd{position:fixed;inset:0;z-index:99999;background:#000;display:none;flex-direction:column;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;--u:7px;font-family:"Nunito","Segoe UI",system-ui,sans-serif;font-size:calc(var(--u)*3.6)}
#rd.rot{inset:auto;top:0;left:0;width:100vh;height:100vw;width:100dvh;height:100dvw;transform-origin:top left;transform:rotate(90deg) translateY(-100%)}
#rd.on{display:flex}
#rd .rd-st{position:relative;flex:1;overflow:hidden;background:#0a0818}
#rd .rd-sg{position:absolute;inset:0;overflow:hidden;pointer-events:none}
#rd .rd-sg[data-s="0"]{background:#000}
#rd .rd-sg:not([data-s="0"]){opacity:0;transition:opacity .3s}
#rd .rd-sg.on{opacity:1!important}
#rd .rd-sg[data-s="3"] .rd-sgi{right:auto;width:calc(var(--u)*111.11)}
#rd .rd-sg[data-s="4"] .rd-sgi{left:auto;right:0;width:calc(var(--u)*111.11)}
#rd .rd-sl{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1}
#rd .rd-sl line{stroke:#fff;stroke-width:calc(var(--u)*.8);vector-effect:non-scaling-stroke;opacity:0;transition:opacity .3s;filter:drop-shadow(0 0 4px rgba(255,255,255,.7))}
#rd .rd-sl line.on{opacity:.95}
#rd .rd-sg[data-s="5"]{clip-path:inset(17.8% 0 46% 0)}
#rd .rd-sg[data-s="6"]{clip-path:inset(46% 0 17.8% 0)}
#rd .rd-sgi{position:absolute;inset:0;transform-origin:50% 50%;will-change:transform}
#rd .rd-bgi{position:absolute;inset:0;background-size:cover;background-position:center;transform-origin:50% 50%;will-change:transform}
#rd .rd-chars{position:absolute;inset:0}
#rd .rd-film i{position:absolute;left:0;right:0;height:12.6%;background:#000;display:none;z-index:2}
#rd .rd-film i:first-child{top:0}#rd .rd-film i:last-child{bottom:0}
#rd .rd-film.on i{display:block}
#rd .rd-box.cg{left:0;right:0;bottom:0;height:46%;min-height:0;border:0;border-radius:0;box-shadow:none;background:linear-gradient(180deg,rgba(6,10,20,0),rgba(6,10,20,.93) 30%);padding:0 16% 0 15.5%;display:flex;flex-direction:column;justify-content:flex-end;padding-bottom:calc(var(--u)*9)}
#rd .rd-box.cg .rd-nm{position:static;min-width:0;text-align:left;background:none;color:#fff;box-shadow:none;border:0;border-bottom:1px solid rgba(255,255,255,.28);border-radius:0;font-weight:700;font-size:calc(var(--u)*3.5);padding:0 0 calc(var(--u)*1.2);margin-bottom:calc(var(--u)*2);display:block}
#rd .rd-box.cg .rd-nm:empty{display:none}
#rd .rd-box.cg .rd-tx{color:#fff;font-size:calc(var(--u)*4)}
#rd .rd-box.cg .rd-nx{right:16%;bottom:calc(var(--u)*5)}#rd .rd-box.cg .rd-nx svg{fill:#fff}
#rd .rd-sp{position:absolute;bottom:-50%;height:145%;transform:translateX(-50%);animation:rdIn .35s;pointer-events:none;transition:left var(--d,0s) var(--e,linear),bottom var(--d,0s) var(--e,linear),height var(--d,0s) var(--e,linear),opacity var(--d,0s) var(--e,linear)}
#rd .rd-sp img{height:100%;width:auto;display:block}
#rd .rd-emo,#rd .rd-memo{position:absolute;font-size:calc(var(--u)*8);line-height:1;animation:rdPop .45s;pointer-events:none;filter:drop-shadow(0 1px 3px rgba(0,0,0,.5));z-index:3}
#rd .rd-emo{top:18%;right:-6%}
#rd .rd-memo{left:21%;top:calc(var(--u)*-9)}
@keyframes rdPop{0%{transform:scale(.2);opacity:0}60%{transform:scale(1.25);opacity:1}100%{transform:scale(1)}}
#rd .rd-hd{position:absolute;bottom:calc(var(--u)*30);width:calc(var(--u)*24);height:calc(var(--u)*30);overflow:hidden;border:2px solid #fff;border-radius:calc(var(--u)*3);background:rgba(250,250,255,.86);z-index:3;animation:rdIn .3s}
#rd .rd-hd img{width:170%;margin-left:-35%;display:block}
#rd .rd-hd[data-p="0"]{left:3%}#rd .rd-hd[data-p="3"]{left:15%}#rd .rd-hd[data-p="1"]{left:50%;margin-left:calc(var(--u)*-12)}#rd .rd-hd[data-p="2"]{right:3%}#rd .rd-hd[data-p="4"]{right:15%}
#rd .rd-hd .rd-emo{top:2%;right:4%;font-size:calc(var(--u)*6)}
@keyframes rdIn{from{opacity:0}to{opacity:1}}
#rd .rd-out{position:absolute;top:calc(var(--u)*2.6);left:calc(var(--u)*3 + env(safe-area-inset-left));z-index:5;color:#fff;font-weight:800;font-size:calc(var(--u)*3.6);text-shadow:0 1px 4px rgba(0,0,0,.7);background:none;border:0;padding:0}
#rd .rd-bar{position:absolute;top:calc(var(--u)*2);right:calc(var(--u)*2.5 + env(safe-area-inset-right));z-index:5;display:flex;align-items:center;background:rgba(255,255,255,.88);border-radius:99px;box-shadow:0 2px 8px rgba(0,0,0,.25)}
#rd .rd-bar button{background:none;border:0;color:#1f2a4d;font:inherit;font-weight:800;font-size:calc(var(--u)*3);padding:calc(var(--u)*1.8) calc(var(--u)*3);border-right:1px solid rgba(31,42,77,.15);display:flex;align-items:center;gap:calc(var(--u)*1)}
#rd .rd-bar button:last-child{border-right:0}
#rd .rd-bar svg{width:calc(var(--u)*4);height:calc(var(--u)*4);fill:none;stroke:#1f2a4d;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
#rd .rd-box{position:absolute;left:19%;right:19%;bottom:calc(var(--u)*4);min-height:calc(var(--u)*24);background:rgba(250,250,255,.86);background-image:radial-gradient(rgba(120,120,170,.10) 1px,transparent 1.2px);background-size:4px 4px;border:2px solid #fff;border-radius:calc(var(--u)*3);box-shadow:0 3px 12px rgba(0,0,0,.25);padding:calc(var(--u)*3.6) calc(var(--u)*4.4) calc(var(--u)*3.2);color:#1f2a4d;z-index:4;box-sizing:border-box}
#rd .rd-nm{position:absolute;top:calc(var(--u)*-6.2);left:calc(var(--u)*-3);min-width:calc(var(--u)*32);text-align:center;background:#e9e7f6;color:#1f2a4d;font-weight:800;font-size:calc(var(--u)*3.9);padding:calc(var(--u)*1.2) calc(var(--u)*4);border-radius:calc(var(--u)*1) calc(var(--u)*1) 0 0;border-bottom:calc(var(--u)*.8) solid #a99be8;box-shadow:calc(var(--u)*.8) 0 0 #a99be8}
#rd .rd-nm:empty{display:none}
#rd .rd-tx{font-size:calc(var(--u)*4.1);line-height:1.5;font-weight:700;white-space:pre-wrap;letter-spacing:.01em}
#rd .rd-tx.nar{color:#2b3566}
#rd .rd-cur{position:absolute;inset:0;background:#000;opacity:0;pointer-events:none;z-index:3}
#rd .rd-fxl{position:absolute;inset:0;pointer-events:none;z-index:2;overflow:hidden}
#rd .fx{position:absolute;inset:0}
#rd .fx-reminiscence_loop{backdrop-filter:sepia(.7) saturate(.65) contrast(.95);-webkit-backdrop-filter:sepia(.7) saturate(.65);background:radial-gradient(ellipse at center,transparent 45%,rgba(70,45,20,.55))}
#rd .fx-dream_loop{backdrop-filter:blur(1.2px) brightness(1.12);-webkit-backdrop-filter:blur(1.2px) brightness(1.12);background:radial-gradient(ellipse at center,rgba(255,255,255,.12),rgba(180,160,255,.3))}
#rd .fx-noise{opacity:.22;background:repeating-linear-gradient(0deg,rgba(255,255,255,.5) 0 1px,transparent 1px 4px);animation:rdNz .25s steps(3) infinite}
@keyframes rdNz{to{transform:translateY(6px)}}
#rd .fx-speedline_center,#rd .fx-speedline_center_w{background:repeating-conic-gradient(from 0deg at 50% 50%,transparent 0 3deg,rgba(255,255,255,.55) 3deg 3.6deg,transparent 3.6deg 7deg);-webkit-mask-image:radial-gradient(circle,transparent 28%,#000 85%);mask-image:radial-gradient(circle,transparent 28%,#000 85%);animation:rdSp .18s steps(2) infinite}
@keyframes rdSp{to{transform:rotate(2deg) scale(1.03)}}
#rd .fx-fog_2_lp,#rd .fx-sand_lp,#rd .fx-dust_heave,#rd .fx-wind_attack{background:linear-gradient(100deg,transparent,rgba(255,255,255,.28),transparent 60%,rgba(255,255,255,.2),transparent);background-size:200% 100%;animation:rdFg 9s linear infinite}
#rd .fx-sand_lp,#rd .fx-dust_heave{background-image:linear-gradient(100deg,transparent,rgba(190,150,90,.35),transparent 60%,rgba(190,150,90,.25),transparent)}
#rd .fx-wind_attack{animation-duration:1.2s}
@keyframes rdFg{to{background-position:-200% 0}}
#rd .fx-fire_attack{background:linear-gradient(0deg,rgba(255,110,20,.55),transparent 55%);animation:rdFi .3s steps(2) infinite alternate}
@keyframes rdFi{to{opacity:.6}}
#rd .fx-avg_star_lp{background-image:radial-gradient(circle,#fff 0 1.5px,transparent 2.5px),radial-gradient(circle,#ffe9a8 0 1px,transparent 2px);background-size:90px 90px,60px 60px;background-position:0 0,30px 40px;animation:rdTw 2.4s ease-in-out infinite alternate}
@keyframes rdTw{from{opacity:.25}to{opacity:.95}}
#rd .fx-avg_magic_ice{background:radial-gradient(circle at 50% 50%,rgba(170,230,255,.75),transparent 60%);animation:rdIce 1.2s ease-out forwards}
@keyframes rdIce{from{opacity:1;transform:scale(.6)}to{opacity:0;transform:scale(1.6)}}
#rd .rd-bgo{position:absolute;inset:0;transition:opacity var(--d,.5s) linear;pointer-events:none;z-index:1}
#rd .rd-dim{position:absolute;inset:0;background:rgba(0,0,0,.45);display:none}
#rd .rd-dim.on{display:block}
#rd .rd-obj{position:absolute;left:50%;top:46%;height:37%;transform:translate(-50%,-50%);border-radius:calc(var(--u)*2.5);box-shadow:0 4px 18px rgba(0,0,0,.5);display:none;animation:rdIn .3s}
#rd .rd-face{position:absolute;left:0;bottom:0;width:27%;height:calc(var(--u)*36);overflow:hidden;border-radius:0 0 0 calc(var(--u)*3);display:none;pointer-events:none}
#rd .rd-face img{width:100%;height:auto;object-fit:cover;object-position:top;display:block}
#rd .rd-box.face{padding-left:30%}
#rd .rd-box.face .rd-face{display:block}
#rd .rd-box.think{background:rgba(26,32,45,.93);background-image:radial-gradient(rgba(255,255,255,.07) 1px,transparent 1.2px);background-size:4px 4px;border-color:rgba(255,255,255,.12);border-radius:calc(var(--u)*6)}
#rd .rd-box.think .rd-tx{color:#f1f4f6}
#rd .rd-box.think:before{content:"";position:absolute;left:calc(var(--u)*24);top:calc(var(--u)*-3.4);width:calc(var(--u)*4.4);height:calc(var(--u)*3);border-radius:50%;background:#fff;border:2px solid #1f2a4d;z-index:2}
#rd .rd-box.sub{left:6%;right:6%;bottom:calc(var(--u)*5);min-height:0;background:none;border:0;box-shadow:none;text-align:center;padding:calc(var(--u)*2)}
#rd .rd-box.sub:after{content:"";position:absolute;left:-6%;right:-6%;bottom:calc(var(--u)*-5);top:calc(var(--u)*-8);background:linear-gradient(0deg,rgba(0,0,0,.7),transparent);z-index:-1}
#rd .rd-box.sub .rd-tx{color:#fff;text-shadow:0 1px 5px #000;font-size:calc(var(--u)*4.4)}
#rd .rd-box.sub .rd-nx,#rd .rd-box.ctr .rd-nx{display:none!important}
#rd .rd-box.ctr{left:10%;right:10%;bottom:auto;top:50%;transform:translateY(-50%);min-height:0;background:none;border:0;box-shadow:none;text-align:center}
#rd .rd-box.ctr .rd-tx{color:#fff;text-shadow:0 1px 6px #000;font-size:calc(var(--u)*5)}
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
const VO=new Audio();
function voz(c){
  try{VO.pause()}catch(e){}
  if(!c||!S||S.mute)return;
  const b=cap(c),l=[b+"_jp.ogg",b+"_en.ogg",b+"_cn.ogg",b+"_kr.ogg",b+".ogg"];let i=0;
  const t=()=>{if(i>=l.length)return;VO.src=FILE+l[i++];VO.volume=1;VO.play().catch(()=>{})};
  VO.onerror=t;t();
}
function pararAudio(){clearInterval(fT);BG.pause();bgCur="";try{VO.pause()}catch(e){}}
/* ---------- interfaz ---------- */
function build(){
  if(el)return;
  const st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
  const fl=document.createElement("link");fl.rel="stylesheet";fl.href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800&display=swap";document.head.appendChild(fl);
  el=document.createElement("div");el.id="rd";
  el.innerHTML=`<div class="rd-st">${[0,1,2,3,4,5,6].map(i=>'<div class="rd-sg'+(i?'':' on')+'" data-s="'+i+'"><div class="rd-sgi"><div class="rd-bgi"></div><div class="rd-chars"></div></div></div>').join("")}<svg class="rd-sl" viewBox="0 0 100 100" preserveAspectRatio="none"><line x1="58" y1="0" x2="42" y2="100"/><line x1="30" y1="0" x2="14" y2="100"/><line x1="86" y1="0" x2="70" y2="100"/></svg><div class="rd-fxl"></div><div class="rd-film"><i></i><i></i></div><div class="rd-cur"></div><div class="rd-dim"></div><img class="rd-obj" alt="" referrerpolicy="no-referrer">
   <button class="rd-out" data-a="x">✕ Salir</button>
   <div class="rd-bar"><button data-a="m"></button><button data-a="g"></button><button data-a="l"><svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9zM8.5 12h7M8.5 16h5"/></svg></button></div>
   <div class="rd-box"><div class="rd-face"><img alt="" referrerpolicy="no-referrer"></div><span class="rd-nm"></span><div class="rd-tx"></div><span class="rd-nx"><svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 11 7 11s7-6 7-11a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg></span></div>
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
  el.style.setProperty("--u",(h/100)+"px");if(S)S.u=h/100;
  geo();
}
/* geometría de escenarios, tomada de Avg_0_Stage.lua (máscara girada -20°, lienzo de 1080 de alto) */
function geo(){
  const st=el.querySelector(".rd-st");if(!st)return;
  const w=st.offsetWidth,h=st.offsetHeight;if(!w||!h)return;
  const Wu=1080*w/h,T=Math.tan(20*Math.PI/180),pc=x=>(50+x/Wu*100).toFixed(2);
  const L=(ex,ey)=>[ex+T*(540-ey),ex+T*(-540-ey)];            /* x arriba, x abajo (unidades) */
  const c=Math.cos(20*Math.PI/180),s=Math.sin(20*Math.PI/180);
  const hv=L(0,0),le=L(-1115.467+720*c,-186.3497-720*s),re=L(1115.467-720*c,-186.3497+720*s);
  const P=(i,v)=>{const a=pc(v[0]),b=pc(v[1]);
    const q=i===1?"polygon(0 0,"+a+"% 0,"+b+"% 100%,0 100%)":i===2?"polygon("+a+"% 0,100% 0,100% 100%,"+b+"% 100%)":i===3?"polygon(0 0,"+a+"% 0,"+b+"% 100%,0 100%)":"polygon("+a+"% 0,100% 0,100% 100%,"+b+"% 100%)";
    const e=sg(i);if(e)e.style.clipPath=q};
  P(1,hv);P(2,hv);P(3,le);P(4,re);
  const ln=el.querySelectorAll(".rd-sl line");
  [hv,le,re].forEach((v,i)=>{const e=ln[i];if(e){e.setAttribute("x1",pc(v[0]));e.setAttribute("y1",0);e.setAttribute("x2",pc(v[1]));e.setAttribute("y2",100)}});
}
window.addEventListener("resize",()=>{if(el&&el.classList.contains("on"))fit()});
function cierra(){if(S){clearInterval(S.timer);clearTimeout(S.wt);clearTimeout(S.at)}pararAudio();try{if(S&&S.vp){document.querySelector('meta[name=viewport]').content=S.vp}}catch(e){}el.classList.remove("on");S=null;
  try{if(screen.orientation&&screen.orientation.unlock)screen.orientation.unlock()}catch(e){}
  try{if(document.fullscreenElement)document.exitFullscreen()}catch(e){}}
function gen(){S.g=S.g?0:1;try{localStorage.setItem("rdg",S.g)}catch(e){}btnG()}
function btnG(){el.querySelector('[data-a="g"]').textContent="Protagonista: "+(S.g?"él":"ella")}
function card(h){const c=el.querySelector("#rd-c");if(h==null||h===false){c.classList.remove("on");c.innerHTML="";S.card=0;return}c.innerHTML=h;c.classList.add("on");S.card=1}
function fx(t){return t.replace(/==PLAYER_NAME==/g,"Sylar").replace(/==SEX\d*==/g,m=>SEX[m]?SEX[m][S.g]:"").replace(/==(?:P|B|Off|A-?[\d.]+)==/g,"")}
function esc(t){return String(t).replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]))}
function log(){
  card('<div class="rd-log" style="display:block;width:100%;max-height:100%;overflow:auto"><h2>Registro</h2>'+(S.log.map(l=>"<div><b>"+esc(l[0])+"</b>"+esc(l[1])+"</div>").join("")||"<p>Aún no hay nada.</p>")+'<button class="rd-b" data-a="lx" style="margin-top:12px">Volver</button></div>');
}
const SH={"CharShakeType":{"none":0,"stop":1,"still":2,"JuGong":[0.0,-50.0,0.7,1.0,0,0],"LianTiao":[0.0,-100.0,1.0,3.0,0,1],"Tiao":[0.0,50.0,0.7,1.0,0,0],"2TiaoYue":[0.0,50.0,0.35,2.0,0,1],"ChanDou":[20.0,0.0,0.2,1.0,0,1],"lengzhan":[5.0,0.0,0.1,2.0,0,1],"chijing":[-15.0,0.0,0.15,2.0,0,1],"huanxin":[0.0,25.0,0.22,2.0,0,1],"jingxia":[-15.0,15.0,0.17,2.0,0,1],"jinzhang":[25.0,0.0,0.2,3.0,0,1],"jushou":[0.0,50.0,0.3,1.0,0,0],"manbu":[0.0,20.0,0.5,3.0,0,1],"tiao2":[0.0,20.0,0.4,2.0,0,0],"diantou":[0.0,-20.0,0.3,1.0,0,0],"youzai":[10.0,0.0,0.9,2.0,0,1],"lengzhan2":[10.0,0.0,0.2,4.0,0,1],"shouji":[30.0,0.0,0.15,3.0,0,1],"chijing2":[-35.0,0.0,0.15,2.0,0,1],"buman":[0.0,60.0,0.25,3.0,0,0],"yaobai":[0.0,0.0,0.5,4.0,0,1],"xiangpu1":[-20.0,0.0,1.0,1.0,0,1],"xiangpu2":[-10.0,0.0,1.0,1.0,0,1],"manbu2":[0.0,-10.0,0.4,2.0,0,0],"jingxia2":[0.0,15.0,0.23,2.0,0,0],"daintou":[0.0,-30.0,0.3,2.0,0,0],"diantou2":[0.0,-30.0,0.3,2.0,0,1],"huanxin2":[0.0,25.0,0.22,3.0,0,1],"zuochupeng":[-40.0,0.0,0.25,2.0,0,0],"youchupeng":[40.0,0.0,0.25,2.0,0,0],"niunie":[-20.0,0.0,0.5,2.0,0,1],"niunie1":[-14.0,0.0,0.7,2.0,0,1],"jushou0":[0.0,20.0,0.3,1.0,0,0],"JuGong1":[0.0,-80.0,0.5,1.0,0,0],"jushou2":[0.0,40.0,0.3,2.0,0,1],"JuGong2":[0.0,-45.0,0.35,1.0,0,0],"jushou1":[0.0,20.0,0.2,1.0,0,0],"ChanDou1":[9.0,0.0,0.1,2.0,0,1],"jump1":[0.0,100.0,0.45,1.0,0,0],"youzaiLp":[10.0,0.0,0.9,2.0,1,1],"dabian":[50,50,0.2,2.2,0,1],"xiangjiao":[50,30,0.2,2.2,0,1],"guodongtiao1":[0,50,0,0,0,1],"shilaimu1":[0,100,0,0,0,1],"shilaimu2":[-150,90,0.35,1,0,0],"manbu_loop":[0,5,0,0,1,1],"xuanyun":[0,0,0,0,0,1],"lengzhanLP":[5.0,0.0,0.3,2.0,1,1],"loopLite":[0.0,2.0,0.4,1.0,1,0.5],"paishou":[0.0,-50.0,0.4,3.0,0,0]},"BgShakeType":{"none":0,"stop":1,"still":2,"Xiao":[0.0,10.0,0.1,5.0,0,1],"Zhong":[0.0,20.0,0.1,5.0,0,1],"Da":[0.0,20.0,0.1,1000.0,0,1],"1ZhenDong":[0.0,-50.0,0.4,1.0,0,1],"xiaozhen":[20.0,20.0,0.15,3.0,0,1],"hengbo":[50.0,0.0,0.2,5.0,0,1],"loop":[0.0,4.0,0.3,50000.0,0,1],"loopda":[0.0,37.0,0.1,50000.0,0,1],"zongbo":[0.0,50.0,0.2,5.0,0,1],"chijing":[-15.0,0.0,0.15,2.0,0,1],"jushou":[0.0,-15.0,0.3,1.0,0,0],"zhenjing":[50,35,0.2,1,0,1],"youchupeng":[-80,0,0.4,1,0,0],"zuochupeng":[80,0,0.4,1,0,0],"DaZhenDong":[0.0,40.0,0.1,5.0,0,1],"ChanDou":[40,0,0.12,4,0,1],"xingshi":[-3,6,0.4,1,1,0],"niunie1":[-14.0,0.0,0.7,2.0,0,1],"ChaoDaZhenDong":[0.0,60.0,0.1,5.0,0,1],"JingTouYaoHuang":[10,5,4,2,1,1],"XiaoLP":[0.0,10.0,0.1,5.0,1,1],"hengboLP":[20,5,2,5,1,1],"wind":[40,20,4.0,2.0,1,1],"loopLite":[0.0,2.0,0.4,1.0,1,0.5],"diantou":[0.0,15.0,0.3,1.0,0,0],"loopHeng":[3.0,0.0,0.2,1.0,1,0.5]}};
const EM={speechless:"…",attention:"❗",exclamation:"❗",happy:"😄",question:"❓",sigh:"💨",music:"🎵",flurry:"💦",vexation:"💢",think:"💭",star:"⭐",shock:"😱",sweaty:"💧",symbol:"⁉️",idea:"💡",angry:"💢",awkward:"😅",love:"💗",resentful:"😒",flower:"🌸",shy:"😳",sleepy:"💤"};
function sg(st){return el.querySelector('.rd-sg[data-s="'+(st||0)+'"]')}
function layer(st){return sg(st).querySelector(".rd-bgi")}
function tf(st,o,k0){
  const e=k0==="s"?sg(st).querySelector(".rd-sgi"):layer(st);if(!e)return;
  const key=k0+st,T=S.tr[key]||(S.tr[key]={x:0,y:0,s:1});
  if(o.x!=null)T.x=o.x;if(o.y!=null)T.y=o.y;if(o.s!=null)T.s=o.s;
  const k=S.u/10.8;
  if(o.px!=null||o.py!=null)e.style.transformOrigin=(o.px==null?.5:o.px)*100+"% "+(o.py==null?.5:1-o.py)*100+"%";
  const d=o.d||0;
  e.style.transition=d>0?"transform "+d+"s "+ease(o.e):"none";
  const bx=k0==="s"?(st===1?-300:st===2?300:0)*(S.wu||2400)/1200*k:0;
  e.style.transform="translate("+(T.x*k+bx)+"px,"+(-T.y*k)+"px) scale("+T.s+")";
  if(o.sh)shake(e,o.sh,"BgShakeType");
}
function shake(e,n,k){
  try{e.getAnimations().forEach(a=>{if(a.id==="rds")a.cancel()})}catch(x){}
  if(!n||n==="stop"||n==="still")return;
  const p=(SH[k]||{})[n];if(!(p instanceof Array)||!e.animate)return;
  const sx=p[0]||0,sy=p[1]||0,du=p[2]||.3,vb=p[3]||2,lp=p[4],u=S.u/10.8,N=Math.max(2,Math.round(vb*2)),f=[];
  for(let i=0;i<=N;i++){const d=lp?1:1-i/N,g=i%2?-1:1;f.push({translate:(g*sx*d*u)+"px "+(g*sy*d*u)+"px"})}
  f.push({translate:"0 0"});
  const a=e.animate(f,{duration:Math.max(150,du*1000),iterations:lp?Infinity:1});a.id="rds";
}
function ease(n){n=n||"Linear";return n==="Linear"?"linear":/^InOut/.test(n)?"ease-in-out":/^In/.test(n)?"ease-in":"ease-out"}
function setBg(n,st,d){
  st=st||0;const bg=layer(st);if(!bg)return;
  if(d>0){const o=bg.cloneNode(false);o.className="rd-bgo";o.style.setProperty("--d",d+"s");o.style.opacity=1;bg.parentNode.insertBefore(o,bg.nextSibling);
    requestAnimationFrame(()=>requestAnimationFrame(()=>{o.style.opacity=0}));setTimeout(()=>o.remove(),d*1000+150)}
  S.tr["b"+st]={x:0,y:0,s:1};bg.style.transition="none";bg.style.transform="none";bg.style.transformOrigin="50% 50%";
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
function stage(i,io){
  const e=sg(i);if(!e||!i)return;
  e.classList.toggle("on",io===0);
  if(io===0){S.wu=1080*e.offsetWidth/e.offsetHeight;tf(i,{},"s")}
  const on=i=>sg(i).classList.contains("on"),L=el.querySelectorAll(".rd-sl line");
  L[0].classList.toggle("on",on(1)||on(2));L[1].classList.toggle("on",on(3));L[2].classList.toggle("on",on(4));
  if(io!==0)setTimeout(()=>{if(S&&!e.classList.contains("on")){e.querySelector(".rd-chars").innerHTML="";for(const k in S.chars)if(S.chars[k].st===i)delete S.chars[k]}},400);
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
function faceSet(pose,expr){
  const l=spriteList("avg3_100",pose,expr);if(!l)return;
  const im=el.querySelector(".rd-face img");
  im.onerror=()=>{const q=JSON.parse(im.dataset.q||"[]");if(q.length){im.src=q.shift();im.dataset.q=JSON.stringify(q)}else im.removeAttribute("src")};
  im.dataset.q=JSON.stringify(l.slice(1));im.src=l[0];S.mc=1;
}
function emoji(host,n,cls){
  host.querySelectorAll("."+cls).forEach(x=>x.remove());
  if(!n)return;const t=EM[n];if(!t)return;
  const e=document.createElement("span");e.className=cls;e.textContent=t;host.appendChild(e);
}
function place(w,x,y,sc,al,d,ez){
  if(d!=null){w.style.setProperty("--d",d+"s");w.style.setProperty("--e",ease(ez))}
  if(x!=null)w.style.left=Math.round(x*1000)/10+"%";
  if(y!=null||sc!=null){
    if(y!=null)w.dataset.y=y;if(sc!=null)w.dataset.s=Math.abs(sc);
    const yy=+(w.dataset.y||0),ss=+(w.dataset.s||1.05);
    w.style.bottom=(-50+yy*100)+"%";w.style.height=Math.round(138*ss)+"%";
    if(sc!=null)w.firstChild.style.transform=sc<0?"scaleX(-1)":"";
  }
  if(al!=null)w.style.opacity=al;
}
function setChar(id,pose,expr,x,y,sc,st,em,al){
  const l=spriteList(id,pose,expr);if(!l)return;
  const old=S.chars[id];if(old&&old.st!==st){old.remove();delete S.chars[id]}
  let w=S.chars[id];
  if(!w){w=document.createElement("div");w.className="rd-sp";w.st=st;
    const im=document.createElement("img");im.referrerPolicy="no-referrer";
    im.onerror=()=>{const q=JSON.parse(im.dataset.q||"[]");if(q.length){im.src=q.shift();im.dataset.q=JSON.stringify(q)}else{w.remove();if(S.chars[id]===w)delete S.chars[id]}};
    w.appendChild(im);sg(st).querySelector(".rd-chars").appendChild(w);S.chars[id]=w;
    w.style.left="50%";w.style.opacity=al==null?1:al}
  w.dataset.pose=pose||"a";pon(w.firstChild,l);
  place(w,x==null?null:x,y==null?0:y,sc==null?1.05:sc,al,0);
  emoji(w,em,"rd-emo");
}
function ctl(id,pose,expr,em,x,y,sc,al,sh,ez,d){
  const w=S.chars[id];if(!w)return;
  if(pose||expr){const l=spriteList(id,pose||w.dataset.pose,expr);if(l){if(pose)w.dataset.pose=pose;pon(w.firstChild,l)}}
  place(w,x,y,sc,al,d||0,ez);
  if(em)emoji(w,em,"rd-emo");
  if(sh)shake(w,sh,"CharShakeType");
}
function hideCh(id){const w=S.chars[id];if(w){w.remove();delete S.chars[id]}}
function mrt(m,pose,face,em,sh){
  if(m>=3){S.mc=0;const b=el.querySelector(".rd-box");b.classList.remove("face");b.querySelectorAll(".rd-memo").forEach(x=>x.remove());return}
  if(face)faceSet(pose,face);
  const fc=el.querySelector(".rd-face");
  emoji(el.querySelector(".rd-box"),em,"rd-memo");
  if(sh)shake(fc,sh,"CharShakeType");
}
function chd(io,pos,id,pose,face,em){
  const st=el.querySelector(".rd-st");
  if(io!==0){st.querySelectorAll('.rd-hd[data-p="'+pos+'"]').forEach(x=>x.remove());return}
  const l=spriteList(id,pose,face);if(!l)return;
  let h=st.querySelector('.rd-hd[data-p="'+pos+'"]');
  if(!h){h=document.createElement("div");h.className="rd-hd";h.dataset.p=pos;h.appendChild(document.createElement("img"));st.appendChild(h)}
  const im=h.firstChild;im.referrerPolicy="no-referrer";
  im.onerror=()=>{const q=JSON.parse(im.dataset.q||"[]");if(q.length){im.src=q.shift();im.dataset.q=JSON.stringify(q)}else h.remove()};
  pon(im,l);emoji(h,em,"rd-emo");
}
function obj(n,mask,x,y){
  const im=el.querySelector(".rd-obj");
  im.style.display="none";
  im.onerror=()=>{im.style.display="none"};
  im.onload=()=>{
    const k=S.u*100/1080,w=im.naturalWidth;
    if(w){im.style.width=Math.round(w*k)+"px";im.style.height="auto"}
    im.style.left="calc(50% + "+(((x==null?.5:x)-.5)*1920*k)+"px)";
    im.style.top=((1-(y==null?.5:y))*100)+"%";im.style.display="block";
  };
  im.src=FILE+"Story_element_"+n+".png";
  el.querySelector(".rd-dim").classList.toggle("on",!!mask);
}
function objx(){const im=el.querySelector(".rd-obj");if(im){im.style.display="none";im.removeAttribute("src")}const d=el.querySelector(".rd-dim");if(d)d.classList.remove("on")}
function trn(io,style,cc,ct,d){
  const c=el.querySelector(".rd-cur");
  c.style.background=style===1?"#fff":"#000";
  c.style.transition="opacity "+(d||0)+"s linear";
  c.style.opacity=io===0?1:0;
  if(io===0){if(cc){el.querySelectorAll(".rd-chars").forEach(x=>x.innerHTML="");S.chars={}}
    if(ct)el.querySelector(".rd-box").style.visibility="hidden"}
}
function fxs(n,nd){
  if(!n)return;const k=n.replace(/^fx_/,"").replace(/^avg_(?!star|magic)/,"");
  const host=el.querySelector(".rd-fxl");S.fx=S.fx||{};
  if(S.fx[n]){S.fx[n].remove();delete S.fx[n]}
  if(nd===1)return;
  const e=document.createElement("div");e.className="fx fx-"+k;host.appendChild(e);S.fx[n]=e;
  if(/magic_ice/.test(n))setTimeout(()=>{e.remove();if(S.fx[n]===e)delete S.fx[n]},1300);
}
function hideAll(){objx();el.querySelectorAll(".rd-chars").forEach(c=>c.innerHTML="");el.querySelectorAll(".rd-hd").forEach(c=>c.remove());S.chars={}}
function say(spk,t,ty,vo){
  ty=ty||0;t=fx(t);voz(vo);S.pend=0;el.querySelector(".rd-box").style.visibility="";
  const mcL=spk==="avg3_100"||ty===1||ty===2;
  const nm=(spk==="0"||mcL)?"":(S.names[spk]||"");
  const box=el.querySelector(".rd-box");
  box.className="rd-box"+(ty===3?" sub":ty===8||ty===10?" ctr":ty===9||ty===11?" cg":"")+(ty===2?" think":"")+((ty===1||ty===2)&&S.mc?" face":"");
  if(ty!==1&&ty!==2)box.querySelectorAll(".rd-memo").forEach(x=>x.remove());
  el.querySelector(".rd-nm").textContent=nm;
  const tx=el.querySelector(".rd-tx");tx.className="rd-tx"+(spk==="0"?" nar":"");
  const plain=t.split("==W==").join("");
  S.log.push([mcL?"Sylar":(S.names[spk]||"—"),plain]);
  const nx=el.querySelector(".rd-nx");nx.style.display="none";
  if(S.timer)clearInterval(S.timer);S.timer=0;
  if(S.at){clearTimeout(S.at);S.at=0}
  S.segs=t.split("==W==");S.si=0;S.shown="";S.full=plain;
  if(ty===3||ty===8){ /* subtítulo: aparece completo y sigue solo (0.03 s por carácter, como el juego) */
    tx.textContent=plain;S.segs=[plain];S.shown=plain;
    S.at=setTimeout(()=>{S.at=0;if(S&&!S.card&&!S.choice)avanza()},Math.max(900,plain.replace(/\n/g,"").length*30));
    return;
  }
  tipea();
}
function tipea(){
  const tx=el.querySelector(".rd-tx"),seg=S.segs[S.si],base=S.shown;let i=0;
  S.timer=setInterval(()=>{i++;tx.textContent=base+seg.slice(0,i);if(i>=seg.length)finSeg()},30);
}
function finSeg(){
  clearInterval(S.timer);S.timer=0;
  S.shown+=S.segs[S.si];el.querySelector(".rd-tx").textContent=S.shown;
  if(S.si<S.segs.length-1){S.si++;S.pend=1;avanza()}
  else el.querySelector(".rd-nx").style.display="";
}
function finTipeo(){finSeg()}
function vacia(){ /* si el guion no reanuda el texto, lo completa */
  if(!S.pend)return;S.pend=0;
  S.shown+=S.segs.slice(S.si).join("");S.si=S.segs.length-1;
  el.querySelector(".rd-tx").textContent=S.shown;el.querySelector(".rd-nx").style.display="";
}
function autoSig(){}
function pick(i){
  const c=S.choice;S.choice=null;card(false);
  S.log.push(["Elegiste",c.o[i]]);
  if(c.b[i])S.stack.push({a:c.b[i],i:0});
  avanza();
}
function avanza(){
  if(!S||S.card)return;
  if(S.at){clearTimeout(S.at);S.at=0}
  if(S.busy){clearTimeout(S.wt);S.busy=0;S.wt=0;const c=el.querySelector(".rd-cur");}
  else if(S.timer){finTipeo();return}
  if(S.choice)return;
  for(;;){
    let f=S.stack[S.stack.length-1];
    if(!f){fin();return}
    if(f.i>=f.a.length){S.stack.pop();continue}
    const s=f.a[f.i++];
    if(S.pend&&/^(say|choice|intro|head|vid|end)$/.test(s[0]))vacia();
    switch(s[0]){
      case"goon":if(S.pend){S.pend=0;tipea();return}break;
      case"bg":setBg(s[1],s[2],s[3]);break;
      case"cbg":tf(s[1],{x:s[2],y:s[3],s:s[4],e:s[5],d:s[6],px:s[7],py:s[8],sh:s[9]},"b");break;
      case"stg":tf(s[1],{x:s[2],y:s[3],s:s[4],e:s[5],d:s[6],px:s[7],py:s[8],sh:s[9]},"s");break;
      case"stage":stage(s[1],s[2]);break;
      case"film":el.querySelector(".rd-film").classList.toggle("on",s[1]===0);break;
      case"bgm":bgm(s[1]);break;
      case"se":se(s[1]);break;
      case"show":setChar(s[1],s[2],s[3],s[4],s[5],s[6],s[7],s[8],s[9]);break;
      case"ctl":ctl(s[1],s[2],s[3],s[4],s[5],s[6],s[7],s[8],s[9],s[10],s[11]);break;
      case"hide":hideCh(s[1]);break;
      case"mrt":mrt(s[1],s[2],s[3],s[4],s[5]);break;
      case"chd":chd(s[1],s[2],s[3],s[4],s[5],s[6]);break;
      case"clear":hideAll();break;
      case"intro":card('<small>'+esc(s[1])+'</small><h2>'+esc(s[2])+'</h2><p>'+esc(s[3])+'</p><button class="rd-b" data-a="ok" style="margin-top:18px">Comenzar</button>');return;
      case"head":card('<p style="font-size:1.1rem">'+esc(s[1])+'</p><button class="rd-b" data-a="ok" style="margin-top:18px">Continuar</button>');return;
      case"say":say(s[1],s[2],s[3],s[4]);return;
      case"vid":card('<small>Cinemática</small><h2>🎬 '+esc(String(s[1]).split("/").pop())+'</h2><p>Aquí el juego reproduce un video. Todavía no está disponible en el lector.</p><button class="rd-b" data-a="ok" style="margin-top:18px">Continuar</button>');return;
      case"w":S.busy=1;S.wt=setTimeout(()=>{S.busy=0;S.wt=0;avanza()},s[1]*1000);return;
      case"trn":trn(s[1],s[2],s[3],s[4],s[5]);break;
      case"fx":fxs(s[2],s[3]);break;
      case"tsk":shake(el.querySelector(".rd-box"),s[1],"BgShakeType");break;
      case"obj":obj(s[1],s[2],s[3],s[4]);break;
      case"objx":objx();break;
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
  S={tr:{},u:(window.innerHeight>window.innerWidth?window.innerWidth:window.innerHeight)/100,names:d.names,stack:[{a:d.steps,i:0}],chars:{},log:[],g:g,mute:m,timer:0,card:0,choice:null};
  el.querySelector(".rd-tx").textContent="";el.querySelector(".rd-nm").textContent="";
  el.querySelectorAll(".rd-chars").forEach(c=>c.innerHTML="");el.querySelectorAll(".rd-hd,.rd-memo").forEach(c=>c.remove());el.querySelectorAll(".rd-bgi,.rd-sgi").forEach(e=>{e.style.cssText=""});el.querySelectorAll(".rd-sg").forEach(e=>e.classList.toggle("on",e.dataset.s==="0"));el.querySelector(".rd-film").classList.remove("on");
  el.querySelector(".rd-fxl").innerHTML="";el.querySelector(".rd-cur").style.opacity=0;el.querySelector(".rd-box").style.visibility="";
  S.mc=0;try{const mv=document.querySelector('meta[name=viewport]');if(mv&&!/viewport-fit/.test(mv.content)){S.vp=mv.content;mv.content=mv.content+",viewport-fit=cover"}}catch(e){}
  btnG();btnM();card(false);el.classList.add("on");fit();setTimeout(fit,400);avanza();
};
})();
