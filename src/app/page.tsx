import DigitalWorld from '@/components/DigitalWorld';
import {getAllPosts} from '@/lib/blog';
export default function Home(){return <DigitalWorld archive={getAllPosts().map(p=>({title:p.title,summary:p.summary,href:'/blog/'+p.slug,type:'article'}))}/>;}
