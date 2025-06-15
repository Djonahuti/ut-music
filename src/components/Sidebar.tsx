"use client";
import { cn } from "@/lib/utils";
import { IconAlbum, IconCalendarWeekFilled, IconMicrophone, IconPlaylist } from "@tabler/icons-react";
import { Guitar, Music2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();
  const libraryItems = [
    { icon: <IconCalendarWeekFilled />, label: "Recently Added", href: "/" },
    { icon: <IconMicrophone />, label: "Artists", href: "/artists" },
    { icon: <IconAlbum />, label: "Albums", href: "/albums" },
    { icon: <Music2 />, label: "Songs", href: "/songs" },
    { icon: <Guitar />, label: "Genre", href: "/genres" },
    { icon: <IconPlaylist />, label: "Playlist", href: "/playlists" },
  ];

  const playlistItems = [
    "Hot 9JA 2025",
    "Best of Kendrick Lamar",
    "Hot UK Rap 2025",
    "Hot R&B Playlist",
    "Slow Vibes",
  ];

  return (
    <aside className="w-64 p-4 border-r overflow-y-auto hidden md:block">
      <h2 className="font-semibold mb-4">Library</h2>
      <nav className="space-y-2 mb-6">
        {libraryItems.map(({ icon, label, href }) => (
          <Link
           key={href} 
           className={cn(
             "flex items-center gap-2 cursor-pointer hover:underline",
             pathname === href ? "text-blue-500 font-semibold" : "font-normal"
           )} 
           href={href}
          >
            {icon}
            {label}
          </Link>
        ))}
      </nav>
      <h2 className="font-semibold mb-2">Music Playlists</h2>
      <ul className="space-y-1">
        {playlistItems.map((name) => (
          <li key={name} className="cursor-pointer hover:underline text-sm">
            {name}
          </li>
        ))}
      </ul>
    </aside>
  );
}
