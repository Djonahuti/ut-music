"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import { Player } from "./Player";
import MobileTabs from "./MobileTabs";


import { ReactNode } from "react";

export default function ResponsiveLayout({ children }: { children: ReactNode }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return (
    <>
     <div className="flex flex-col h-screen">
     {!isMobile && <Topbar />}
     <div className="flex flex-1 overflow-hidden">
       {!isMobile && <Sidebar />}
       <main className="flex-1 overflow-y-auto px-4 pb-24">{children}</main>
     </div>
     <Player />
     {isMobile && <MobileTabs />}
     </div>
    </>
);
}