import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default async function HomePage() {
  const { data: songs, error } = await supabase
    .from("songs")
    .select(`*, artists(name), albums(name)`)
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) {
    return <div className="p-4 text-red-500">Failed to load songs: {error.message}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Recently Added</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {songs?.map((song) => (
          <div key={song.id} className="rounded overflow-hidden shadow-md">
            <Image
              src={song.cover_url}
              alt={song.title}
              width={300}
              height={300}
              className="w-full"
            />
            <div className="p-2">
              <p className="font-medium">{song.title}</p>
              <p className="text-sm text-muted-foreground">{song.artists.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
