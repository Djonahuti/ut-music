"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Ellipsis, Pencil, Shuffle, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Song {
  id: string;
  title: string;
  duration: number;
  cover_url: string;
  artists: { name: string };
  albums: { name: string; release_year: number };
  genres: { name: string };
}

interface Playlist {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  is_public?: boolean;
}

export default function PlaylistDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      const { data: playlistData } = await supabase
        .from("playlists")
        .select("*")
        .eq("id", id)
        .single();

      const { data: playlistSongs } = await supabase
        .from("playlist_songs")
        .select("song_id, songs(*, artists(name), albums(name, release_year), genres(name))")
        .eq("playlist_id", id);

      setPlaylist(playlistData || null);
      setSongs(
        (playlistSongs || [])
          .map((ps) => ps.songs)
          .filter(Boolean)
          .flat()
      );
    };

    fetchPlaylistDetails();
  }, [id]);

  // Helper to format duration in mm:ss
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Calculate total duration
  const totalDuration = songs.reduce((acc, song) => acc + (song.duration || 0), 0);
  const totalMinutes = Math.floor(totalDuration / 60);
  const totalSeconds = totalDuration % 60;

  return (
    <div className="w-full p-6 mx-auto">
     <div className="flex justify-between">
      <div className="fixed top-3 left-3 z-50 text-3xl font-bold md:hidden">
        <Link href="/playlists"><ChevronLeft /></Link>
      </div>
      <div className="fixed top-3 right-3 z-50 text-3xl font-bold md:hidden">
         <DropdownMenu>
           <DropdownMenuTrigger
            className="p-1 rounded hover:bg-muted transition ml-2"
           >
             <Ellipsis size={20} color="blue" />
           </DropdownMenuTrigger>
           <DropdownMenuContent>
             <DropdownMenuLabel>...</DropdownMenuLabel>
             <DropdownMenuSeparator />
             <DropdownMenuItem>
               <Link
                 href={`/playlist/${id}/edit`}
                 className="flex items-center gap-2 py-2 cursor-pointer hover:text-blue-600"
               >
                <span className="flex items-center"><Pencil /></span>
                <span>Edit Playlist</span>
               </Link>                    
             </DropdownMenuItem>
             <DropdownMenuItem>
               <Link
                 href="/"
                 className="flex items-center gap-2 py-2 cursor-pointer hover:text-blue-600"
               >
                <span className="flex items-center"><Trash2 color="red" /></span>
                <span>Delete Playlist</span>
               </Link>                    
             </DropdownMenuItem>
           </DropdownMenuContent>
         </DropdownMenu> 
      </div>
     </div> 
      {playlist ? (
        <>
          {/* Header */}
          <div className="flex items-center gap-6 mb-8">
            <div>
            {playlist.image_url ? (
              <Image
                src={playlist.image_url}
                alt={playlist.title}
                width={140}
                height={140}
                className="rounded shadow object-cover"
              />
            ) : (
              <div className="w-[140px] h-[140px] rounded-lg shadow bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center">
                <span className="text-xl font-semibold text-gray-800 text-center px-2">
                  {playlist.title}
                </span>
              </div>
            )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{playlist.title}</h1>
              <div className="text-sm text-gray-500 mb-2">
                {songs.length} Songs · {totalMinutes}hrs, {totalSeconds}min
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={playlist.is_public} readOnly />
                Publish on profile and in search
              </label>
            </div>
            <div className="flex items-center justify-between">
              <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800">
                <Shuffle size={18} /><p className="hidden md:block">Shuffle All</p>
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger
                 className="p-1 rounded hover:bg-muted transition ml-2"
                >
                  <div className="bg-blue-600 text-white rounded-full p-3">
                    <Ellipsis size={20} />                    
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>...</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link
                      href={`/playlist/${id}/edit`}
                      className="flex items-center gap-2 py-2 cursor-pointer hover:text-blue-600"
                    >
                     <span className="flex items-center"><Pencil /></span>
                     <span>Edit Playlist</span>
                    </Link>                    
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href="/"
                      className="flex items-center gap-2 py-2 cursor-pointer hover:text-blue-600"
                    >
                     <span className="flex items-center"><Trash2 color="red" /></span>
                     <span>Delete Playlist</span>
                    </Link>                    
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>              
            </div>
          </div>

          {/* Song List */}
          <ul className="divide-y border-t">
            {songs.map((song) => (
              <li key={song.id} className="flex items-center py-4 gap-4">
                <Image
                  src={song.cover_url}
                  alt={song.title}
                  width={60}
                  height={60}
                  className="rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{song.title}</div>
                  <div className="text-sm text-gray-500 truncate">
                    {song.artists?.name}
                  </div>
                </div>
                <div className="w-16 text-sm text-gray-500 text-center">
                  {song.albums?.release_year || "2024"}
                </div>
                <div className="w-24 text-sm text-gray-500 text-center">
                  {song.genres?.name || "Afrobeat"}
                </div>
                <div className="w-12 text-sm text-gray-500 text-right">
                  {formatDuration(song.duration)}
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Loading playlist...</p>
      )}
    </div>
  );
}
