// TrackInfo.tsx
'use client'
import { usePlayer } from '@/lib/playerContext'
import Image from 'next/image'

export const TrackInfo = () => {
  const player = usePlayer();

  if (!player || !player.currentTrack) {
    return null;
  }

  const { currentTrack } = player;

  return (
    <div className="flex items-center gap-4 w-full md:w-auto">
     {currentTrack.image ? (
      <Image src={currentTrack.image} alt="cover" width={56} height={56} className="rounded-md" />
     ):(
      <Image src="/globe.svg" alt="default cover" width={56} height={56} className="rounded-md" />
     )}
      <div className="flex flex-col">
        <span className="text-sm font-medium">{currentTrack.title}</span>
        <span className="text-xs text-muted-foreground">{currentTrack.artist}</span>
      </div>
    </div>
  )
}
