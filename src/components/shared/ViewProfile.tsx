"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Music, Pencil } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { Button } from "../ui/button"

interface UserProfile {
  id: string
  fullName: string
  email: string
  avatar_url: string
}

interface Playlist {
  id: string
  title: string
  image_url: string | null
  description: string | null
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfileAndPlaylists = async () => {
      if (!user) return
      const { data: userData } = await supabase
        .from("users")
        .select("id, fullName, email, avatar_url")
        .eq("id", user.id)
        .single()

      const { data: playlistData } = await supabase
        .from("playlists")
        .select("id, title, image_url, description")
        .eq("user_id", user.id)
        .eq("is_public", true)

      setProfile(userData)
      setPlaylists(playlistData || [])
      setLoading(false)
    }

    if (user) fetchProfileAndPlaylists()
  }, [user])

  if (authLoading || loading || !profile) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-20 w-20 rounded-full" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-md" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Profile Info */}
     <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"> 
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profile.avatar_url || ""} alt={profile.fullName} />
          <AvatarFallback>{profile.fullName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{profile.fullName}</h1>
          <p className="text-muted-foreground">{playlists.length} Public Playlists</p>
        </div>
      </div>

      <Link href="/profile/edit">
        <Button variant="outline"><Pencil /> Edit Profile</Button>
      </Link>
     </div>

      {/* Playlists */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Public Playlists</h2>
        {playlists.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {playlists.map((playlist) => (
              <Card key={playlist.id} className="group hover:shadow-lg transition">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  {playlist.image_url ? (
                    <img
                      src={playlist.image_url}
                      alt={playlist.title}
                      className="w-full h-32 object-cover rounded-md mb-2"
                    />
                  ) : (
                    <div className="w-full h-32 flex items-center justify-center bg-muted rounded-md mb-2">
                      <Music className="w-10 h-10 text-muted-foreground" />
                    </div>
                  )}
                  <p className="font-semibold">{playlist.title}</p>
                  {playlist.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {playlist.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">You have no public playlists.</p>
        )}
      </div>
    </div>
  )
}
