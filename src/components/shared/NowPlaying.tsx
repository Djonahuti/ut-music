'use client'
import React from 'react';
import { Button } from "@/components/ui/button";
import { usePlayer } from '@/lib/playerContext';
import Image from 'next/image';
import { FastForward, ListOrdered, MessageSquareText, MoreHorizontal, Pause, Play, Rewind, Star, Waves } from 'lucide-react';
import { TimeProgress } from '../TimeProgress';
import { VolBar } from '../VolBar';

function formatTime(seconds: number) {
  if (isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}


const NowPlaying: React.FC = () => {
  const player = usePlayer()

  if (!player || !player.currentTrack) {
    return null;
  }

  const { currentTrack, duration, currentTime } = player;  

  if (!player) return null
  const { isPlaying, togglePlay, playNext, playPrev } = player

  return (
    <div className="min-h-screen bg-[#2c2f25] text-white flex flex-col items-center justify-center px-4 py-8">
      {/* Top Bar Indicator */}
      <div className="w-12 h-1.5 rounded-full bg-gray-500 opacity-40 mb-4" />

      {/* Album Art */}
      <div className="w-72 h-72 rounded-xl overflow-hidden shadow-lg mb-6">
       {currentTrack.image ? (
        <Image src={currentTrack.image} alt="cover" width={288} height={288} className="object-cover" />
       ):(
        <Image src="/globe.svg" alt="default cover" width={288} height={288} className="object-cover" />
       )}  
      </div>

      {/* Song Info */}
      <div className="w-full max-w-md text-center mb-4">
        <h2 className="text-xl font-semibold flex items-center justify-center gap-1">
          {currentTrack.title} <span className="text-xs border border-white px-1 py-0.5 rounded">E</span>
        </h2>
        <p className="text-sm text-gray-300">{currentTrack.artist}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <Button variant="ghost" size="icon">
          <Star className="w-5 h-5 text-white" />
        </Button>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-5 h-5 text-white" />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md flex flex-col items-center mb-4">
        <div className="w-full">
        <TimeProgress />
        </div>
        <div className="w-full flex justify-between text-xs text-gray-300 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span className="bg-gray-700 text-white text-[10px] px-2 py-0.5 rounded">Lossless</span>
          <span>-{formatTime(duration - currentTime)}</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-center gap-8 mb-6">
        <Button onClick={playPrev} variant="ghost" size="icon">
          <Rewind className="w-7 h-7 text-white" />
        </Button>
        <Button onClick={togglePlay} variant="ghost" size="icon" className="bg-white text-black w-14 h-14 rounded-full">
          {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
        </Button>
        <Button onClick={playNext} variant="ghost" size="icon">
          <FastForward className="w-7 h-7 text-white" />
        </Button>
      </div>

      {/* Volume Bar */}
      <div className="w-full max-w-md flex items-center gap-2 mb-6">
        <VolBar />
      </div>

      {/* Bottom Icons */}
      <div className="flex justify-between items-center w-full max-w-md px-4 text-white">
        <MessageSquareText className="w-5 h-5" />
        <Waves className="w-5 h-5" />
        <ListOrdered className="w-5 h-5" />
      </div>
    </div>
  );
};

export default NowPlaying;