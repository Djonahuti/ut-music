'use client'
import { useEffect, useState } from 'react'
import { usePlayer } from '@/lib/playerContext'

export const Timeline = () => {
  const player = usePlayer()
  const audioRef = player?.audioRef
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const audio = audioRef?.current
    if (!audio) return

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0)
    }

    audio.addEventListener('timeupdate', updateProgress)
    return () => audio.removeEventListener('timeupdate', updateProgress)
  }, [audioRef])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef?.current
    if (!audio) return
    const newTime = (Number(e.target.value) / 100) * audio.duration
    audio.currentTime = newTime
    setProgress(Number(e.target.value))
  }

  return (
    <input
      type="range"
      min="0"
      max="100"
      value={progress}
      onChange={handleChange}
      className="w-40 h-[3px] rounded-lg cursor-pointer accent-gray-500"
    />
  )
}
