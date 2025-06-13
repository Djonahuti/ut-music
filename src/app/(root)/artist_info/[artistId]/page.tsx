'use client';
import { supabase } from "@/lib/supabase";
import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Artist {
  id: string
  name: string
  bio: string
  image_url: string
}

export default function ArtistInfo({ params }: { params: Promise<{ artistId: string }> }) {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { artistId } = React.use(params);

  useEffect(() => {
    const fetchArtist = async () => {
      const { data, error } = await supabase
        .from("artists")
        .select(`*`)
        .eq("id", artistId)
        .single();
      if (error) {
        setError(error.message);
      } else {
        setArtist(data);
      }
    };
    fetchArtist();
  }, [artistId]);

  if (error) {
    return <div className="p-4 text-red-500">Failed to load artist: {error}</div>;
  }

  return (
    <div className="p-4">
      {artist && (
        <>
          <h1 className="text-2xl font-bold">{artist.name}</h1>
          <Image src={artist.image_url} alt={artist.name} width={500} height={500} className="w-full rounded" />
          <h2 className="mt-4 text-lg">Bio:</h2>
          <p className="mt-2 text-gray-600">{artist.bio}</p>
        </>
      )}
    </div>
  );
}
