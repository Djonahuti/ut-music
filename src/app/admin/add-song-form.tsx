"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import { useState, ChangeEvent, useEffect } from "react"
import { Controller, useForm } from "react-hook-form"

type FormValues = {
  title: string
  track_no: string
  artist_id: string
  album_id: string
  genre_id: string
}

export function AddSongForm({ onAdded }: { onAdded: () => void }) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      title: "",
      track_no: "",
      artist_id: "",
      album_id: "",
      genre_id: "",
    },
    mode: "onSubmit",
  })  
  const [artists, setArtists] = useState<{ id: string; name: string }[]>([])
  const [albums, setAlbums] = useState<{ id: string; name: string }[]>([])
  const [genres, setGenres] = useState<{ id: string; name: string }[]>([])
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch artists, albums and genres from Supabase
    supabase.from("artists").select("id, name").then(({ data }) => {
      if (data) setArtists(data)
    })
    supabase.from("albums").select("id, name").then(({ data }) => {
      if (data) setAlbums(data)
    })
    supabase.from("genres").select("id, name").then(({ data }) => {
      if (data) setGenres(data)
    })
  }, [])

  async function getAudioDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file)
      const audio = new Audio()
      audio.src = url
      audio.addEventListener("loadedmetadata", () => {
        const duration = Math.round(audio.duration)
        URL.revokeObjectURL(url)
        resolve(duration)
      })
      audio.addEventListener("error", (e) => {
        URL.revokeObjectURL(url)
        reject(new Error("Failed to load audio file"))
      })
    })
  }  

  async function onSubmit(values: FormValues) {
    setLoading(true)

    // 1. Upload audio file to local server
    let audioFileName = ""
    let duration = null    
    if (audioFile) {
      // Calculate duration before upload
      try {
        duration = await getAudioDuration(audioFile)
      } catch (err) {
        alert("Could not read audio duration")
        setLoading(false)
        return
      }

      const formData = new FormData()
      formData.append("file", audioFile)
      const res = await fetch("/api/upload-audio", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      audioFileName = data.fileName // e.g. "mysong.mp3"
      if (!audioFileName) {
        alert("Audio upload failed")
        setLoading(false)
        return
      }
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
      const { data: publicData } = supabase.storage.from("media").getPublicUrl(data.path)
      coverUrl = publicData.publicUrl
    }

    // 3. Insert into songs table
    await supabase.from("songs").insert({
      title: values.title,
      track_no: values.track_no,
      artist_id: values.artist_id,
      album_id: values.album_id,
      genre_id: values.genre_id,
      audio_url: audioFileName,
      cover_url: coverUrl,
      duration: duration,
      // You may want to resolve artist_id and album_id here if needed
    })

    setArtists([])
    setAlbums([])
    setGenres([])
    setAudioFile(null)
    setCoverFile(null)
    reset()
    setLoading(false)
    onAdded()
  }

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-lg font-medium">Add Song</h2>
      <Controller
        name="title"
        control={control}
        rules={{ required: "Title is required" }}
        render={({ field }) => (
          <Input placeholder="Title" {...field} />
        )}
      />
      {errors.title && <div className="text-red-500">{errors.title.message}</div>}

      <Controller
        name="track_no"
        control={control}
        rules={{ required: "Track Number is required" }}
        render={({ field }) => (
          <Input placeholder="Track No" {...field} />
        )}
      />
      {errors.track_no && <div className="text-red-500">{errors.track_no.message}</div>}

      <Controller
        name="artist_id"
        control={control}
        rules={{ required: "Artist is required" }}
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
      {errors.artist_id && <div className="text-red-500">{errors.artist_id.message}</div>}

      <Controller
        name="album_id"
        control={control}
        rules={{ required: "Album is required" }}
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
      {errors.album_id && <div className="text-red-500">{errors.album_id.message}</div>}

      <Controller
        name="genre_id"
        control={control}
        rules={{ required: "Genre is required" }}
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={field.onChange}
            disabled={loading}
          >
           <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Choose Genre" />
           </SelectTrigger> 
            <SelectContent>
              <SelectGroup>
            {genres.map((genre) => (
              <SelectItem key={genre.id} value={genre.id}>
                {genre.name}
              </SelectItem>
            ))}                
              </SelectGroup>  
            </SelectContent>
          </Select>
        )}
      />
      {errors.genre_id && <div className="text-red-500">{errors.genre_id.message}</div>}      

      <Input type="file" accept="audio/*" onChange={(e: ChangeEvent<HTMLInputElement>) => setAudioFile(e.target.files?.[0] || null)} />
      <Input type="file" accept="image/*" onChange={(e: ChangeEvent<HTMLInputElement>) => setCoverFile(e.target.files?.[0] || null)} />
      <Button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Song"}
      </Button>
    </form>
  )
}