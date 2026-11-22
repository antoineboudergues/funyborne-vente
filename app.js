import * as T from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';
const $=id=>document.getElementById(id),cl=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),lerp=(a,b,t)=>a+(b-a)*t,
ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,seg=(p,a,b)=>cl((p-a)/(b-a)),PI=Math.PI;
const stage=$('stage'),story=$('story');
const R=new T.WebGLRenderer({canvas:$('gl'),antialias:true,alpha:true});
R.setPixelRatio(Math.min(devicePixelRatio,innerWidth<820?1.75:2));R.outputColorSpace=T.SRGBColorSpace;R.toneMapping=T.ACESFilmicToneMapping;R.toneMappingExposure=1.15;
R.shadowMap.enabled=true;R.shadowMap.type=T.PCFSoftShadowMap;
const S=new T.Scene();R.setClearColor(0,0);
const cam=new T.PerspectiveCamera(32,1,.1,80);
const hemi=new T.HemisphereLight(0xffffff,0x1a1a22,.7);S.add(hemi);
const key=new T.DirectionalLight(0xffffff,2.4);key.position.set(3,6,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);
Object.assign(key.shadow.camera,{left:-5,right:5,top:5,bottom:-5,near:.5,far:20});key.shadow.camera.updateProjectionMatrix();key.shadow.bias=-.0006;S.add(key);
const rim=new T.DirectionalLight(0xffd400,.9);rim.position.set(-4,3,-4);S.add(rim);

const M=(c,o={})=>new T.MeshStandardMaterial({color:c,roughness:.6,...o});
const mk=(g,m,x,y,z,p)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;p.add(o);return o;};
const ct=(w,h,draw)=>{const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.anisotropy=8;return t;};
function rr(w,h,r){const s=new T.Shape(),x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;}
function rbox(w,h,d,r,b=.012){const g=new T.ExtrudeGeometry(rr(w-2*b,h-2*b,r),{depth:d-2*b,bevelEnabled:true,bevelThickness:b,bevelSize:b,bevelSegments:4,curveSegments:12});g.center();return g;}
const box=(w,h,d)=>new T.BoxGeometry(w,h,d);

/* ---------- BORNE ---------- */
const B=new T.Group();S.add(B);
const skin=M(0xf3f3f1,{roughness:.4,metalness:.05,transparent:true});
const dark=M(0x0b0b10,{roughness:.25,metalness:.5}),grey=M(0x2a2d34,{roughness:.5});
mk(rbox(.56,.9,.48,.055),skin,0,.45,0,B);
mk(rbox(.32,.14,.3,.012),skin,0,.96,0,B);
const headG=new T.Group();B.add(headG);
mk(rbox(.56,.74,.26,.1),skin,0,1.39,0,headG);
const ledM=M(0xffffff,{emissive:0xffffff,emissiveIntensity:1.2});
const ledL=mk(rbox(.09,.1,.02,.02,.004),ledM,-.17,1.63,.125,headG),ledR=mk(rbox(.09,.1,.02,.02,.004),ledM,.17,1.63,.125,headG);
const camG=new T.Group();headG.add(camG);
mk(box(.14,.1,.09),grey,0,1.63,.04,camG);
const lens=mk(new T.CylinderGeometry(.045,.05,.07,32),dark,0,1.63,.11,camG);lens.rotation.x=PI/2;
const glass=mk(new T.CircleGeometry(.032,24),M(0x1a2a55,{roughness:.05,metalness:.9}),0,1.63,.146,camG);
const scrG=new T.Group();headG.add(scrG);
mk(box(.31,.2,.02),dark,0,1.36,.125,scrG);
let scrC;const scrT=ct(512,310,(g,w,h)=>{scrC=g;});
function drawScr(t){const g=scrC,gr=g.createLinearGradient(0,0,512,310);gr.addColorStop(0,'#7f8cff');gr.addColorStop(.5,'#b9a8f5');gr.addColorStop(1,'#5a7cf0');g.fillStyle=gr;g.fillRect(0,0,512,310);
  g.fillStyle='#14143a';g.textAlign='center';g.textBaseline='middle';let s=64;g.font='italic 800 '+s+'px Georgia,serif';while(g.measureText(t).width>440&&s>20){s-=4;g.font='italic 800 '+s+'px Georgia,serif';}g.fillText(t,256,155);scrT.needsUpdate=true;}
