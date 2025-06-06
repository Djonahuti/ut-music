"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

interface EditSongFormProps {
  song: {
    id: string
    title: string
    artist_id: string
    album_id: string
    cover_url?: string
    duration?: number
    artists:{
      name: string
    }
    albums:{
      name: string
    }
    };
  onUpdated: () => void;
}

export function EditSongForm({ song, onUpdated }: EditSongFormProps) {
  const [title, setTitle] = useState(song.title)
  const [artistName, setArtistName] = useState(song.artist_id ? song.artists.name : "")
  const [albumName, setAlbumName] = useState(song.album_id ? song.albums.name : "")
  const [loading, setLoading] = useState(false)

  async function handleUpdate() {
    setLoading(true)
    await supabase.from("songs").update({
      title,
      artist_id: artistName,
      album_id: albumName,
    }).eq("id", song.id)
    setLoading(false)
    onUpdated()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Edit Song</h2>
      <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Input placeholder="Artist" value={artistName} onChange={(e) => setArtistName(e.target.value)} />
      <Input placeholder="Album" value={albumName} onChange={(e) => setAlbumName(e.target.value)} />
      <Button onClick={handleUpdate} disabled={loading}>
        {loading ? "Updating..." : "Update Song"}
      </Button>
    </div>
  )
}
