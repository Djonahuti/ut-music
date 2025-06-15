'use client';
import { supabase } from "@/lib/supabase";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Play } from "lucide-react";

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
            <div className="col-span-10 flex flex-col justify-between">
              {/* Artist header */}
              <div className="relative h-64 w-full">
                <Image
                  src={artist.image_url} // Replace with your image path
                  alt={artist.name}
                  fill
                  className="object-cover opacity-80"
                />
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 text-sm font-medium">Verified Artist</span>
                  </div>
                  <h1 className="text-5xl font-bold">{artist.name}</h1>
                  <p className="text-sm text-gray-300">16,369,572 monthly listeners</p>
                </div>
              </div>

              {/* Controls and popular track */}
              <div className="p-6 bg-gradient-to-b from-neutral-900 to-black">
                <div className="flex items-center gap-6">
                  <Button size="icon" className="bg-green-500 hover:bg-green-600 text-black rounded-full">
                    <Play className="w-6 h-6" />
                  </Button>
                  <Button variant="secondary">Following</Button>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-accent-500">
                    <MoreHorizontal />
                  </Button>
                </div>

                <div className="mt-6">
                  <h2 className="text-xl font-bold mb-4">Popular</h2>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-neutral-700 rounded-md"></div>
                      <div>
                        <p className="font-medium text-gray-400">WAIT FOR U (feat. Drake & Tems)</p>
                        <p className="text-xs text-gray-400">1,087,280,173 plays</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">3:09</span>
                  </div>
                </div>
              </div>

              {/* Footer Bio */}
              <div className="font-sans antialiased flex flex-col items-center mt-2">
                <div className="w-full">
                  {/* About Section Header */}
                  <h1 className="text-3xl font-bold mb-6">About</h1>
                      
                  {/* Artist Image and Details */}
                  <div className="relative h-64 w-full rounded-lg overflow-hidden mb-8">
                    <Image
                      src={artist.image_url}
                      alt={artist.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw"
                      style={{ objectFit: 'cover' }}
                      className="object-cover" // Responsive height
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                      <p className="text-xl md:text-2xl font-bold mb-2"> monthly listeners</p>
                      <p className="text-sm md:text-base leading-relaxed max-w-2xl">{artist.bio}</p>
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
