'use client'
import { usePlayer } from '@/lib/playerContext'


type Track = {
  title: string
  artist: string
  src: string
  image: string
}

export function Playlist () {
  const player = usePlayer()
  if (!player) return null
  const { setCurrentTrack, audioRef, tracks } = player

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track)
    if (audioRef.current) {
      audioRef.current.load()
      audioRef.current.play()
    }
    // setIsPlaying(true) // Removed because setIsPlaying does not exist
  }

  return (
    <div className="p-4 space-y-2">
      {tracks.map((track, idx) => (
        <div key={idx} onClick={() => handleTrackSelect(track)} className="cursor-pointer hover:bg-muted rounded p-2">
          <span className="block text-sm font-medium">{track.title}</span>
          <span className="block text-xs text-muted-foreground">{track.artist}</span>
        </div>
      ))}
    </div>
  )
}
