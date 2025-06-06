"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import { useState } from "react"

export function AddSongForm({ onAdded }: { onAdded: () => void }) {
  const [title, setTitle] = useState("")
  const [artistName, setArtistName] = useState("")
  const [albumName, setAlbumName] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setLoading(true)
    await supabase.from("songs").insert({
      title,
      artist_name: artistName,
      album_name: albumName,
    })
    setTitle("")
    setArtistName("")
    setAlbumName("")
    setLoading(false)
    onAdded()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Add Song</h2>
      <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Input placeholder="Artist" value={artistName} onChange={(e) => setArtistName(e.target.value)} />
      <Input placeholder="Album" value={albumName} onChange={(e) => setAlbumName(e.target.value)} />
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Adding..." : "Add Song"}
      </Button>
    </div>
  )
}