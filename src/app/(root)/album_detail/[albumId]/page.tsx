'use client';
import { supabase } from "@/lib/supabase";
import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Song {
  id: string;
  title: string;
  album_id: string;
}

interface Album {
  id: string;
  name: string;
  cover_url: string;
  artists: {
    name: string;
  };
  songs: Song[];
}

export default function AlbumDetails({ params }: { params: Promise<{ albumId: string }> }) {
  const [album, setAlbum] = useState<Album | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { albumId } = React.use(params);

  useEffect(() => {
    const fetchAlbum = async () => {
      const { data, error } = await supabase
        .from("albums")
        .select(`*, artists(name), songs(id, title)`)
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

  if (error) {
    return <div className="p-4 text-red-500">Failed to load album: {error}</div>;
  }

  return (
    <div className="p-4">
      {album && (
        <>
          <h1 className="text-2xl font-bold">{album.name}</h1>
          <Image src={album.cover_url} alt={album.name} width={500} height={500} className="w-full rounded" />
          <h2 className="mt-4 text-lg">By: {album.artists.name}</h2>
          <h3 className="mt-4 text-lg">Songs:</h3>
          <ul className="list-disc pl-5">
            {album.songs.map((song: Song) => (
              <li key={song.id}>{song.title}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
