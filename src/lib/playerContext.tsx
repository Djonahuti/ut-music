'use client'
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

interface PlayerContextType {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  togglePlay: () => void;
  currentTrack: {
    title: string;
    artist: string;
    image: string;
    src: string;
  };
  setCurrentTrack: (track: {
    title: string;
    artist: string;
    image: string;
    src: string;
  }) => void;
  queue: {
    title: string;
    artist: string;
    image: string;
    src: string;
  }[];
  setQueue: React.Dispatch<React.SetStateAction<{
    title: string;
    artist: string;
    image: string;
    src: string;
  }[]>>;
  playNext: () => void;
  playPrev: () => void;
  isMini: boolean;
  setIsMini: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  tracks: {
    title: string;
    artist: string;
    image: string;
    src: string;
  }[];  
}

const PlayerContext = createContext<PlayerContextType | null>(null)

const mockTracks = [
  {
    title: 'God is a Woman',
    artist: 'Ariana Grande',
    src: '/songs/ariana-grande-god-is-a-woman.mp3',
    image: '/img/ariana-grande-god-is-a-woman.jpg'
  },
  {
    title: 'Rollin',
    artist: 'Calvin Harris',
    src: '/songs/calvin-harris-rollin.mp3',
    image: '/img/calvin-harris-rollin.jpg'
  },
  {
    title: 'Where’d You Go',
    artist: 'Fort Minor',
    src: '/songs/fort-minor-where-d-you-go.mp3',
    image: '/img/fort-minor-where-d-you-go.jpg'
  },
  {
    title: 'I’ll Be There',
    artist: 'Jess Glynne',
    src: '/songs/jess-glynne-i-ll-be-there.mp3',
    image: '/img/jess-glynne-i-ll-be-there.jpg'
  },
  {
    title: 'LOVE. (feat. Zacari)',
    artist: 'Kendrick Lamar',
    src: '/songs/kendrick-lamar-love.mp3',
    image: '/img/kendrick-lamar-love.jpg'
  },
  {
    title: 'Hideaway',
    artist: 'Kiesza',
    src: '/songs/kiesza-hideaway.mp3',
    image: '/img/kiesza-hideaway.jpg'
  },
  {
    title: 'Elevate',
    artist: 'St. Lucia',
    src: '/songs/st-lucia-elevate.mp3',
    image: '/img/st-lucia-elevate.jpg'
  },
  {
    title: 'Gimme Your Love',
    artist: 'DEAM',
    src: '/songs/deam-gimme-your-love.mp3',
    image: '/img/deam-gimme-your-love.jpg'
  }
]

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [queue, setQueue] = useState(mockTracks)
  const [isMini, setIsMini] = useState(false)
  const currentTrack = queue[currentIndex]

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(prev => !prev)
  }, [isPlaying])

  const playNext = useCallback(() => {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsPlaying(true)
    }
  }, [currentIndex, queue.length])

  const playPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsPlaying(true)
    }
  }, [currentIndex])

  const setCurrentTrack = (track: { title: string; artist: string; image: string; src: string }) => {
    const index = queue.findIndex(t => t.src === track.src)
    if (index !== -1) setCurrentIndex(index)
  }

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.load()
    if (isPlaying) audioRef.current.play()
  }, [currentIndex, isPlaying])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') togglePlay()
      else if (e.code === 'ArrowRight') playNext()
      else if (e.code === 'ArrowLeft') playPrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying, currentIndex, playNext, playPrev, togglePlay])  

  return (
    <PlayerContext.Provider
     value={{
         audioRef, 
         isPlaying, 
         togglePlay, 
         currentTrack, 
         setCurrentTrack,
         queue,
         setQueue,
         playNext,
         playPrev,
         isMini,
         setIsMini,
         setIsPlaying, 
         tracks: mockTracks
     }}>
      {children}
      <audio ref={audioRef} src={currentTrack.src} />
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => useContext(PlayerContext)
