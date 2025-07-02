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
import { toast } from "sonner"
import { useRouter } from "next/navigation"

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

// Dummy data and handler for favourite artists
interface Following {
  id: string
  artist_id: string
  artists: {
  name: string
  image_url: string}
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)
  const [following, setFollowing] = useState<Following[]>([])

  useEffect(() => {
    const fetchAll = async () => {
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

      const { data: followingData } = await supabase
        .from("following")
        .select(`id, artist_id, artists(name, image_url)`)
        .eq("user_id", user.id)

      setProfile(userData)
      setPlaylists(playlistData || [])
      setFollowing(
        (followingData || []).map((item: any) => ({
          ...item,
          artists: Array.isArray(item.artists) ? item.artists[0] : item.artists,
        }))
      )
      setLoading(false)
    }
    if (user) fetchAll()
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

function handleArtistClick(artistId: string) {
  router.push(`/artist_info/${artistId}`);
  toast.success('Navigating to artist details');
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

      {/* Favourite Artists */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Favourite Artists</h2>
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {following.map((following) => (
          <div
           key={following.id}
           onClick={() => handleArtistClick(following.artist_id)} 
           className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
          >
            <Avatar className="w-24 h-24 mb-2 rounded-full overflow-hidden">
              <AvatarImage src={following.artists.image_url} alt={following.artists.name} className="object-cover w-full h-full" />
              <AvatarFallback className="bg-gray-700 text-white text-xl">{following.artists.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-center">{following.artists.name}</span>
          </div>
        ))}
      </section>
      </div>
    </div>
  )
}

