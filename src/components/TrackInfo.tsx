// TrackInfo.tsx
'use client'
import { usePlayer } from '@/lib/playerContext'
import Image from 'next/image'
import { Timeline } from './Timeline';
import { Button } from './ui/button';
import { Repeat, Shuffle } from 'lucide-react';

export const TrackInfo = () => {
  const player = usePlayer();

  if (!player || !player.currentTrack) {
    return null;
  }

  const { currentTrack } = player;

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
          <span>0:00</span>
          <div className="relative w-full h-1 bg-gray-300 rounded-full">
           <Timeline /> 
          </div>
          <span>-3:33</span>
        </div>
      </div>
      <Button variant="ghost" size="icon">
        <Repeat className="w-4 h-4" />
      </Button>           
    </div>
  )
}
