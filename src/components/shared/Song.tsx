"use client";

import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Ellipsis, List, Mic, Play, Shuffle } from "lucide-react";
import { addSongToPlaylist, createPlaylist, fetchUserPlaylists } from "@/lib/actions";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";

interface Song {
  id: string
  title: string
  artist_id: string
  album_id: string
  cover_url: string
  duration: number
  artists: { name: string };
  albums: { name: string };
  genres: { name: string };
  plays: number;
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function Song() {
  const [songs, setSongs] = useState<Song[]>([])
  const [search, setSearch] = useState("")
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);   
  const user = useAuth();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState("");

  const fetchSongs = async () => {
    const { data } = await supabase
    .from("songs")
    .select(`*, artists(name), albums(name), genres(name)`)
    .order("id", { ascending: true })
    setSongs(data || [])
  }

  useEffect(() => {
    fetchSongs()
  }, [])

  const filtered = songs.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    if (user && user.user && user.user.id) {
      fetchUserPlaylists(user.user.id).then(setPlaylists).catch(console.error);
    }
  }, [user]);  

  const handleAddToPlaylist = async (playlistId: string, songId: string) => {
    try {
      await addSongToPlaylist(playlistId, songId);
      toast.success("Song added to playlist");
    } catch (err) {
      toast.error("Failed to add song");
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistTitle || !user?.user?.id) return;
    try {
      const playlist = await createPlaylist(user.user.id, newPlaylistTitle);
      setPlaylists([playlist, ...playlists]);
      setCreatingPlaylist(false);
      setNewPlaylistTitle("");
      toast.success("Playlist created");
    } catch (err) {
      toast.error("Failed to create playlist");
    }
  };

  // Group songs by first letter for mobile alpha list
  const groupedSongs = filtered.reduce((acc: Record<string, Song[]>, song) => {
    const letter = song.title[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(song);
    return acc;
  }, {});

  const alpha = Object.keys(groupedSongs).sort();  

  return (
   <div className="space-y-4">
      {/* Desktop UI */}    
    <div className="hidden md:block">
      <div className="flex justify-between items-center">
        <Input placeholder="Search songs..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <Table className="w-full text-left">
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead>Album</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Plays</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((song) => (
            <TableRow
             key={song.id} 
             className="border-t group"
             onMouseEnter={() => setHoveredRow(song.id)}
             onMouseLeave={() => setHoveredRow(null)}
            >
              <TableCell>
                <Image
                  src={song.cover_url}
                  alt="song cover"
                  className="w-10 h-10 object-cover rounded"
                  width={40}
                  height={40}
                />
              </TableCell>
              <TableCell className="relative">
                <span>{song.title}</span>
                {(hoveredRow === song.id || openDropdown === song.id) && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2">
                    <DropdownMenu
                      open={openDropdown === song.id}
                      onOpenChange={(open) => setOpenDropdown(open ? song.id : null)}
                    >
                      <DropdownMenuTrigger asChild>
                        <button
                         className="p-1 rounded hover:bg-muted transition ml-2"
                         onClick={e => e.stopPropagation()}
                        >
                          <Ellipsis size={20} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuItem onClick={() => {/* handle minus from */}}>Add to Favorite</DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Add to Playlist</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                {playlists.map((p) => (
                                  <DropdownMenuItem key={p.id} onClick={() => handleAddToPlaylist(p.id, song.id)}>
                                    {p.title}
                                  </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                                {creatingPlaylist ? (
                                  <div className="flex items-center gap-2 px-2">
                                    <input
                                      type="text"
                                      className="border rounded p-1 text-sm w-full"
                                      value={newPlaylistTitle}
                                      onChange={(e) => setNewPlaylistTitle(e.target.value)}
                                      placeholder="New Playlist"
                                    />
                                    <button onClick={handleCreatePlaylist} className="text-xs text-blue-500">Add</button>
                                  </div>
                                ) : (
                                  <DropdownMenuItem onClick={() => setCreatingPlaylist(true)}>
                                    + Create New Playlist
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>More...</DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuItem onClick={() => {/* handle minus from */}}>Play Next</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {/* handle minus from */}}>Play Later</DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </span>
                )}                
              </TableCell>
              <TableCell className="max-w-[150px] truncate">{song.artists.name}</TableCell>
              <TableCell className="max-w-[150px] truncate">{song.albums.name}</TableCell>
              <TableCell>{song.genres.name}</TableCell>
              <TableCell>{formatDuration(song.duration)}</TableCell>
              <TableCell>{song.plays}</TableCell>             
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

      {/* Mobile UI */}
    <div className="block md:hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button className="text-pink-500 font-semibold text-lg">&lt; Library</button>
        <div className="flex items-center gap-2">
          <button className="p-2"><List size={22} className="text-white" /></button>
          <button className="p-2"><Ellipsis size={22} className="text-white" /></button>
        </div>
      </div>
      <div className="px-4">
        <h1 className="text-3xl font-bold mb-2">Songs</h1>
        {/* Search */}
        <div className="relative mb-4">
          <input
            className="w-full rounded-lg bg-[#232323] text-white py-2 pl-10 pr-10 placeholder-gray-400 focus:outline-none"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Mic className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
        {/* Play/Shuffle */}
        <div className="flex gap-4 mb-4">
          <button className="flex-1 flex items-center justify-center gap-2 bg-[#181818] rounded-lg py-3 text-pink-500 font-semibold text-lg">
            <Play size={22} fill="currentColor" className="mr-1" /> Play
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-[#181818] rounded-lg py-3 text-pink-500 font-semibold text-lg">
            <Shuffle size={22} className="mr-1" /> Shuffle
          </button>
        </div>
      </div>
      {/* Song List */}
      <div className="overflow-y-auto pb-24">
        {alpha.map(letter => (
          <div key={letter}>
            <div className="px-4 py-2 text-pink-500 font-bold text-lg">{letter}</div>
            {groupedSongs[letter].map(song => (
              <div key={song.id} className="flex items-center px-4 py-2 hover:bg-[#232323] transition group">
                <Image
                  src={song.cover_url}
                  alt="cover"
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded object-cover mr-3"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{song.title}</div>
                  <div className="text-gray-400 text-sm truncate">{song.artists.name}</div>
                </div>
                <button className="ml-2 p-2 rounded-full hover:bg-[#181818] transition">
                  <Ellipsis size={22} className="text-gray-300" />
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* Alpha index (right side) */}
      <div className="fixed right-1 top-32 flex flex-col items-center z-10">
        {alpha.map(letter => (
          <span key={letter} className="text-pink-500 text-xs py-0.5">{letter}</span>
        ))}
      </div>
    </div>      

   </div>
  )
}