const scrP=new T.Mesh(new T.PlaneGeometry(.285,.175),new T.MeshBasicMaterial({map:scrT}));scrP.position.set(0,1.36,.1355);scrG.add(scrP);
const pc=mk(box(.13,.03,.1),grey,0,1.2,.02,headG);
const printer=mk(rbox(.32,.2,.36,.02,.006),M(0xdfe2e7,{roughness:.5}),0,.6,0,B);
mk(box(.012,.11,.2),dark,.161,0,0,printer);
/* sortie photo sur le côté */
mk(box(.004,.022,.17),dark,.281,.515,0,B);mk(box(.06,.012,.15),skin,.305,.498,0,B);
mk(box(.004,.03,.055),dark,.281,.74,.09,B);mk(box(.004,.03,.055),dark,.281,.74,-.09,B);
const stripT=ct(300,200,(g)=>{g.fillStyle='#fff';g.fillRect(0,0,300,200);['#c9b3a6','#a9b7c9','#c9a6b8'].forEach((c,i)=>{g.fillStyle=c;g.fillRect(12+i*82,14,72,172);g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.arc(48+i*82,80,20,0,7);g.fill();g.fillRect(22+i*82,108,52,78);});g.fillStyle='#111';g.fillRect(258,14,30,172);});
const strip=new T.Mesh(new T.PlaneGeometry(.15,.1),new T.MeshStandardMaterial({map:stripT,roughness:.4,side:T.DoubleSide}));strip.rotation.x=-PI/2;strip.position.y=.512;B.add(strip);
/* marquage sur toute la borne */
let brand='VOTRE MARQUE',ink='#111',brC;const brT=ct(512,128,g=>{brC=g;});
function drawBrand(){const g=brC;g.clearRect(0,0,512,128);g.fillStyle=ink;g.textAlign='center';g.textBaseline='middle';let s=74;g.font='900 '+s+'px Inter,Arial,sans-serif';while(g.measureText(brand).width>480&&s>16){s-=4;g.font='900 '+s+'px Inter,Arial,sans-serif';}g.fillText(brand,256,68);brT.needsUpdate=true;}
const decM=new T.MeshStandardMaterial({map:brT,transparent:true,opacity:0,depthWrite:false,roughness:.5});
function decal(w,h,x,y,z,ry,vert,par){const d=new T.Mesh(new T.PlaneGeometry(w,h),decM);d.position.set(x,y,z);d.rotation.y=ry;if(vert)d.rotateZ(PI/2);d.renderOrder=3;par.add(d);}
decal(.46,.115,0,.52,.2416,0,0,B);decal(.46,.115,0,.52,-.2416,PI,0,B);decal(.6,.15,-.2816,.45,0,-PI/2,1,B);
decal(.5,.125,.2816,1.39,0,PI/2,1,headG);decal(.5,.125,-.2816,1.39,0,-PI/2,1,headG);decal(.4,.1,0,1.2,-.1316,PI,0,headG);
drawScr('FunyBorne');drawBrand();

/* ---------- DECORS (photos) ---------- */
const sh=new T.Mesh(new T.CircleGeometry(6,48),new T.ShadowMaterial({opacity:.5}));sh.rotation.x=-PI/2;sh.receiveShadow=true;S.add(sh);
const CDN='';
stage.style.background='radial-gradient(60vmax 50vmax at 62% 60%,rgba(255,212,0,.13),transparent 60%),#07070A';
const bgs=[['salle',78],['terrasse',72],['mall',62]].map(([n,x])=>{const d=document.createElement('div');d.style.cssText='position:absolute;inset:-2%;background:url('+CDN+n+'.jpg) '+x+'% 50%/cover;opacity:0;will-change:opacity,transform';stage.insertBefore(d,$('gl'));return d;});
const C=h=>new T.Color(h);
const ENV=[{bg:C(0x07070a),h:C(0xffffff),hi:.7,k:C(0xffffff),ki:2.4,r:C(0xffd400),ri:.9},
 {bg:C(0x1c0e06),h:C(0xfff8f0),hi:1,k:C(0xfff2e4),ki:2.6,r:C(0xff8a3c),ri:1.3},
 {bg:C(0x0a1024),h:C(0xaab8ff),hi:.85,k:C(0xffcf9e),ki:2.2,r:C(0xff8a4b),ri:1.2},
 {bg:C(0x14171e),h:C(0xffffff),hi:1.35,k:C(0xf4f8ff),ki:2.6,r:C(0xffffff),ri:.6}];
