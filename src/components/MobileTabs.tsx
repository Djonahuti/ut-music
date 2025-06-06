import { IconCompassFilled, IconHome, IconLibrary, IconSearch, IconUser } from "@tabler/icons-react";
import Link from "next/link";

export default function MobileTabs() {
  const tabs = [
    { icon: <IconHome />, label: "Home", href: "/" },
    { icon: <IconCompassFilled />, label: "Explore", href: "/explore" },
    { icon: <IconLibrary />, label: "Library", href: "/library" },
    { icon: <IconSearch />, label: "Search", href: "/search" },
    { icon: <IconUser />, label: "User", href: "/account" },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-background border-t flex justify-around items-center h-14 md:hidden z-50">
      {tabs.map((tab) => (
        <Link key={tab.label} href={tab.href} className="flex flex-col items-center text-xs">
          {tab.icon}
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
