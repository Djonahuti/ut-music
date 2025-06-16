import { MobileNav } from "@/components/shared/MobileNav";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default async function HomePage() {
  const { data: albums, error } = await supabase
    .from("albums")
    .select(`*, artists(name)`)
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) {
    return <div className="p-4 text-red-500">Failed to load albums: {error.message}</div>;
  }

  return (
    <>
    <MobileNav />
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Recently Added</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {albums?.map((album) => (
          <div key={album.id} className="rounded overflow-hidden shadow-md">
            <Image
              src={album.cover_url}
              alt={album.name}
              width={300}
              height={300}
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
    </>
  );
}