const w=[1,0,0,0];
const mix=(out,k)=>{out.setRGB(0,0,0);ENV.forEach((e,i)=>{out.r+=e[k].r*w[i];out.g+=e[k].g*w[i];out.b+=e[k].b*w[i];});};
const mixN=k=>ENV.reduce((s,e,i)=>s+e[k]*w[i],0);

/* ---------- LABELS ---------- */
const LAB=[[camG,'Canon EOS 2000D','Reflex 24 Mpx',0,[.07,1.66,.05]],[ledL,'LED continue','Éclairage studio intégré',1,[-.04,0,0]],[scrG,'Écran tactile','Interface intuitive',0,[.15,1.36,.13]],[pc,'Mini PC','Pilote photo et impression',1,[-.06,0,0]],[printer,'Citizen CZ-01','Imprimante photo pro',0,[.16,0,0]]]
 .map(([o,t,s,left,off])=>{const e=document.createElement('div');e.className='l3'+(left?' lf':'');e.innerHTML='<i></i><div><b>'+t+'</b><small>'+s+'</small></div>';stage.appendChild(e);return{o,e,off:new T.Vector3(...off)};});
const v3=new T.Vector3();

/* ---------- STATE ---------- */
const chaps=[...document.querySelectorAll('.chap')],dots=[...$('dots').children],cards=[...$('cards').children];
const BD=[0,.14,.32,.5,.66,.83,1],K=[[0,-.65],[.16,-.3],[.34,.3],[.52,-.3],[.68,-.55],[.83,-.55],[1,-.55+PI*2]];
const THEMES=[[0xf3f3f1,'#111111'],[0x111111,'#FFD400'],[0xe9b8c9,'#3a1a28'],[0xc8102e,'#ffffff']];
let cur=-1,user=null,th=-1,mx=0,my=0,lw=0,lh=0,ox=-.14,oy=0,boost=0,decO=0;
function setSkin(hex,i){skin.color.set(hex);ink=i;drawBrand();}
if(matchMedia('(hover:hover)').matches)addEventListener('mousemove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;});
document.querySelectorAll('.chip').forEach(ch=>ch.addEventListener('click',()=>{document.querySelectorAll('.chip').forEach(x=>x.classList.remove('on'));ch.classList.add('on');user=1;setSkin(ch.dataset.s,ch.dataset.i);}));
$('brandIn').addEventListener('input',e=>{brand=(e.target.value||'VOTRE MARQUE').toUpperCase();drawBrand();if(cur===5)drawScr(brand);});

function frame(){requestAnimationFrame(frame);
  const r=story.getBoundingClientRect(),vh=innerHeight;if(r.bottom<-50)return;
  const W=stage.clientWidth,H=stage.clientHeight,mob=W<820;
  if(W!==lw||H!==lh){lw=W;lh=H;R.setSize(W,H,false);cam.aspect=W/H;}
  const p=cl(-r.top/(r.height-vh));let c=0;for(let i=0;i<6;i++)if(p>=BD[i])c=i;
  if(c!==cur){cur=c;chaps.forEach((e,i)=>e.classList.toggle('on',i===c));dots.forEach((e,i)=>e.classList.toggle('on',i===c));
    drawScr(c===0?'FunyBorne':c===1?'Souriez !':c===5?brand:"Touchez l'écran");
    if(c===1)setTimeout(()=>{if(cur===1){boost=1;const f=$('fx');f.classList.remove('go');void f.offsetWidth;f.classList.add('go');}},900);}
  $('hint').style.opacity=p<.02?1:0;const wf=$('waf');wf.style.opacity=p>=.999?1:0;wf.style.pointerEvents=p>=.999?'auto':'none';
  /* décors */
  w[1]=ease(seg(p,.125,.18))*(1-ease(seg(p,.305,.335)));w[2]=ease(seg(p,.32,.37))*(1-ease(seg(p,.485,.515)));w[3]=ease(seg(p,.5,.55))*(1-ease(seg(p,.645,.675)));
  const t1=w[1],t2=w[2],t3=w[3];w[0]=Math.max(0,1-w[1]-w[2]-w[3]);const sm=w[0]+w[1]+w[2]+w[3];for(let i=0;i<4;i++)w[i]/=sm;
  const et=Math.min(1,t1+t2+t3);[t1,t2,t3].forEach((t,i)=>{const b=bgs[i];b.style.opacity=t;b.style.transform='scale('+(1.12-.06*t)+') translate('+(-mx*10).toFixed(1)+'px,'+((p-BD[i+1]-.09)*-160).toFixed(1)+'px)';});
  mix(hemi.color,'h');hemi.intensity=mixN('hi');mix(key.color,'k');key.intensity=mixN('ki');mix(rim.color,'r');rim.intensity=mixN('ri');
  /* borne */
  let ry=K[0][1];for(let i=0;i<K.length-1;i++)if(p>=K[i][0]&&p<=K[i+1][0])ry=lerp(K[i][1],K[i+1][1],ease(seg(p,K[i][0],K[i+1][0])));
  if(p<.14)ry+=Math.sin(performance.now()/1500)*.07;B.rotation.y=ry;
  const intro=ease(cl(p/.06+.4));B.scale.setScalar(.92+.08*intro);
  const ex=ease(seg(p,.67,.73))*(1-ease(seg(p,.8,.84)));
  skin.opacity=1-.72*ex;skin.emissive.setScalar(.35*ex);skin.depthWrite=ex<.02;headG.position.y=.16*ex;camG.position.z=.34*ex;camG.position.y=.1*ex;scrG.position.z=.24*ex;pc.position.set(-.3*ex,1.2-.1*ex,.02+.2*ex);
  ledL.position.z=ledR.position.z=.125+.12*ex;printer.position.z=.5*ex;
  boost*=.9;ledM.emissiveIntensity=1.1+5*boost+1.6*ex;
  /* perso */
  if(c===5){if(!user){const t=Math.min(3,Math.floor(seg(p,.83,1)*4));if(t!==th){th=t;setSkin(THEMES[t][0],THEMES[t][1]);}}}
  else if(!user&&th!==0){th=0;setSkin(THEMES[0][0],THEMES[0][1]);}
  decO=lerp(decO,c===5?1:0,.1);decM.opacity=decO;decM.visible=decO>.01;
  const sp=ease(seg(p,.86,.93));strip.visible=c===5;strip.position.x=lerp(.19,.365,sp);
  /* caméra */
  const a=(Math.sin(p*9.4)*.16+mx*.1)*(1-et),rad=(mob?(c===5?9.6:8.2):5.7)-(mob?1.2:1.7)*ex;
  cam.position.set(Math.sin(a)*rad,1.5-my*.25*(1-et),Math.cos(a)*rad);cam.lookAt(0,.95+.2*ex,0);
  ox=lerp(ox,mob?0:(c===2?-.02:-.14),.07);oy=lerp(oy,mob?(c===5?-.17:c===2?-.03:-.09):0,.07);cam.setViewOffset(W,H,ox*W,oy*H,W,H);
  R.render(S,cam);
  LAB.forEach(l=>{l.e.style.opacity=ex;if(ex<.01)return;l.o.updateWorldMatrix(true,false);v3.copy(l.off).applyMatrix4(l.o.matrixWorld).project(cam);
    l.e.style.transform='translate('+cl((v3.x*.5+.5)*W,mob?96:0,mob?W-96:W).toFixed(1)+'px,'+((-v3.y*.5+.5)*H).toFixed(1)+'px)';});
  const cp=seg(p,.34,.46);cards.forEach((e,i)=>e.classList.toggle('on',c===2&&cp>i*.22));
}
frame();
