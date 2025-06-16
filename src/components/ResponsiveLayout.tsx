"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import Topbar from "./Topbar";
//import { Player } from "./Player";
import MobileTabs from "./MobileTabs";

import React, { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./shared/MobileNav";

export default function ResponsiveLayout({ children }: { children: ReactNode }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [hydrated, setHydrated] = React.useState(false); 
  
  React.useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    // Render nothing or a loading skeleton until hydration
    return null;
  }  
  
  return (
    <>
      {isMobile && <MobileNav /> }    
     <div className="flex flex-col h-screen">
     {!isMobile && <Topbar />}
     <div className="flex flex-1 overflow-hidden">
       {!isMobile && <Sidebar />}
       <main className="flex-1 overflow-y-auto px-4 pb-24 mb-15">{children}</main>
     </div>
     {isMobile && <MobileTabs />}
     </div>
    </>
);
}