"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"
import { useState, ChangeEvent } from "react"
import { Controller, useForm } from "react-hook-form"

type FormValues = {
  name: string
  bio: string
}

export function AddArtistForm({ onAdded }: { onAdded: () => void }) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      name: "",
      bio: "",
    },
    mode: "onSubmit",
  })  
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(values: FormValues) {
    setLoading(true)

    // 1. Upload image to Supabase Storage
    let imageUrl = ""
    if (imageFile) {
      const { data, error } = await supabase.storage
        .from("media")
        .upload(`artists/${Date.now()}-${imageFile.name}`, imageFile)
      if (error) {
        alert("Image upload failed")
        setLoading(false)
        return
      }
      const { data: publicData } = supabase.storage.from("media").getPublicUrl(data.path)
      imageUrl = publicData.publicUrl
    }

    // 3. Insert into songs table
    await supabase.from("artists").insert({
      name: values.name,
      bio: values.bio,
      image_url: imageUrl,
      // You may want to resolve artist_id and album_id here if needed
    })

    setImageFile(null)
    reset()
    setLoading(false)
    onAdded()
  }

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-lg font-medium">Add Album</h2>
      <Controller
        name="name"
        control={control}
        rules={{ required: "Name is required" }}
        render={({ field }) => (
          <Input placeholder="Name" {...field} />
        )}
      />
      {errors.name && <div className="text-red-500">{errors.name.message}</div>}

      <Controller
        name="bio"
        control={control}
        rules={{ required: "A year is required" }}
        render={({ field }) => (
          <Textarea placeholder="Bio" {...field} />
        )}
      />
      {errors.bio && <div className="text-red-500">{errors.bio.message}</div>}

      <Input type="file" accept="image/*" onChange={(e: ChangeEvent<HTMLInputElement>) => setImageFile(e.target.files?.[0] || null)} />
      <Button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Artist"}
      </Button>
    </form>
  )
}