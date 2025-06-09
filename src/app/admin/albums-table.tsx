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


interface Album {
  id: string
  name: string
  artist_id: string
  cover_url: string
  artists:{
    name: string
  }  
}

export function AlbumTable() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [search, setSearch] = useState("")
  const [editing, setEditing] = useState<Album | null>(null)

  const fetchAlbums = async () => {
    const { data } = await supabase
     .from("albums")
     .select(`*, artists(name)`)
     .order("id", { ascending: true })
    setAlbums(data || [])
  }

  useEffect(() => {
    fetchAlbums()
  }, [])

  const handleDelete = async (id: string) => {
    await supabase.from("albums").delete().eq("id", id)
    fetchAlbums()
  }

  const handleEdit = (album: Album) => {
    setEditing(album)
  }

  const onSubmit = async (values: Album) => {
    await supabase.from("albums").update(values).eq("id", editing?.id)
    setEditing(null)
    fetchAlbums()
  }

  const filtered = albums.filter((a) =>
    (a.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (a.artists?.name?.toLowerCase() || "").includes(search.toLowerCase())
  )

  const { register, handleSubmit, reset } = useForm<Album>({
    defaultValues: editing || { name: "", artist_id: "", cover_url: "", id: "", artists: { name: "" } }
  })  

  useEffect(() => {
    if (editing) reset(editing)
  }, [editing, reset])

  return (
    <div className="space-y-4">
      <Input placeholder="Search albums..." value={search} onChange={(e) => setSearch(e.target.value)} />
      <Table className="w-full text-left">
        <TableHeader>
          <TableRow>
            <TableHead>Cover</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((album) => (
            <TableRow key={album.id} className="border-t">
              <TableCell>
                <Image
                 src={album.cover_url} 
                 alt="cover" 
                 className="w-12 h-12 object-cover rounded"
                 width={48}
                 height={48} 
                />
              </TableCell>
              <TableCell>{album.name}</TableCell>
              <TableCell>{album.artists.name}</TableCell>
              <TableCell className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(album)}>
                      <Pencil size={16} />
                    </Button>
                  </DialogTrigger>               
                  <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Table</DialogTitle>
                  </DialogHeader>
                  <DialogDescription>Fill Correctly</DialogDescription>                       
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <Input {...register("name")} placeholder="Title" />
                      <Input {...register("artist_id")} placeholder="Artist ID" />
                      <Input {...register("cover_url")} placeholder="Cover URL" />
                      <Button type="submit">Update Album</Button>
                    </form>
                  </DialogContent>
                </Dialog>
                <Button onClick={() => handleDelete(album.id)} variant="ghost" size="icon">
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