"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import { useState, ChangeEvent, useEffect } from "react"
import { Controller, useForm } from "react-hook-form"

type FormValues = {
  title: string
  artist_id: string
  album_id: string
}

export function AddSongForm({ onAdded }: { onAdded: () => void }) {
  const { control, reset } = useForm<FormValues>()  
  const [title, setTitle] = useState("")
  const [artists, setArtists] = useState<{ id: string; name: string }[]>([])
  const [albums, setAlbums] = useState<{ id: string; name: string }[]>([])
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch artists and albums from Supabase
    supabase.from("artists").select("id, name").then(({ data }) => {
      if (data) setArtists(data)
    })
    supabase.from("albums").select("id, name").then(({ data }) => {
      if (data) setAlbums(data)
    })
  }, [])

  async function handleSubmit(values: FormValues) {
    setLoading(true)

    // 1. Upload audio file to local server
    let audioFileName = ""
    if (audioFile) {
      const formData = new FormData()
      formData.append("file", audioFile)
      const res = await fetch("/api/upload-audio", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      audioFileName = data.fileName // e.g. "mysong.mp3"
    }

    // 2. Upload cover to Supabase Storage
    let coverUrl = ""
    if (coverFile) {
      const { data, error } = await supabase.storage
        .from("media")
        .upload(`covers/${Date.now()}-${coverFile.name}`, coverFile)
      if (error) {
        alert("Cover upload failed")
        setLoading(false)
        return
      }
      const { data: publicData } = supabase.storage.from("covers").getPublicUrl(data.path)
      coverUrl = publicData.publicUrl
    }

    // 3. Insert into songs table
    await supabase.from("songs").insert({
      title: values.title,
      artist_id: values.artist_id,
      album_id: values.album_id,
      audio_url: audioFileName,
      cover_url: coverUrl,
      // You may want to resolve artist_id and album_id here if needed
    })

    setTitle("")
    setArtists([])
    setAlbums([])
    setAudioFile(null)
    setCoverFile(null)
    reset()
    setLoading(false)
    onAdded()
  }

  return (
    <form
      className="space-y-4"
      onSubmit={control.handleSubmit(handleSubmit)}
    >
      <h2 className="text-lg font-medium">Add Song</h2>
      <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Controller
        name="artist_id"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={field.onChange}
            disabled={loading}
          >
           <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Artist" />
           </SelectTrigger> 
            <SelectContent>
              <SelectGroup>
            {artists.map((artist) => (
              <SelectItem key={artist.id} value={artist.id}>
                {artist.name}
              </SelectItem>
            ))}                
              </SelectGroup>  
            </SelectContent>
          </Select>
        )}
      />
      <Controller
        name="album_id"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={field.onChange}
            disabled={loading}
          >
           <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Album" />
           </SelectTrigger> 
            <SelectContent>
              <SelectGroup>
            {albums.map((album) => (
              <SelectItem key={album.id} value={album.id}>
                {album.name}
              </SelectItem>
            ))}                
              </SelectGroup>  
            </SelectContent>
          </Select>
        )}
      />
      <Input type="file" accept="audio/*" onChange={(e: ChangeEvent<HTMLInputElement>) => setAudioFile(e.target.files?.[0] || null)} />
      <Input type="file" accept="image/*" onChange={(e: ChangeEvent<HTMLInputElement>) => setCoverFile(e.target.files?.[0] || null)} />
      <Button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Song"}
      </Button>
    </form>
  )
}