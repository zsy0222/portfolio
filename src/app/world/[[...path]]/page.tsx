import DigitalWorld from '@/components/DigitalWorld';
import {entries} from '@/data/world';
import {getAllPosts} from '@/lib/blog';
import {notFound} from 'next/navigation';
export function generateStaticParams(){return [{path:[]},...['studio','lab','learning','memories','thoughts','about'].map(p=>({path:[p]})),...entries.map(e=>({path:['entry',e.id]}))];}
export async function generateMetadata({params}:{params:Promise<{path?:string[]}>}){const {path=[]}=await params;const e=path[0]==='entry'?entries.find(x=>x.id===path[1]):null;return {title:e?e.title.zh+' — Chenmu':'Chenmu — Personal Digital World',description:e?.summary.zh||'A mind that builds, a world that remembers.'};}
export default async function Page({params}:{params:Promise<{path?:string[]}>}){
 const {path=[]}=await params;const section=path[0]||'';
 if(section==='entry'){if(path.length!==2||!entries.some(e=>e.id===path[1]))notFound();}else if(path.length>1||!['','studio','lab','learning','memories','thoughts','about'].includes(section))notFound();
 return <DigitalWorld section={section} entryId={path[1]} archive={getAllPosts().map(p=>({title:p.title,summary:p.summary,href:'/blog/'+p.slug,type:'article'}))}/>;
}
