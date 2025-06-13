"use client";

import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Artist {
  id: string
  name: string
  bio: string
  image_url: string
}

export function Artist() {
  const router = useRouter();  
  const [artists, setArtists] = useState<Artist[]>([])
  const [search, setSearch] = useState("")

  const fetchArtists = async () => {
    const { data } = await supabase.from("artists").select("*")
    setArtists(data || [])
  }

  const handleArtistClick = (artistId: string) => {
    router.push(`/artist_info/${artistId}`);
  };

  useEffect(() => {
    fetchArtists()
  }, [])

  const filtered = artists.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
     <div className="flex justify-between items-center">
      <Input placeholder="Search artists..." value={search} onChange={(e) => setSearch(e.target.value)} />
       </div> 
      <Table className="w-full text-left">
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Bio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((artist) => (
            <TableRow key={artist.id} onClick={() => handleArtistClick(artist.id)} className="border-t">
              <TableCell>
                <Image
                 src={artist.image_url} 
                 alt="artist" 
                 className="w-12 h-12 object-cover rounded-full" 
                 width={48}
                 height={48}
                />
              </TableCell>
              <TableCell>{artist.name}</TableCell>
              <TableCell className="max-w-[200px] truncate">{artist.bio}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}