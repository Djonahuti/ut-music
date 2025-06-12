"use client";

import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

interface Genre {
  id: string
  name: string
  description: string
}

export function Genre() {
  const [genres, setGenres] = useState<Genre[]>([])
  const [search, setSearch] = useState("")

  const fetchGenres = async () => {
    const { data } = await supabase.from("genres").select("*")
    setGenres(data || [])
  }

  useEffect(() => {
    fetchGenres()
  }, [])

  const filtered = genres.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
     <div className="flex justify-between items-center">
      <Input placeholder="Search genres..." value={search} onChange={(e) => setSearch(e.target.value)} />
       </div> 
      <Table className="w-full text-left">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((genre) => (
            <TableRow key={genre.id} className="border-t">
              <TableCell>{genre.name}</TableCell>
              <TableCell className="max-w-[200px] truncate">{genre.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}