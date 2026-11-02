/** Static companion to the Next.js app. Existing server-backed routes stay at the original portfolio origin. */
import React from 'react';
import {build} from 'esbuild';
import {mkdir,writeFile,cp} from 'node:fs/promises';
import path from 'node:path';
import {entries} from '../src/data/world';
import {getAllPosts} from '../src/lib/blog';
async function main(){
 const out=process.argv[2];if(!out||!path.isAbsolute(out))throw Error('Pass an absolute output directory');
 await mkdir(out,{recursive:true});
 // Bundle the component for server rendering; CSS is emitted separately for the browser build.
 const server=await build({entryPoints:['src/components/DigitalWorld.tsx'],bundle:true,platform:'node',format:'cjs',write:false,external:['react','react-dom'],loader:{'.css':'empty'}});
 const {createRequire}=await import('node:module');const require=createRequire(import.meta.url);const mod={exports:{}};
 new Function('require','module','exports',server.outputFiles[0].text)(require,mod,mod.exports);
 const Component=(mod.exports as {default:React.ComponentType<Record<string,unknown>>}).default;
 const {renderToString}=await import('react-dom/server');
 await build({entryPoints:['scripts/world-client.tsx'],bundle:true,format:'esm',splitting:true,outdir:path.join(out,'app'),minify:true,define:{'process.env.NODE_ENV':'"production"'},external:['/images/*'],entryNames:'world',chunkNames:'chunk-[hash]',jsx:'automatic'});
 await cp('public/images',path.join(out,'images'),{recursive:true});
 const archive=getAllPosts().map(p=>({title:p.title,summary:p.summary,href:'/blog/'+p.slug,type:'article'}));
 const routes=[{url:'',section:''},{url:'world',section:''},...['studio','lab','learning','memories','thoughts','about'].map(s=>({url:'world/'+s,section:s})),...entries.map(e=>({url:'world/entry/'+e.id,section:'entry',entryId:e.id}))];
 for(const route of routes){const props={...route,archive,archiveOrigin:'https://chenmuqingtongyan.vercel.app'};const body=renderToString(<Component {...props}/>);const dir=path.join(out,route.url);await mkdir(dir,{recursive:true});const e='entryId'in route?entries.find(e=>e.id===route.entryId):null;
 await writeFile(path.join(dir,'index.html'),`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#f5f2ee"><title>${e?.title.zh||'Chenmu — Personal Digital World'}</title><meta name="description" content="A mind that builds, a world that remembers."><link rel="stylesheet" href="/app/world.css"><style>body{margin:0}*{box-sizing:border-box}a,button{-webkit-tap-highlight-color:transparent}.skip{position:absolute;top:-100px}.skip:focus{top:5px;z-index:100;background:white;padding:12px}</style></head><body><a class="skip" href="#world-root">跳转到内容 / Skip to content</a><main id="world-root">${body}</main><script id="world-props" type="application/json">${JSON.stringify(props).replace(/</g,'\\u003c')}</script><script type="module" src="/app/world.js"></script></body></html>`);}
 console.log(`Rendered ${routes.length} routes to ${out}`);
}
main().catch(e=>{console.error(e);process.exitCode=1;});
