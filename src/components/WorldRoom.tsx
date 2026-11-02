'use client';
import { useEffect, useRef, useState } from 'react';
import type { Mesh, Material, BufferGeometry, Texture } from 'three';
import type { Language } from '@/data/world';
/** Loaded only after the visitor opts into WebGL. Geometry is intentionally a spatial prototype. */
export default function WorldRoom({language}:{language:Language}) {
 const host=useRef<HTMLDivElement>(null), changeView=useRef<(n:number)=>void>(()=>{});
 const [status,setStatus]=useState<'loading'|'ready'|'error'>('loading');
 const [hover,setHover]=useState('');
 useEffect(()=>{
  let stopped=false, cleanup=()=>{};
  (async()=>{
   const T=await import('three');
   const {OrbitControls}=await import('three/addons/controls/OrbitControls.js');
   if(stopped||!host.current)return;
   const el=host.current, renderer=new T.WebGLRenderer({antialias:true,alpha:true});
   renderer.setPixelRatio(Math.min(devicePixelRatio,1.5)); renderer.shadowMap.enabled=true;
   renderer.shadowMap.type=T.PCFSoftShadowMap; renderer.setClearColor('#171321');
   el.appendChild(renderer.domElement);
   const scene=new T.Scene(), camera=new T.PerspectiveCamera(39,1,.1,100);
   camera.position.set(9,8,11);
   const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,1,0);
   controls.enableDamping=false;controls.minDistance=7;controls.maxDistance=19;controls.maxPolarAngle=Math.PI*.46;
   controls.enablePan=false;
   scene.add(new T.HemisphereLight(0xc4bbff,0x342131,3));
   const sun=new T.DirectionalLight(0xffd7ae,4);sun.position.set(2,7,5);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);scene.add(sun);
   const lilac=new T.PointLight(0x8f77ff,24,12);lilac.position.set(-2,3,-2);scene.add(lilac);
   const meshes:Mesh[]=[], mats:Material[]=[], geometries:BufferGeometry[]=[],textures:Texture[]=[];
   function box(w:number,h:number,d:number,x:number,y:number,z:number,color:string,route?:string){
    const g=new T.BoxGeometry(w,h,d),m=new T.MeshStandardMaterial({color,roughness:.78});
    geometries.push(g);mats.push(m);const a=new T.Mesh(g,m);a.position.set(x,y,z);a.castShadow=true;a.receiveShadow=true;
    if(route)a.userData.route=route;scene.add(a);meshes.push(a);return a;
   }
   box(8,.25,6,0,-.15,0,'#706073');box(8,4,.15,0,1.9,-3,'#322c49');box(.15,4,6,-4,1.9,0,'#40354d');
   // Window, city and warm lit windows.
   box(3.4,2.25,.08,.1,2.3,-2.88,'#54577e');
   for(let i=0;i<9;i++){
    const h=.45+(Math.sin(i*7)+1)*.52;box(.29,h,.08,-1.35+i*.36,1.25+h/2,-2.8,'#292b48');
    for(let j=0;j<4;j++)if(j*.25<h-.1)box(.055,.075,.02,-1.28+i*.36,1.45+j*.25,-2.73,j%2?'#d6a384':'#8e9ec2');
   }
   [-1.65,.1,1.85].forEach(x=>box(.08,2.4,.14,x,2.3,-2.69,'#1e2033'));
   [1.1,3.5].forEach(y=>box(3.6,.08,.14,.1,y,-2.69,'#1e2033'));
   // Desk and dual screens: actual pickable meshes.
   box(3.1,.15,1.25,1.4,1.35,-1.5,'#ad8d87','lab');
   [.1,2.7].forEach(x=>box(.13,1.3,1,x,.65,-1.5,'#40364a','lab'));
   [.65,1.9].forEach(x=>{box(1.1,.75,.12,x,2,-1.8,'#151827','lab');box(.99,.63,.03,x,2,-1.72,'#7887a7','lab');box(.07,.25,.1,x,1.5,-1.8,'#292534','lab');for(let j=0;j<5;j++)box(.55-j*.05,.025,.015,x-.1,2.2-j*.09,-1.695,j%2?'#d8b5ba':'#c3c9e6','lab');});
   box(.85,.035,.3,.9,1.46,-1.1,'#d9c6c9','lab');
   box(.48,.065,.38,2.35,1.47,-1.15,'#9f6579','thoughts');
   // Chair.
   box(.8,.15,.8,1.1,.8,-.05,'#262536');box(.8,1.05,.18,1.1,1.35,.3,'#322a42');box(.1,.65,.1,1.1,.36,0,'#1d1e2c');box(.9,.08,.65,1.1,.07,0,'#1d1e2c');
   // Library shelves and individually modeled books.
   [0.3,1.25,2.2,3.15].forEach(y=>box(1.2,.1,.7,-2.9,y,-2.5,'#aa8a7a','learning'));
   [-3.55,-2.25].forEach(x=>box(.09,3.35,.7,x,1.65,-2.5,'#79626b','learning'));
   for(let r=0;r<3;r++)for(let i=0;i<7;i++)box(.12,.45+(i%3)*.09,.44,-3.38+i*.16,.6+r*.95,-2.48,['#957b9f','#758c89','#bd9c8e','#675f81'][i%4],'learning');
   // Bed and pillow.
   box(1.8,.45,2.7,-2.65,.3,.95,'#57405a');box(1.83,.25,2.72,-2.65,.63,.95,'#b3a2bc');box(1.83,.1,1.65,-2.65,.81,1.4,'#817492');box(1.2,.23,.5,-2.65,.88,-.02,'#d4c1d0');
   box(1.9,1,.12,-2.65,.7,-.45,'#68536a');
   // Photo wall, selecting any print opens memories.
   for(let r=0;r<2;r++)for(let i=0;i<3;i++){
    box(.48,.55,.07,2.2+i*.57,2.4+r*.7,-2.85,'#eee0d1','memories');
    box(.39,.4,.015,2.2+i*.57,2.45+r*.7,-2.8,['#6f8e87','#aaa0b9','#d5b58e'][(r+i)%3],'memories');
   }
   // Rug and planter.
   box(3.5,.02,2.4,.1,.005,1.15,'#605570');box(.4,.55,.4,3.35,.3,-1.5,'#c3a38b');
   for(let i=0;i<6;i++){const g=new T.SphereGeometry(.2,10,8);geometries.push(g);const m=new T.MeshStandardMaterial({color:'#607f72'});mats.push(m);const leaf=new T.Mesh(g,m);leaf.scale.set(1,2,.4);leaf.position.set(3.35+Math.sin(i)*.22,.8+i*.08,-1.5+Math.cos(i)*.2);leaf.rotation.z=Math.sin(i)*.5;scene.add(leaf);}
   // Original full-body avatar retained as a labeled illustration, never an invented model.
   const loader=new T.TextureLoader();const tex=loader.load('/images/world/avatar.webp',()=>{if(!stopped)render();});textures.push(tex);tex.colorSpace=T.SRGBColorSpace;
   const ag=new T.PlaneGeometry(1.35,2.03),am=new T.MeshBasicMaterial({map:tex,side:T.DoubleSide});geometries.push(ag);mats.push(am);
   const avatar=new T.Mesh(ag,am);avatar.position.set(.0,1.1,1.3);scene.add(avatar);
   const ray=new T.Raycaster(),pointer=new T.Vector2();let down=[0,0];
   const hit=(e:PointerEvent)=>{const b=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-b.left)/b.width*2-1,-(e.clientY-b.top)/b.height*2+1);ray.setFromCamera(pointer,camera);return ray.intersectObjects(meshes).find(h=>h.object.userData.route)?.object.userData.route as string|undefined;};
   const move=(e:PointerEvent)=>{const route=hit(e);renderer.domElement.style.cursor=route?'pointer':'grab';setHover(route||'');};
   const start=(e:PointerEvent)=>{down=[e.clientX,e.clientY];};
   const end=(e:PointerEvent)=>{if(Math.hypot(e.clientX-down[0],e.clientY-down[1])>6)return;const route=hit(e);if(route)window.location.assign('/world/'+route);};
   function render(){if(!stopped)renderer.render(scene,camera);}
   const resize=new ResizeObserver(()=>{const w=el.clientWidth,h=el.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();render();});resize.observe(el);
   controls.addEventListener('change',render);renderer.domElement.addEventListener('pointermove',move);renderer.domElement.addEventListener('pointerdown',start);renderer.domElement.addEventListener('pointerup',end);
   const lost=(e:Event)=>{e.preventDefault();setStatus('error');};renderer.domElement.addEventListener('webglcontextlost',lost);
   changeView.current=(n)=>{camera.position.set(...([[9,8,11],[.2,5,12],[8,11,2]] as [number,number,number][])[n]);controls.update();render();};controls.update();render();setStatus('ready');
   cleanup=()=>{resize.disconnect();controls.dispose();renderer.domElement.removeEventListener('pointermove',move);renderer.domElement.removeEventListener('pointerdown',start);renderer.domElement.removeEventListener('pointerup',end);renderer.domElement.removeEventListener('webglcontextlost',lost);geometries.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());renderer.dispose();renderer.domElement.remove();};
  })().catch(()=>{if(!stopped)setStatus('error');});
  return()=>{stopped=true;cleanup();};
 },[]);
 const names:Record<string,string>=language==='zh'?{lab:'电脑 · 项目',learning:'书架 · 学习',memories:'照片墙 · 旅行',thoughts:'笔记本 · 思考'}:{lab:'Computer · Projects',learning:'Bookshelf · Learning',memories:'Photo wall · Memories',thoughts:'Notebook · Thoughts'};
 return <div className={"dw-live-room "+(status==='error'?'dw-room-failed':'')}><div ref={host} className="dw-canvas" aria-label={language==='zh'?'可旋转三维创作室；也可使用下方文字入口':'Orbitable 3D room; text navigation follows'} />{status!=='ready'&&<p className="dw-room-status" role="status">{status==='error'?(language==='zh'?'此设备无法加载 3D，请使用下方文字入口。':'3D is unavailable. Use the text navigation below.'):(language==='zh'?'正在准备创作室…':'Preparing the room…')}</p>}{status!=='error'&&<div className="dw-room-controls">{[language==='zh'?'全景':'Overview',language==='zh'?'正面':'Front',language==='zh'?'俯视':'Above'].map((x,i)=><button key={x} onClick={()=>changeView.current(i)}>{x}</button>)}<span aria-live="polite">{names[hover]|| (language==='zh'?'拖动旋转 · 滚轮缩放':'Drag to orbit · Scroll to zoom')}</span></div>}</div>;
}
