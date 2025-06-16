import { IconCompassFilled, IconHome, IconLibrary, IconSearch, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import { Player } from "./Player";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function MobileTabs() {
  const pathname = usePathname();  
  const tabs = [
    { icon: <IconHome />, label: "Home", href: "/" },
    { icon: <IconCompassFilled />, label: "Explore", href: "/artists" },
    { icon: <IconLibrary />, label: "Library", href: "/albums" },
    { icon: <IconSearch />, label: "Search", href: "/genres" },
    { icon: <IconUser />, label: "User", href: "/account" },
  ];

  return (
   <>
   <div>
    <Player />
   </div>
   <nav className="fixed bottom-0 inset-x-0 bg-background border-t flex justify-around items-center h-14 md:hidden z-50">
     {tabs.map((tab) => (
       <Link
        key={tab.label} 
        href={tab.href} 
        className={cn(
          "flex flex-col items-center text-xs",
          pathname === tab.href ? "text-pink-500 font-semibold" : "font-normal"
          
        )}
       >
         {tab.icon}
         {tab.label}
       </Link>
     ))}
   </nav>
   </>
  );
}
