"use client";

import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Album {
  id: string
  name: string
  info: string
  cover_url: string
  artists: {
    name: string
  }
}

export function Album() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const router = useRouter();

  const fetchAlbums = async () => {
    const { data: albums, error } = await supabase
      .from("albums")
      .select(`*, artists(name)`)
      .order("created_at", { ascending: false })
      .limit(12);

    if (error) {
      return <div className="p-4 text-red-500">Failed to load albums: {error.message}</div>;
    }

    setAlbums(albums);
  };

  const handleAlbumClick = (albumId: string) => {
    router.push(`/album_detail/${albumId}`);
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {albums?.map((album) => (
          <div key={album.id} className="rounded overflow-hidden shadow-md cursor-pointer" onClick={() => handleAlbumClick(album.id)}>
            <Image
              src={album.cover_url}
              alt={album.name}
              width={200}
              height={200}
              className="w-full"
            />
            <div className="p-2">
              <p className="font-medium">{album.name}</p>
              <p className="text-sm text-muted-foreground">{album.artists.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
