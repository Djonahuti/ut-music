// Volume.tsx
'use client'
import { useState } from 'react'
import { usePlayer } from '@/lib/playerContext'
import { IconVolume, IconVolume2, IconVolume3 } from '@tabler/icons-react'

export const Volume = () => {
  const player = usePlayer()
  const audioRef = player?.audioRef
  const [volume, setVolume] = useState(100)

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value)
    setVolume(newVolume)
    if (audioRef?.current) audioRef.current.volume = newVolume / 100
  }

  const VolumeIcon = volume === 0 ? IconVolume3 : volume < 50 ? IconVolume2 : IconVolume

  return (
    <div className="flex items-center gap-2 w-full md:w-auto">
      <VolumeIcon size={20} />
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={handleVolumeChange}
        className="w-24 h-1 rounded-lg cursor-pointer"
      />
    </div>
  )
}