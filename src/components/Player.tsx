'use client'
//import { useState } from 'react'
import { PlayerControls } from './Controls'
import { TrackInfo } from './TrackInfo'
import { Timeline } from './Timeline'
import { Volume } from './Volume'
import { usePlayer } from '@/lib/playerContext'
import { Button } from './ui/button'
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react'

export const Player = () => {
  const player = usePlayer()
  if (!player) return null
  const { isMini, setIsMini } = player
  return (
    <div className="w-full fixed bottom-0 bg-background border-t p-4 flex flex-col md:flex-row items-center justify-between gap-4 z-50">
      <div className="flex justify-end mb-2">
        <Button variant="ghost" size="sm" onClick={() => setIsMini(!isMini)}>
          {isMini ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />}
        </Button>
      </div>

      {isMini ? (
        <div className="flex justify-between items-center">
          <TrackInfo />
          <PlayerControls />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <TrackInfo />
          <div className="flex flex-col items-center w-full md:w-auto">
            <PlayerControls />
            <Timeline />
          </div>
          <Volume />
        </div>
      )}
    </div>
  )
}
