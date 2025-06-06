import { IconAlbum, IconCalendarWeekFilled, IconMicrophone } from "@tabler/icons-react";
import { Guitar, Music2 } from "lucide-react";

export default function Sidebar() {
  const libraryItems = [
    { icon: <IconCalendarWeekFilled />, label: "Recently Added" },
    { icon: <IconMicrophone />, label: "Artists" },
    { icon: <IconAlbum />, label: "Albums" },
    { icon: <Music2 />, label: "Songs" },
    { icon: <Guitar />, label: "Genre" },
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
      <ul className="space-y-2 mb-6">
        {libraryItems.map(({ icon, label }) => (
          <li key={label} className="flex items-center gap-2 cursor-pointer hover:underline">
            {icon}
            {label}
          </li>
        ))}
      </ul>
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
