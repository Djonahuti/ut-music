"use client";

import { useState, useEffect } from "react";
import { Play, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { usePlayer } from "@/lib/playerContext";

interface Genre {
  id: string
  name: string
  description: string
  songs: Song[];  
}

interface Song {
  id: string;
  title: string;
  album_id: string;
  artist_id: string;
  artists: { name: string } | null;
  plays: number;
  audio_url?: string;
  cover_url?: string;
  duration?: number;
}

export function Genre() {
  const player = usePlayer();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      const { data } = await supabase.from("genres").select("*");
      if (data) setGenres(data);
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchSongs = async () => {
      if (!selectedGenre) return;
      const { data } = await supabase
        .from("songs")
        .select(`*, artists(name), artist_id`)
        .eq("genre_id", selectedGenre.id)
        .order("created_at", { ascending: false });
      if (data) setSongs(data);
    };
    fetchSongs();
  }, [selectedGenre]);

  return (
    <div className="h-screen w-full">
      <div className="grid grid-cols-12 h-full">
        {/* Sidebar */}
        <div className="col-span-2 p-4 space-y-4 overflow-y-auto">
          <h2 className="text-lg font-bold">Genres</h2>
          <ul className="space-y-2">
            {genres.map((genre) => (
              <li
                key={genre.id}
                onClick={() => setSelectedGenre(genre)}
                className={`cursor-pointer hover:bg-blue-800 hover:text-gray-300 rounded-md p-2 ${
                  selectedGenre?.id === genre.id ? "bg-blue-800 text-gray-300" : ""
                }`}
              >
                <span>{genre.name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Main content */}
        <div className="col-span-10 flex flex-col justify-between">
          {/* Header */}
          <div className="relative h-64 w-full">
            <Image
              src="/globe.svg"
              alt="Genre"
              fill
              className="object-cover opacity-80"
            />
            <div className="absolute bottom-4 left-4">
              <h1 className="text-5xl font-bold">
                {selectedGenre?.name || "Select a Genre"}
              </h1>
              <p className="text-sm">
                {selectedGenre?.description || "Explore music by genre"}
              </p>
            </div>
          </div>

          {/* Songs */}
          <div className="p-6 bg-gradient-to-b from-neutral-900 to-black overflow-y-auto">
            <div className="flex items-center gap-6">
              <Button
               size="icon"
               onClick={() => {
                  if (!player || songs.length === 0) return;
  
                  const formattedSongs = songs.map((song) => ({
                    id: song.id,
                    title: song.title,
                    artist: song.artists?.name ?? 'Unknown',
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
              <Button variant="secondary">Like</Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-accent-500">
                <MoreHorizontal />
              </Button>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4 text-gray-300">Tracks</h2>
              <div className="space-y-4">
                {songs.map((song) => (
                  <div
                    key={song.id}
                    className="flex justify-between items-center hover:bg-neutral-800 p-3 rounded-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-md overflow-hidden">
                        {song.cover_url && (
                          <Image
                            src={song.cover_url}
                            alt={song.title}
                            width={56}
                            height={56}
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-300">{song.title}</p>
                        <p className="text-xs text-gray-400">{song.plays?.toLocaleString()} plays</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">
                      {Math.floor((song.duration || 0) / 60)}:{(song.duration || 0) % 60 < 10 ? "0" : ""}
                      {(song.duration || 0) % 60}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
              <div className="font-sans antialiased flex flex-col items-center mt-2">
                <div className="w-full">
                  {/* About Section Header */}
                  <h1 className="text-3xl font-bold mb-6">About</h1>
                      
                  {/* Artist Image and Details */}
                  <div className="relative h-64 w-full rounded-lg overflow-hidden mb-8">
                    <Image
                      src='/globe.svg' // Placeholder image, replace with artist image
                      alt={selectedGenre?.name || "Genre"}
                      fill
                      sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw"
                      style={{ objectFit: 'cover' }}
                      className="object-cover" // Responsive height
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                      <p className="text-xl md:text-2xl font-bold mb-2"> monthly listeners</p>
                      <p className="text-sm md:text-base leading-relaxed max-w-2xl">{selectedGenre?.description || "Explore music by genre"}</p>
                    </div>
                  </div>
                </div>
              </div>

        </div>
      </div>
    </div>
  );
}
