'use client';
import { supabase } from "@/lib/supabase";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Play } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePlayer } from "@/lib/playerContext";

interface Song {
  id: string;
  title: string;
  album_id: string;
  plays: number;
  audio_url?: string;
  cover_url?: string;
  duration?: number;
}

interface Album {
  id: string;
  name: string;
  cover_url: string;
  release_date: string;
  info: string;
  artists: {
    name: string;
  };
  songs: Song[];
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function AlbumDetails({ params }: { params: Promise<{ albumId: string }> }) {
  const player = usePlayer();
  const [album, setAlbum] = useState<Album | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { albumId } = React.use(params);

  useEffect(() => {
    const fetchAlbum = async () => {
      const { data, error } = await supabase
        .from("albums")
        .select(`*, artists(name), songs(id, title, cover_url, plays, audio_url, duration)`)
        .eq("id", albumId)
        .single();
      if (error) {
        setError(error.message);
      } else {
        setAlbum(data);
      }
    };
    fetchAlbum();
  }, [albumId]);

  useEffect(() => {
    const fetchSongs = async () => {
      if (!albumId) return;

      const { data, error } = await supabase
        .from("songs")
        .select("id, title, cover_url, plays, audio_url, album_id, duration")
        .eq("album_id", albumId)
        .limit(5); // Limit to popular 5 songs (or modify logic)

      if (error) {
        setError(error.message);
      } else {
        setSongs(data || []);
      }
    };
    fetchSongs();
  }, [albumId]);

  if (error) {
    return <div className="p-4 text-red-500">Failed to load album: {error}</div>;
  }

  return (
    <div className="p-4">
      {album && (
        <>
            <div className="col-span-10 flex flex-col justify-between">
              {/* Album header */}
              <div className="relative h-64 w-full">
                <Image
                  src={album.cover_url} // Replace with your image path
                  alt={album.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw"
                  style={{ objectFit: 'cover' }}
                  className="object-cover opacity-80"
                />
                <div className="absolute bottom-4 left-4">
                  <Avatar className="w-24 h-24 mb-2 rounded-full overflow-hidden">
                    <AvatarImage
                      src={album.cover_url}
                      alt={album.name}
                      className="rounded-full w-full h-full object-cover"
                    />
                    <AvatarFallback className="bg-gray-800 text-white">
                      {album.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 text-sm font-medium">Verified Album</span>
                  </div>
                  <h1 className="text-5xl font-bold">{album.name}</h1>
                  <p className="text-sm text-gray-300">16,369,572 monthly listeners</p>
                </div>
              </div>

              {/* Controls and popular track */}
              <div className="p-6 bg-gradient-to-b from-neutral-900 to-black">
                <div className="flex items-center gap-6">
                  <Button
                   size="icon"
                   onClick={() => {
                      if (!player || songs.length === 0) return;
  
                      const formattedSongs = songs.map((song) => ({
                        id: song.id,
                        title: song.title,
                        artist: album?.artists?.name ?? 'Unknown',
                        album: album?.name ?? 'Unknown',
                        image: song.cover_url ?? '/img/default-cover.jpg',
                        src: song.audio_url ? `/audio/${song.audio_url}` : '',
                        audio_url: song.audio_url ?? ''
                      }));
  
                      player.setQueue(formattedSongs);
                      player.setCurrentTrack(formattedSongs[0]);
                      player.setIsPlaying(true);
                   }} 
                   className="bg-green-500 hover:bg-green-600 text-black rounded-full"
                  >
                    <Play className="w-6 h-6" />
                  </Button>
                  <Button variant="secondary">Following</Button>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-accent-500">
                    <MoreHorizontal />
                  </Button>
                </div>

                <div className="mt-6">
                  <h2 className="text-xl font-bold mb-4">Popular</h2>
              {songs.map((song) => (
                <div key={song.id} className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-md">
                      <Image
                        src={song.cover_url || "/globe.svg"}
                        alt={song.title}
                        width={40}
                        height={40}
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-400">{song.title}</p>
                      <p className="text-xs text-gray-400">{song.plays}+ plays</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">
                    {song.duration ? formatDuration(song.duration) : 'N/A'}
                  </span>
                </div>
              ))}
                </div>
              </div>

              {/* Footer Bio */}
              <div className="font-sans antialiased flex flex-col items-center mt-2">
                <div className="w-full">
                  {/* About Section Header */}
                  <h1 className="text-3xl font-bold mb-6">About</h1>
                      
                  {/* Album Image and Details */}
                  <div className="relative h-64 w-full rounded-lg overflow-hidden mb-8">
                    <Image
                      src={album.cover_url}
                      alt={album.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw"
                      style={{ objectFit: 'cover' }}
                      className="object-cover" // Responsive height
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                      <p className="text-xl md:text-2xl font-bold mb-2"> monthly listeners</p>
                      <p className="text-sm md:text-base leading-relaxed max-w-2xl">{album.info}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
        </>
      )}
    </div>
  );
}
