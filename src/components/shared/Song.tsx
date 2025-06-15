"use client";

import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Song {
  id: string
  title: string
  artist_id: string
  album_id: string
  cover_url: string
  duration: number
  artists: { name: string };
  albums: { name: string };
  genres: { name: string };
  plays: number;
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function Song() {
  const [songs, setSongs] = useState<Song[]>([])
  const [search, setSearch] = useState("")

  const fetchSongs = async () => {
    const { data } = await supabase
    .from("songs")
    .select(`*, artists(name), albums(name), genres(name)`)
    .order("id", { ascending: true })
    setSongs(data || [])
  }

  useEffect(() => {
    fetchSongs()
  }, [])

  const filtered = songs.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input placeholder="Search songs..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <Table className="w-full text-left">
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead>Album</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Plays</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((song) => (
            <TableRow key={song.id} className="border-t">
              <TableCell>
                <Image
                  src={song.cover_url}
                  alt="song cover"
                  className="w-10 h-10 object-cover rounded"
                  width={40}
                  height={40}
                />
              </TableCell>
              <TableCell>{song.title}</TableCell>
              <TableCell className="max-w-[150px] truncate">{song.artists.name}</TableCell>
              <TableCell className="max-w-[150px] truncate">{song.albums.name}</TableCell>
              <TableCell>{song.genres.name}</TableCell>
              <TableCell>{formatDuration(song.duration)}</TableCell>
              <TableCell>{song.plays}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}