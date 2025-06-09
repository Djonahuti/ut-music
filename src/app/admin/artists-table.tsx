"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { Pencil, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface Artist {
  id: string
  name: string
  bio: string
  image_url: string
}

export function ArtistTable() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [search, setSearch] = useState("")
  const [editing, setEditing] = useState<Artist | null>(null)

  const fetchArtists = async () => {
    const { data } = await supabase.from("artists").select("*")
    setArtists(data || [])
  }

  useEffect(() => {
    fetchArtists()
  }, [])

  const handleDelete = async (id: string) => {
    await supabase.from("artists").delete().eq("id", id)
    fetchArtists()
  }

  const handleEdit = (artist: Artist) => {
    setEditing(artist)
  }

  const onSubmit = async (values: Artist) => {
    await supabase.from("artists").update(values).eq("id", editing?.id)
    setEditing(null)
    fetchArtists()
  }

  const filtered = artists.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  )

  const { register, handleSubmit, reset } = useForm<Artist>({
    defaultValues: editing || { name: "", bio: "", image_url: "", id: "" }
  })

  useEffect(() => {
    if (editing) reset(editing)
  }, [editing, reset])

  return (
    <div className="space-y-4">
      <Input placeholder="Search artists..." value={search} onChange={(e) => setSearch(e.target.value)} />
      <Table className="w-full text-left">
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Bio</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((artist) => (
            <TableRow key={artist.id} className="border-t">
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
              <TableCell className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(artist)}>
                      <Pencil size={16} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Artist</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>Fill Correctly</DialogDescription>                                  
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <Input {...register("name")} placeholder="Name" />
                      <Input {...register("bio")} placeholder="Bio" />
                      <Input {...register("image_url")} placeholder="Image URL" />
                      <Button type="submit">Update Artist</Button>
                    </form>
                  </DialogContent>
                </Dialog>
                <Button onClick={() => handleDelete(artist.id)} variant="ghost" size="icon">
                  <Trash size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}