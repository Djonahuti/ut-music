"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface Song {
  id: string;
  title: string;
  duration: number;
  cover_url: string;
  artists: { name: string };
  albums: { name: string };
}

interface Playlist {
  id: string;
  title: string;
  description: string;
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
        .select("song_id, songs(*, artists(name), albums(name))")
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

  return (
    <div className="p-6 space-y-6">
     <div className="fixed top-3 inset-x-0 z-50 left-3 text-3xl text-bold md:hidden"><Link href="/playlists"><ChevronLeft /></Link></div>        
      {playlist ? (
        <>
          <h1 className="text-2xl font-bold">{playlist.title}</h1>
          <p className="text-sm text-muted-foreground">{playlist.description}</p>

          <ul className="divide-y mt-4">
            {songs.map((song) => (
              <li key={song.id} className="py-3 flex items-center gap-4">
                <Image
                  src={song.cover_url}
                  alt={song.title}
                  width={60}
                  height={60}
                  className="rounded object-cover"
                />
                <div>
                  <div className="font-medium">{song.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {song.artists?.name} • {song.albums?.name}
                  </div>
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
