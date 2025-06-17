"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function EditPlaylistPage() {
  const params = useParams() as { id?: string | string[] };
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlaylist = async () => {
      const { data } = await supabase
        .from("playlists")
        .select("*")
        .eq("id", id)
        .single();
      if (data) {
        setTitle(data.title);
        setDescription(data.description || "");
        setImageUrl(data.image_url);
      }
    };
    fetchPlaylist();
  }, [id]);

  const handleUpdate = async () => {
    setLoading(true);
    let uploadedUrl = imageUrl;

    // Upload image to storage
    if (file) {
      const { data, error } = await supabase.storage
        .from("playlist-covers")
        .upload(`${id}/${file.name}`, file, {
          upsert: true,
        });

      if (data && !error) {
        const {
          data: { publicUrl },
        } = supabase.storage
          .from("playlist-covers")
          .getPublicUrl(`${id}/${file.name}`);
        uploadedUrl = publicUrl;
      }
    }

    const { error } = await supabase
      .from("playlists")
      .update({
        title,
        description,
        image_url: uploadedUrl,
      })
      .eq("id", id);

    setLoading(false);
    if (!error) {
      router.push(`/playlist/${id}`);
    } else {
      alert("Failed to update playlist.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Edit Playlist</h1>

      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Playlist title" />
      <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />

      <div className="space-y-2">
        <label className="text-sm font-medium">Cover Image</label>
        {imageUrl && <Image src={imageUrl} alt="Cover" width={120} height={120} className="rounded" />}
        <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </div>

      <Button onClick={handleUpdate} disabled={loading}>
        {loading ? "Updating..." : "Update Playlist"}
      </Button>
    </div>
  );
}
