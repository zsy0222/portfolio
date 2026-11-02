'use client';
import {usePathname} from 'next/navigation';
import Sidebar from './Sidebar';
export default function SiteShell({children}:{children:React.ReactNode}){
 const path=usePathname();const world=path==='/'||path.startsWith('/world');
 return <div id="top" className={world?'min-h-screen':'min-h-screen lg:flex'}>{!world&&<Sidebar/>}<main id="main-content" tabIndex={-1} className="min-w-0 flex-1">{children}</main></div>;
}
