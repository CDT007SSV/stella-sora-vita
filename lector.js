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
#rd .rd-sp{position:absolute;bottom:-42%;height:128%;transform:translateX(-50%);animation:rdIn .35s;pointer-events:none;transition:left var(--d,0s) var(--e,linear),bottom var(--d,0s) var(--e,linear),height var(--d,0s) var(--e,linear),opacity var(--d,0s) var(--e,linear)}
#rd .rd-sp img{height:100%;width:auto;display:block}
#rd .rd-emo,#rd .rd-memo{position:absolute;font-size:calc(var(--u)*8);line-height:1;animation:rdPop .45s;pointer-events:none;filter:drop-shadow(0 1px 3px rgba(0,0,0,.5));z-index:3}
#rd .rd-emo.img,#rd .rd-memo.img{font-size:0}
#rd .rd-emo.img img{height:calc(var(--u)*13);width:auto;display:block}
#rd .rd-memo.img img{height:calc(var(--u)*11);width:auto;display:block}
#rd .rd-emo{top:3%;left:57%}#rd .rd-emo.tx,#rd .rd-memo.tx{background:#fff;color:#1f2a4d;border-radius:50%;min-width:1.5em;text-align:center;padding:.15em .2em;font-weight:800;box-shadow:0 1px 4px rgba(0,0,0,.35)}#rd .rd-emo.out,#rd .rd-memo.out{opacity:0;transition:opacity .3s}
#rd .rd-memo{left:21%;top:calc(var(--u)*-9)}
@keyframes rdPop{0%{transform:scale(.2);opacity:0}60%{transform:scale(1.25);opacity:1}100%{transform:scale(1)}}
#rd .rd-hd{position:absolute;bottom:calc(var(--u)*30);width:calc(var(--u)*24);height:calc(var(--u)*30);overflow:hidden;border:2px solid #fff;border-radius:calc(var(--u)*3);background:rgba(250,250,255,.86);z-index:3;animation:rdIn .3s}
#rd .rd-hd img{width:170%;margin-left:-35%;display:block}
#rd .rd-hd[data-p="0"]{left:3%}#rd .rd-hd[data-p="3"]{left:15%}#rd .rd-hd[data-p="1"]{left:50%;margin-left:calc(var(--u)*-12)}#rd .rd-hd[data-p="2"]{right:3%}#rd .rd-hd[data-p="4"]{right:15%}
#rd .rd-hd .rd-emo{top:2%;left:auto;right:4%;font-size:calc(var(--u)*6)}
@keyframes rdIn{from{opacity:0}to{opacity:1}}
#rd .rd-out{position:absolute;top:calc(var(--u)*2.6);left:calc(var(--u)*3 + env(safe-area-inset-left));z-index:5;color:#fff;font-weight:800;font-size:calc(var(--u)*3.6);text-shadow:0 1px 4px rgba(0,0,0,.7);background:none;border:0;padding:0}
#rd .rd-bar{position:absolute;top:calc(var(--u)*2);right:calc(var(--u)*2.5 + env(safe-area-inset-right));z-index:5;display:flex;align-items:center;background:rgba(18,14,44,.82);border:1px solid rgba(123,108,255,.4);border-radius:99px;box-shadow:0 2px 10px rgba(0,0,0,.4)}
#rd .rd-bar button{background:none;border:0;color:#fff;font:inherit;font-weight:800;font-size:calc(var(--u)*3);padding:calc(var(--u)*1.8) calc(var(--u)*3);border-right:1px solid rgba(255,255,255,.14);display:flex;align-items:center;gap:calc(var(--u)*1)}
#rd .rd-bar button:last-child{border-right:0}
#rd .rd-bar svg{width:calc(var(--u)*4);height:calc(var(--u)*4);fill:none;stroke:#fff;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
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
#rd .rd-map{width:100%;height:100%;display:flex;flex-direction:column;text-align:left}
#rd .rd-mt{display:flex;align-items:center;justify-content:space-between;gap:calc(var(--u)*3);padding-bottom:calc(var(--u)*1.5)}
#rd .rd-mt h2{margin:0;font-size:calc(var(--u)*4);line-height:1.2}
#rd .rd-cont{margin:0 0 calc(var(--u)*1.5);align-self:flex-start}
#rd .rd-ms{flex:1;overflow:auto;position:relative;border-radius:calc(var(--u)*2);background:linear-gradient(180deg,#14112f,#2a2260);border:1px solid #2f2a52}
#rd .rd-mg{position:relative;display:flex;align-items:center;gap:calc(var(--u)*7);padding:calc(var(--u)*4) calc(var(--u)*4);min-height:100%;width:max-content;box-sizing:border-box}
#rd .rd-mc{display:flex;flex-direction:column;gap:calc(var(--u)*3);justify-content:center;position:relative;z-index:1}
#rd .rd-ml{position:absolute;left:0;top:0;pointer-events:none;z-index:0}
#rd .rd-ml path{fill:none;stroke:#7B6CFF;stroke-width:2.5}
#rd .rd-nd{display:flex;flex-direction:column;gap:2px;width:calc(var(--u)*27);min-height:calc(var(--u)*10);padding:calc(var(--u)*1.2) calc(var(--u)*1.8);border:2px solid transparent;border-radius:calc(var(--u)*1);background:#201b4a;color:#fff;border-color:rgba(123,108,255,.4);font:inherit;text-align:left;cursor:pointer;box-sizing:border-box}
#rd .rd-nd b{font-size:calc(var(--u)*3.8);line-height:1.1}
#rd .rd-nd span{font-size:calc(var(--u)*2.6);line-height:1.2;font-weight:700}
#rd .rd-nd.leido{background:#2f2872}
#rd .rd-nd.act,#rd .rd-nd.cur{border-color:#13d6d6;box-shadow:0 0 0 2px rgba(19,214,214,.35)}
#rd .rd-nd.fin{background:#4a2f9a;color:#fff;min-height:calc(var(--u)*7)}
#rd .rd-nd.bt{background:#13c9cf;color:#04282b;cursor:default;opacity:.85}
#rd .rd-card{position:absolute;inset:0;z-index:6;background:rgba(8,6,22,.985);display:none;flex-direction:column;justify-content:center;align-items:center;padding:calc(var(--u)*4) calc(var(--u)*10);text-align:center;color:#fff;overflow:auto}
#rd .rd-card.on{display:flex}
#rd .rd-card h2{font-size:calc(var(--u)*5.5);margin:6px 0 calc(var(--u)*2)}
#rd .rd-card p{line-height:1.55;color:#e3e0f5;max-width:60em;font-size:calc(var(--u)*3.8);font-weight:600}
#rd .rd-card small{letter-spacing:.2em;text-transform:uppercase;color:#f3c969;font-size:calc(var(--u)*3);font-weight:800}
#rd .rd-ch{display:flex;flex-direction:column;gap:calc(var(--u)*1.8);width:100%;max-width:64%;margin-top:6px}
#rd .rd-ch button{background:linear-gradient(135deg,#7B6CFF,#5b4de0);border:1px solid rgba(255,255,255,.28);color:#fff;font:inherit;font-weight:800;border-radius:calc(var(--u)*2.4);padding:calc(var(--u)*2.2);font-size:calc(var(--u)*3.9);box-shadow:0 2px 8px rgba(0,0,0,.3)}
#rd .rd-card .rd-b{background:linear-gradient(135deg,#7B6CFF,#5b4de0);border:1px solid rgba(255,255,255,.28);color:#fff;box-shadow:0 4px 14px rgba(91,77,224,.4);font:inherit;font-weight:800;border-radius:calc(var(--u)*2.4);padding:calc(var(--u)*1.8) calc(var(--u)*8);font-size:calc(var(--u)*3.8)}
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
   <div class="rd-bar"><button data-a="ac">Actos</button><button data-a="z"></button><button data-a="e"></button><button data-a="m"></button><button data-a="g"></button><button data-a="l"><svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9zM8.5 12h7M8.5 16h5"/></svg></button></div>
   <div class="rd-box"><div class="rd-face"><img alt="" referrerpolicy="no-referrer"></div><span class="rd-nm"></span><div class="rd-tx"></div><span class="rd-nx"><svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 11 7 11s7-6 7-11a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg></span></div>
   <div class="rd-card" id="rd-c"></div></div>`;
  document.body.appendChild(el);
  el.addEventListener("click",e=>{
    const a=e.target.closest("[data-a]");
    if(a){const k=a.dataset.a;
      if(k==="x")cierra();else if(k==="g")gen();else if(k==="l")log();else if(k==="m")mute();else if(k==="e"){S.em=S.em?0:1;try{localStorage.setItem("rde",S.em)}catch(e){}btnE();if(!S.em)el.querySelectorAll(".rd-emo,.rd-memo").forEach(x=>x.remove())}else if(k==="nx"){const n=a.dataset.n||SIG[S.id],pv=S;pararAudio();iniciar(n,pv)}else if(k==="lx"){card(false);}else if(k==="ac")actos();else if(k==="z"){S.zs=S.zs<1?1:S.zs>1?.85:1.15;if(S.zs===1.15&&false)S.zs=1;try{localStorage.setItem("rdz",S.zs)}catch(e){}btnZ();Object.keys(S.chars).forEach(k=>lay(S.chars[k]))}else if(k==="ay"){card(false);if(S.hold){S.hold=0;avanza()}}
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
function btnE(){const b=el.querySelector('[data-a="e"]');if(b)b.textContent="Emojis: "+(S.em?"sí":"no")}
function btnZ(){const b=el.querySelector('[data-a="z"]');if(b)b.textContent="Sprites: "+(S.zs<1?"chicos":S.zs>1?"grandes":"normales")}
function btnG(){el.querySelector('[data-a="g"]').textContent="Protagonista: "+(S.g?"él":"ella")}
function card(h){const c=el.querySelector("#rd-c");if(h==null||h===false){c.classList.remove("on");c.innerHTML="";S.card=0;return}c.innerHTML=h;c.classList.add("on");S.card=1}
function fx(t){return t.replace(/==PLAYER_NAME==/g,"Sylar").replace(/==SEX\d*==/g,m=>SEX[m]?SEX[m][S.g]:"").replace(/==(?:P|B|Off|A-?[\d.]+)==/g,"")}
function esc(t){return String(t).replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]))}
function log(){
  card('<div class="rd-log" style="display:block;width:100%;max-height:100%;overflow:auto"><h2>Registro</h2>'+(S.log.map(l=>"<div><b>"+esc(l[0])+"</b>"+esc(l[1])+"</div>").join("")||"<p>Aún no hay nada.</p>")+(S.miss&&Object.keys(S.miss).length?"<p style=\"font-size:.8em;opacity:.8\">Imágenes no encontradas en la wiki: "+Object.keys(S.miss).map(esc).join(", ")+"</p>":"")+'<button class="rd-b" data-a="lx" style="margin-top:12px">Volver</button></div>');
}
const SH={"CharShakeType":{"none":0,"stop":1,"still":2,"JuGong":[0.0,-50.0,0.7,1.0,0,0],"LianTiao":[0.0,-100.0,1.0,3.0,0,1],"Tiao":[0.0,50.0,0.7,1.0,0,0],"2TiaoYue":[0.0,50.0,0.35,2.0,0,1],"ChanDou":[20.0,0.0,0.2,1.0,0,1],"lengzhan":[5.0,0.0,0.1,2.0,0,1],"chijing":[-15.0,0.0,0.15,2.0,0,1],"huanxin":[0.0,25.0,0.22,2.0,0,1],"jingxia":[-15.0,15.0,0.17,2.0,0,1],"jinzhang":[25.0,0.0,0.2,3.0,0,1],"jushou":[0.0,50.0,0.3,1.0,0,0],"manbu":[0.0,20.0,0.5,3.0,0,1],"tiao2":[0.0,20.0,0.4,2.0,0,0],"diantou":[0.0,-20.0,0.3,1.0,0,0],"youzai":[10.0,0.0,0.9,2.0,0,1],"lengzhan2":[10.0,0.0,0.2,4.0,0,1],"shouji":[30.0,0.0,0.15,3.0,0,1],"chijing2":[-35.0,0.0,0.15,2.0,0,1],"buman":[0.0,60.0,0.25,3.0,0,0],"yaobai":[0.0,0.0,0.5,4.0,0,1],"xiangpu1":[-20.0,0.0,1.0,1.0,0,1],"xiangpu2":[-10.0,0.0,1.0,1.0,0,1],"manbu2":[0.0,-10.0,0.4,2.0,0,0],"jingxia2":[0.0,15.0,0.23,2.0,0,0],"daintou":[0.0,-30.0,0.3,2.0,0,0],"diantou2":[0.0,-30.0,0.3,2.0,0,1],"huanxin2":[0.0,25.0,0.22,3.0,0,1],"zuochupeng":[-40.0,0.0,0.25,2.0,0,0],"youchupeng":[40.0,0.0,0.25,2.0,0,0],"niunie":[-20.0,0.0,0.5,2.0,0,1],"niunie1":[-14.0,0.0,0.7,2.0,0,1],"jushou0":[0.0,20.0,0.3,1.0,0,0],"JuGong1":[0.0,-80.0,0.5,1.0,0,0],"jushou2":[0.0,40.0,0.3,2.0,0,1],"JuGong2":[0.0,-45.0,0.35,1.0,0,0],"jushou1":[0.0,20.0,0.2,1.0,0,0],"ChanDou1":[9.0,0.0,0.1,2.0,0,1],"jump1":[0.0,100.0,0.45,1.0,0,0],"youzaiLp":[10.0,0.0,0.9,2.0,1,1],"dabian":[50,50,0.2,2.2,0,1],"xiangjiao":[50,30,0.2,2.2,0,1],"guodongtiao1":[0,50,0,0,0,1],"shilaimu1":[0,100,0,0,0,1],"shilaimu2":[-150,90,0.35,1,0,0],"manbu_loop":[0,5,0,0,1,1],"xuanyun":[0,0,0,0,0,1],"lengzhanLP":[5.0,0.0,0.3,2.0,1,1],"loopLite":[0.0,2.0,0.4,1.0,1,0.5],"paishou":[0.0,-50.0,0.4,3.0,0,0]},"BgShakeType":{"none":0,"stop":1,"still":2,"Xiao":[0.0,10.0,0.1,5.0,0,1],"Zhong":[0.0,20.0,0.1,5.0,0,1],"Da":[0.0,20.0,0.1,1000.0,0,1],"1ZhenDong":[0.0,-50.0,0.4,1.0,0,1],"xiaozhen":[20.0,20.0,0.15,3.0,0,1],"hengbo":[50.0,0.0,0.2,5.0,0,1],"loop":[0.0,4.0,0.3,50000.0,0,1],"loopda":[0.0,37.0,0.1,50000.0,0,1],"zongbo":[0.0,50.0,0.2,5.0,0,1],"chijing":[-15.0,0.0,0.15,2.0,0,1],"jushou":[0.0,-15.0,0.3,1.0,0,0],"zhenjing":[50,35,0.2,1,0,1],"youchupeng":[-80,0,0.4,1,0,0],"zuochupeng":[80,0,0.4,1,0,0],"DaZhenDong":[0.0,40.0,0.1,5.0,0,1],"ChanDou":[40,0,0.12,4,0,1],"xingshi":[-3,6,0.4,1,1,0],"niunie1":[-14.0,0.0,0.7,2.0,0,1],"ChaoDaZhenDong":[0.0,60.0,0.1,5.0,0,1],"JingTouYaoHuang":[10,5,4,2,1,1],"XiaoLP":[0.0,10.0,0.1,5.0,1,1],"hengboLP":[20,5,2,5,1,1],"wind":[40,20,4.0,2.0,1,1],"loopLite":[0.0,2.0,0.4,1.0,1,0.5],"diantou":[0.0,15.0,0.3,1.0,0,0],"loopHeng":[3.0,0.0,0.2,1.0,1,0.5]}};
const EM={speechless:"…",attention:"❗",exclamation:"❗",happy:"😄",question:"❓",sigh:"💨",music:"🎵",flurry:"💦",vexation:"💢",think:"💭",star:"⭐",shock:"😱",sweaty:"💧",symbol:"⁉️",idea:"💡",angry:"💢",awkward:"😅",love:"💗",resentful:"😒",flower:"🌸",shy:"😳",sleepy:"💤"};
function miss(n){if(S){S.miss=S.miss||{};S.miss[n]=1}}
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
function stopShakes(){try{el.getAnimations({subtree:true}).forEach(a=>{if(a.id==="rds")a.cancel()})}catch(x){}}
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
  st=st||0;const bg=layer(st);if(!bg)return;try{bg.getAnimations().forEach(a=>{if(a.id==="rds")a.cancel()})}catch(x){}
  if(d>0){const o=bg.cloneNode(false);o.className="rd-bgo";o.style.setProperty("--d",d+"s");o.style.opacity=1;bg.parentNode.insertBefore(o,bg.nextSibling);
    requestAnimationFrame(()=>requestAnimationFrame(()=>{o.style.opacity=0}));setTimeout(()=>o.remove(),d*1000+150)}
  S.tr["b"+st]={x:0,y:0,s:1};bg.style.transition="none";bg.style.transform="none";bg.style.transformOrigin="50% 50%";
  if(/^BG_Black/i.test(n)){bg.style.backgroundImage="none";bg.style.background="#000";return}
  if(/^BG_White/i.test(n)){bg.style.backgroundImage="none";bg.style.background="#fff";return}
  const lo=n.toLowerCase(),l=[FILE+cap(n)+".png",FILE+cap(lo)+".png",FILE+"BG_"+lo+".png",FILE+"BG_"+n+".png",FILE+cap(n)+".jpg",FILE+cap(lo)+".jpg",FILE+"BG_"+lo+".jpg"].filter((v,i,a)=>a.indexOf(v)===i);
  const probar=i=>{
    if(i>=l.length){miss(n);bg.style.backgroundImage="none";bg.style.background="radial-gradient(circle at 50% 30%,#2a1f55,#0a0818)";return}
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
  const base0=id==="avg3_100"?(S.g?"Male":"Female")+"_tyrant":((S.en&&S.en[id])||S.names[id]||"").trim();
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
/* Reglas del juego (AvgPreset.CharEmoji / Avg_2_L2DCtrl._SetEmoji): "none"=sin cambio, "close"=quitar;
   los emojis normales desaparecen solos a los 5 s; solo los "loop" se quedan hasta que se reemplazan o se cierran. */
/* sonido de cada emoji (AvgPreset.CharEmoji del juego: nombre -> efecto "se_xxx"). Suena al aparecer el emoji, aunque sea de los que solo se ve en la cara */
const EMSE={angry:"se_046",attention:"se_047",exclamation:"se_048",happy:"se_049",love:"se_050",music:"se_051",question:"se_052",shock:"se_053",shy:"se_054",speechless:"se_055",star:"se_056",sweaty:"se_057",symbol:"se_058",vexation:"se_059",awkward:"se_122",idea:"se_123",flurry:"se_124",sigh:"se_125",think:"se_055",flower:"se_305",resentful:"se_237",sleepy:"se_306"};
const EMLOOP={angry:1,shock:1,speechless:1,think:1,sleepy:1};
/* emojis de cara: el sprite ya muestra la emoción, no se dibujan */
const EMFACE={happy:1,shy:1,awkward:1,shock:1,resentful:1};
/* emojis con imagen real de la wiki comprobada; añadir un nombre aquí para probar otros (Avg_emoji_<nombre>_<n>.png) */
const EMIMG={attention:1,exclamation:1,star:1};
/* el emoji espera a que su sprite ya esté cargado (si no, aparecía flotando antes que el personaje) */
function emoji(host,n,cls,wait){
  if(n==="none")return;
  const k=host._ek=(host._ek||0)+1;
  if(!wait||(wait.complete&&wait.naturalWidth)){emojiNow(host,n,cls);return}
  host.querySelectorAll("."+cls).forEach(x=>{clearTimeout(x._o);clearInterval(x._t);x.remove()});
  let hecho=0;const go=()=>{if(hecho||host._ek!==k||!host.isConnected)return;hecho=1;emojiNow(host,n,cls)};
  wait.addEventListener("load",go,{once:true});setTimeout(go,4000);
}
function emojiNow(host,n,cls){
  if(n==="none")return;
  if(n&&n!=="close"&&EMSE[n])se(EMSE[n]);
  host.querySelectorAll("."+cls).forEach(x=>{clearTimeout(x._o);clearInterval(x._t);x.remove()});
  if(!n||n==="close"||(S&&S.em===0)||EMFACE[n])return;
  const e=document.createElement("span");e.className=cls+(n==="speechless"||n==="think"?" tx":"");e.textContent=EM[n]||"";host.appendChild(e);
  if(!EMLOOP[n])e._o=setTimeout(()=>{e.classList.add("out");setTimeout(()=>{clearInterval(e._t);e.remove()},350)},5000);
  if(!EMIMG[n])return;
  const fr=[];let i=1;
  const go=()=>{
    if(!fr.length||!e.isConnected)return;
    e.textContent="";e.classList.add("img");
    const im=document.createElement("img");im.alt="";im.src=fr[0];e.appendChild(im);
    if(fr.length>1){let k=0;e._t=setInterval(()=>{if(!e.isConnected){clearInterval(e._t);return}k=(k+1)%fr.length;im.src=fr[k]},150)}
  };
  const nx=()=>{const m=new Image();m.referrerPolicy="no-referrer";
    m.onload=()=>{fr.push(m.src);i++;if(i<=12)nx();else go()};
    m.onerror=go;m.src=FILE+"Avg_emoji_"+n+"_"+i+".png"};
  nx();
}
function lay(w){
  const K=(S&&S.zs)||1,yy=+(w.dataset.y||0),ss=+(w.dataset.s||1),h=128*ss*K;let b=-42+yy*100;
  if(b+h>96)b=96-h;
  w.style.bottom=Math.round(b*10)/10+"%";w.style.height=Math.round(h*10)/10+"%";
}
function place(w,x,y,sc,al,d,ez){
  if(d!=null){w.style.setProperty("--d",d+"s");w.style.setProperty("--e",ease(ez))}
  if(x!=null)w.style.left=Math.round(x*1000)/10+"%";
  if(y!=null||sc!=null){
    if(y!=null)w.dataset.y=y;if(sc!=null)w.dataset.s=Math.abs(sc);
    lay(w);
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
  place(w,x==null?null:x,y==null?0:y,sc==null?1:sc,al,0);
  emoji(w,em,"rd-emo",w.firstChild);
}
function ctl(id,pose,expr,em,x,y,sc,al,sh,ez,d){
  const w=S.chars[id];if(!w)return;
  if(pose||expr){const l=spriteList(id,pose||w.dataset.pose,expr);if(l){if(pose)w.dataset.pose=pose;pon(w.firstChild,l)}}
  place(w,x,y,sc,al,d||0,ez);
  if(em)emoji(w,em,"rd-emo",w.firstChild);
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
  pon(im,l);emoji(h,em,"rd-emo",im);
}
function obj(n,mask,x,y){
  const im=el.querySelector(".rd-obj");
  im.style.display="none";
  im.onerror=()=>{miss(n);im.style.display="none"};
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
const FXP=new Set(["fx_avg_bling", "fx_avg_bubble_lp", "fx_avg_dream_loop", "fx_avg_dust_2_a", "fx_avg_dust_2_b", "fx_avg_dust_a", "fx_avg_dust_b", "fx_avg_fire_dust", "fx_avg_frezon_full_loop", "fx_avg_frezon_loop", "fx_avg_goldenlight_continued", "fx_avg_line_cen_lp", "fx_avg_line_cen_lp_w", "fx_avg_line_down_lp", "fx_avg_line_down_lp_w", "fx_avg_line_goleft_lp", "fx_avg_line_goleft_lp_w", "fx_avg_line_goright_2_lp", "fx_avg_line_goright_2_lp_w", "fx_avg_line_goright_lp", "fx_avg_line_goright_lp_w", "fx_avg_movie", "fx_avg_nega_ev", "fx_avg_noise", "fx_avg_powerup_loop", "fx_avg_rain", "fx_avg_rain_2", "fx_avg_rain_sky", "fx_avg_reminiscence_loop", "fx_avg_sand_lp", "fx_avg_snow", "fx_avg_snowstorm_lp", "fx_avg_speaking", "fx_avg_star_lp", "fx_avg_summon_lp", "fx_avg_thunder", "fx_avg_warning", "fx_avg_watermarks_lp", "fx_avg_wisteria_left", "fx_avg_wisteria_right", "fx_fog_2_lp", "fx_fog_lp"]);
function fxs(n,nd){
  if(!n)return;const k=n.replace(/^fx_/,"").replace(/^avg_(?!star|magic)/,"");
  const host=el.querySelector(".rd-fxl");S.fx=S.fx||{};
  if(S.fx[n]){S.fx[n].remove();delete S.fx[n]}
  if(nd===1)return;
  const e=document.createElement("div");e.className="fx fx-"+k;host.appendChild(e);S.fx[n]=e;
  if(!FXP.has(n))setTimeout(()=>{e.remove();if(S&&S.fx&&S.fx[n]===e)delete S.fx[n]},/speedline|line_cen/.test(n)?1100:1500);
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
const SIG={"STm00_01": "STm00_02", "STm01_01": "STm01_02", "STm01_02": "STm01_03", "STm01_03": "STm01_04", "STm01_04": "STm01_05", "STm01_05": "STm01_06", "STm01_06": "STm01_07", "STm01_07": "STm01_08_a", "STm01_08_a": "STm01_09", "STm01_08_b": "STm01_08_a", "STm01_08_c": "STm01_09", "STm01_09": "STm01_10", "STm01_10": "STm02_01", "STm02_01": "STm02_02_a", "STm02_02_a": "STm02_03_a", "STm02_03_a": "STm02_04", "STm02_02_b": "STm02_03_b", "STm02_03_b": "STm02_04", "STm02_02_c": "STm02_02_a", "STm02_04": "STm02_05", "STm02_05": "STm02_06", "STm02_06": "STm02_07", "STm02_07": "STm02_08", "STm02_08": "STm02_09", "STm02_09": "STm02_10", "STm02_10": "STm02_11", "STm02_11": "STm03_00_a", "STm03_00_a": "STm03_00_b", "STm03_00_b": "STm03_01", "STm03_01": "STm03_02", "STm03_02": "STm03_03", "STm03_03": "STm03_04", "STm03_04": "STm03_05", "STm03_05": "STm03_06_a", "STm03_06_a": "STm03_07", "STm03_06_b": "STm03_07", "STm03_06_c": "STm03_05", "STm03_07": "STm03_08", "STm03_08": "STm03_09", "STm03_09": "STm03_10", "STm03_10": "STm03_11"};
const ALT={STm03_05:[["STm03_06_b","Ruta alterna: Entrenamiento especial (Acto 6B)"],["STm03_06_c","Final alternativo: Terapia de choque"]],STm02_01:[["STm02_02_b","Ruta alterna: Investigación disfrazada (Acto 2)"],["STm02_02_c","Final alternativo: Un final interminable"]],STm01_07:[["STm01_08_c","Ruta alterna: la cena (Acto 8)"],["STm01_08_b","Final alternativo: Un futuro sin Trekkers"]]};
const NOMB={"STm01_01": "1 · El reinicio del despertar", "STm01_02": "2 · Huellas del pasado", "STm01_03": "3 · Oasis desvanecido", "STm01_04": "4 · Bajo el puente", "STm01_05": "5 · Vientos del distrito Ceniza", "STm01_06": "6 · Volando desde la ceniza", "STm01_07": "7 · Un tipo distinto de deseo", "STm01_08_b": "Final: Un futuro sin Trekkers", "STm01_08_a": "8A · Informe de investigación", "STm01_08_c": "8B · Postre después de la cena", "STm01_09": "9 · Cómo se reparan los recuerdos", "STm01_10": "10 · Interpretación final", "STm02_01": "1 · Loxy y la compañía", "STm02_02_c": "Final: Eternidad", "STm02_02_a": "2A · Secretos en la oscuridad", "STm02_03_a": "3A · Ojos en la oscuridad", "STm02_02_b": "2B · Investigación disfrazada", "STm02_03_b": "3B · Después de horas", "STm02_04": "4 · Chica de pelo negro", "STm02_05": "5 · Código de Honor", "STm02_06": "6 · Privilegio de la empresa", "STm02_07": "7 · Franquicia exclusiva", "STm02_08": "8 · Comercio de almas", "STm02_09": "9 · Una guerra de una hora", "STm02_10": "10 · Cómo se cumplen los deseos", "STm02_11": "Epílogo · Un nuevo comienzo", "STm00_01": "Prólogo, parte 1", "STm00_02": "Prólogo, parte 2", "STm03_00_a": "Interludio 1 · El teléfono", "STm03_00_b": "Interludio 2 · Vita", "STm03_01": "1 · Los Tres Grandes", "STm03_02": "2 · La señora oculta del bosque", "STm03_03": "3 · Petal Bloom", "STm03_04": "4 · Una cacería fallida", "STm03_05": "5 · Trauma", "STm03_06_c": "Final: Terapia de choque", "STm03_06_a": "6A · Terapia psicológica", "STm03_06_b": "6B · Entrenamiento especial", "STm03_07": "7 · La debilucha no deseada", "STm03_08": "8 · La escuadra de caza", "STm03_09": "9 · Un corazón confiado", "STm03_10": "10 · Victoria e intercambio", "STm03_11": "11 · El último monstruo"};
function fin(){pararAudio();stopShakes();marcaLeido(S.id);const nx=SIG[S.id];let h;
  if(nx){h='<small>Fin de esta parte</small><h2>'+(NOMB[S.id]||"")+' terminado</h2><p>Sigue: '+(NOMB[nx]||"la siguiente parte")+'.</p><button class="rd-b" data-a="nx" data-n="'+nx+'" style="margin-top:18px">Continuar</button>';
    (ALT[S.id]||[]).forEach(function(x){h+=' <button class="rd-b" data-a="nx" data-n="'+x[0]+'" style="margin-top:10px">'+x[1]+'</button>'});
    h+=' <button class="rd-b" data-a="x" style="margin-top:18px">Cerrar</button>'}
  else h='<small>Fin</small><h2>'+(NOMB[S.id]||"Fin")+' terminado</h2><p>Por ahora llegamos hasta aquí. ¡Continuará!</p><button class="rd-b" data-a="x" style="margin-top:18px">Cerrar</button>';
  card(h)}

const CAPS={"STm00": ["Prólogo", [["STm00_01"], ["STm00_02"]], [["STm00_01", "STm00_02"]]], "STm01": ["Capítulo 1 · Seres sin memoria", [["STm01_01"], ["STm01_02"], ["STm01_03"], ["STm01_04"], ["STm01_05"], ["@BT01|Regreso al orfanato"], ["STm01_06"], ["STm01_07", "!STm01_08_b"], ["STm01_08_a", "STm01_08_c"], ["STm01_09"], ["STm01_10"]], [["STm01_01", "STm01_02"], ["STm01_02", "STm01_03"], ["STm01_03", "STm01_04"], ["STm01_04", "STm01_05"], ["STm01_05", "@BT01|Regreso al orfanato"], ["@BT01|Regreso al orfanato", "STm01_06"], ["STm01_06", "STm01_07"], ["STm01_07", "STm01_08_a"], ["STm01_07", "STm01_08_c"], ["STm01_07", "STm01_08_b"], ["STm01_08_a", "STm01_09"], ["STm01_08_c", "STm01_09"], ["STm01_09", "STm01_10"]]], "STm02": ["Capítulo 2 · El viento en el puente de la vía fluvial", [["STm02_01", "!STm02_02_c"], ["STm02_02_a", "STm02_02_b"], ["STm02_03_a", "STm02_03_b"], ["@BT01|Escapar del círculo"], ["STm02_04"], ["STm02_05"], ["STm02_06"], ["STm02_07"], ["STm02_08"], ["STm02_09"], ["@BT02|La Estrella del Cataclismo"], ["STm02_10"], ["@BT03|Reencuentro con un viejo enemigo"], ["STm02_11"]], [["STm02_01", "STm02_02_a"], ["STm02_01", "STm02_02_b"], ["STm02_01", "STm02_02_c"], ["STm02_02_a", "STm02_03_a"], ["STm02_02_b", "STm02_03_b"], ["STm02_03_a", "@BT01|Escapar del círculo"], ["STm02_03_b", "@BT01|Escapar del círculo"], ["@BT01|Escapar del círculo", "STm02_04"], ["STm02_04", "STm02_05"], ["STm02_05", "STm02_06"], ["STm02_06", "STm02_07"], ["STm02_07", "STm02_08"], ["STm02_08", "STm02_09"], ["STm02_09", "@BT02|La Estrella del Cataclismo"], ["@BT02|La Estrella del Cataclismo", "STm02_10"], ["STm02_10", "@BT03|Reencuentro con un viejo enemigo"], ["@BT03|Reencuentro con un viejo enemigo", "STm02_11"]]], "STm03": ["Capítulo 3 · Guild Sweet Guild", [["STm03_00_a"], ["STm03_00_b"], ["STm03_01"], ["STm03_02"], ["STm03_03"], ["STm03_04"], ["@BT01|Medida de poder"], ["STm03_05", "!STm03_06_c"], ["STm03_06_a", "STm03_06_b"], ["STm03_07"], ["STm03_08"], ["STm03_09"], ["@BT02|Espíritu de la brutalidad"], ["STm03_10"], ["STm03_11"]], [["STm03_00_a", "STm03_00_b"], ["STm03_00_b", "STm03_01"], ["STm03_01", "STm03_02"], ["STm03_02", "STm03_03"], ["STm03_03", "STm03_04"], ["STm03_04", "@BT01|Medida de poder"], ["@BT01|Medida de poder", "STm03_05"], ["STm03_05", "STm03_06_a"], ["STm03_05", "STm03_06_b"], ["STm03_05", "STm03_06_c"], ["STm03_06_a", "STm03_07"], ["STm03_06_b", "STm03_07"], ["STm03_07", "STm03_08"], ["STm03_08", "STm03_09"], ["STm03_09", "@BT02|Espíritu de la brutalidad"], ["@BT02|Espíritu de la brutalidad", "STm03_10"], ["STm03_10", "STm03_11"]]]};
function chOf(id){return String(id).slice(0,5)}
function leidos(){try{return JSON.parse(localStorage.getItem("rdr")||"[]")}catch(e){return[]}}
function marcaLeido(id){try{const l=leidos();if(l.indexOf(id)<0){l.push(id);localStorage.setItem("rdr",JSON.stringify(l))}}catch(e){}}
function actos(hold){
  const c=CAPS[chOf(S.id)];if(!c)return;
  let pr=null;try{pr=localStorage.getItem("rdp"+chOf(S.id))}catch(e){}
  const rd=leidos();S.hold=hold?1:0;
  const nodo=t=>{
    if(t[0]==="@"){const q=t.slice(1).split("|");return '<div class="rd-nd bt"><b>'+q[0]+' ⚔</b><span>'+q[1]+'</span></div>'}
    const f=t[0]==="!",id=f?t.slice(1):t,n=(NOMB[id]||id).split(" · "),num=n.length>1?n[0]:"",tit=n.length>1?n.slice(1).join(" · "):n[0];
    const cl="rd-nd"+(f?" fin":"")+(rd.indexOf(id)>=0?" leido":"")+(id===pr?" act":"")+(id===S.id&&!hold?" cur":"");
    return '<button class="'+cl+'" data-a="nx" data-n="'+id+'" data-id="'+id+'"><b>'+(f?"El fin":num)+(rd.indexOf(id)>=0?" ✓":"")+'</b><span>'+(f?tit.replace(/^Final: /,""):tit)+'</span></button>'
  };
  let h='<div class="rd-map"><div class="rd-mt"><h2>'+c[0]+'</h2><button class="rd-b" data-a="'+(hold?'x':'ay')+'">'+(hold?'Cerrar':'Volver')+'</button></div>';
  if(hold){const pi=(pr&&NOMB[pr])?pr:c[1][0][0];h+='<button class="rd-b rd-cont" data-a="nx" data-n="'+pi+'">'+((pr&&NOMB[pr])?'Continuar: ':'Empezar: ')+(NOMB[pi]||pi)+'</button>'}
  h+='<div class="rd-ms"><div class="rd-mg">';
  c[1].forEach(col=>{h+='<div class="rd-mc">'+col.map(nodo).join("")+'</div>'});
  h+='<svg class="rd-ml"></svg></div></div></div>';
  card(h);
  requestAnimationFrame(()=>{
    const g=el.querySelector(".rd-mg"),svg=g&&g.querySelector(".rd-ml");if(!g)return;
    const find=t=>{const id=t[0]==="@"?null:t;if(id)return g.querySelector('[data-id="'+id+'"]');
      const nm=t.slice(1).split("|")[1];return[].find.call(g.querySelectorAll(".rd-nd.bt"),x=>x.textContent.indexOf(nm)>=0)};
    const pos=e=>{let x=0,y=0,o=e;while(o&&o!==g){x+=o.offsetLeft;y+=o.offsetTop;o=o.offsetParent}return{l:x,r:x+e.offsetWidth,m:y+e.offsetHeight/2}};
    svg.setAttribute("width",g.scrollWidth);svg.setAttribute("height",g.scrollHeight);
    let d="";c[2].forEach(k=>{const a=find(k[0]),b=find(k[1]);if(!a||!b)return;const p=pos(a),q=pos(b),mx=(p.r+q.l)/2;
      d+='<path d="M'+p.r+" "+p.m+"C"+mx+" "+p.m+" "+mx+" "+q.m+" "+q.l+" "+q.m+'"/>'});
    svg.innerHTML=d;
    const t=g.querySelector(".act")||g.querySelector(".cur");if(t&&t.scrollIntoView)try{t.scrollIntoView({inline:"center",block:"nearest"})}catch(e){}
  });
}
window.abrirLector=async function(id){
  build();
  try{const st=document.getElementById("bgm-st");if(st&&document.getElementById("bgmbar").classList.contains("on"))st.click()}catch(e){}
  try{const de=document.documentElement;if(de.requestFullscreen)await de.requestFullscreen({navigationUI:"hide"})}catch(e){}
  try{if(screen.orientation&&screen.orientation.lock)await screen.orientation.lock("landscape")}catch(e){}
  let pr=null;try{pr=localStorage.getItem("rdp"+chOf(id))}catch(e){}
  await iniciar(id,null,!!CAPS[chOf(id)]);
};
/* precarga: baja los sprites de la historia por adelantado, de 3 en 3, en el orden en que aparecen */
function precarga(steps,tok){
  const u=[],vis=new Set();
  (function rec(a){(a||[]).forEach(s=>{
    if(!Array.isArray(s))return;
    if((s[0]==="show"||s[0]==="ctl"||s[0]==="chd")){
      const id=s[0]==="chd"?s[3]:s[1],pose=s[0]==="chd"?s[4]:s[2],ex=s[0]==="chd"?s[5]:s[3];
      if(id&&ex!=null){const l=spriteList(id,pose||"a",ex);if(l&&!vis.has(l[0])){vis.add(l[0]);u.push(l[0])}}
    }
    s.forEach(v=>{if(Array.isArray(v)&&Array.isArray(v[0]))v.forEach(x=>{if(Array.isArray(x))rec([x])})})
  })})(steps);
  let i=0;const next=()=>{
    if(!S||S.pt!==tok||i>=u.length)return;
    const m=new Image();m.referrerPolicy="no-referrer";m.onload=m.onerror=next;m.src=u[i++]};
  for(let k=0;k<3;k++)next();
}
async function iniciar(id,prev,hold){
  let d;try{const r=await fetch("lector-"+id+".json");if(!r.ok)throw 0;d=await r.json()}catch(e){alert("No se pudo cargar la historia.");return}
  let g=1,m=0,zs=1,em=1;try{em=localStorage.getItem("rde")==="0"?0:1;const z=+localStorage.getItem("rdz");if(z)zs=z;const v=localStorage.getItem("rdg");if(v!=null)g=+v;m=+(localStorage.getItem("rdm")||0)}catch(e){}
  if(S&&S.timer){clearInterval(S.timer);clearTimeout(S.wt);clearTimeout(S.at)}
  if(!hold)try{localStorage.setItem("rdp"+chOf(id),id)}catch(e){}
  S={id:id,tr:{},u:(window.innerHeight>window.innerWidth?window.innerWidth:window.innerHeight)/100,names:d.names,en:d.en||{},stack:[{a:d.steps,i:0}],pt:Math.random(),chars:{},log:[],g:g,mute:m,zs:zs,em:em,timer:0,card:0,choice:null};
  el.querySelector(".rd-tx").textContent="";el.querySelector(".rd-nm").textContent="";
  el.querySelectorAll(".rd-chars").forEach(c=>c.innerHTML="");el.querySelectorAll(".rd-hd,.rd-memo").forEach(c=>c.remove());el.querySelectorAll(".rd-bgi,.rd-sgi").forEach(e=>{e.style.cssText=""});el.querySelectorAll(".rd-sg").forEach(e=>e.classList.toggle("on",e.dataset.s==="0"));el.querySelector(".rd-film").classList.remove("on");
  el.querySelector(".rd-fxl").innerHTML="";el.querySelector(".rd-cur").style.opacity=0;el.querySelector(".rd-box").style.visibility="";
  S.mc=0;if(prev)S.vp=prev.vp;try{const mv=document.querySelector('meta[name=viewport]');if(mv&&!/viewport-fit/.test(mv.content)){S.vp=mv.content;mv.content=mv.content+",viewport-fit=cover"}}catch(e){}
  btnG();btnM();btnZ();btnE();try{precarga(d.steps,S.pt)}catch(x){}card(false);el.classList.add("on");stopShakes();fit();setTimeout(fit,400);if(hold)actos(true);else avanza();
}
})();
