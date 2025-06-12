// TrackInfo.tsx
'use client'
import { usePlayer } from '@/lib/playerContext'
import Image from 'next/image'
import { Timeline } from './Timeline';
import { Button } from './ui/button';
import { Repeat, Shuffle } from 'lucide-react';

function formatTime(seconds: number) {
  if (isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export const TrackInfo = () => {
  const player = usePlayer();

  if (!player || !player.currentTrack) {
    return null;
  }

  const { currentTrack, duration, currentTime } = player;

  return (
    <div className="flex items-center gap-3 max-w-lg w-full p-2">
     {currentTrack.image ? (
      <Image src={currentTrack.image} alt="cover" width={40} height={40} className="rounded-sm" />
     ):(
      <Image src="/globe.svg" alt="default cover" width={40} height={40} className="rounded-sm" />
     )}
      <Button variant="ghost" size="icon">
        <Shuffle className="w-4 h-4" />
      </Button>
      <div className="flex flex-col text-center flex-grow">
        <div className="text-sm font-semibold leading-none truncate">
          {currentTrack.title}
        </div>
        <div className="text-xs leading-none text-gray-500 truncate">
          {currentTrack.artist}
        </div>
        <div className="flex items-center gap-2 justify-between text-xs text-gray-500">
          <span>{formatTime(currentTime)}</span>
          <div className="relative w-full h-1 bg-gray-300 rounded-full">
           <Timeline /> 
          </div>
          <span>-{formatTime(duration - currentTime)}</span>
        </div>
      </div>
      <Button variant="ghost" size="icon">
        <Repeat className="w-4 h-4" />
      </Button>           
    </div>
  )
}
