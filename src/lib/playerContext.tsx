'use client'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from './supabase';

type Song = {
  id: string
  title: string
  artist_id: string
  album_id: string
  cover_url?: string
  duration?: number
  audio_url?: string
  artists:{
    name: string
  }
  albums:{
    name: string
  }
  // Add other fields as needed
}

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
  duration: number;
  currentTime: number;
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


export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [queue, setQueue] = useState<{
    title: string;
    artist: string;
    image: string;
    src: string;
  }[]>([])
  const [isMini, setIsMini] = useState(false)
  const [tracks, setTracks] = useState<Song[]>([])
  
  useEffect(() => {
    const fetchSongs = async () => {
      const { data, error } = await supabase
        .from('songs')
        .select(`*, artists(name), albums(name)`)
        .order('created_at', { ascending: false })
      if (error) {
        console.error('Error fetching songs:', error)
        return
      }
      // Map to your track structure
      const mapped = data.map((song: Song) => ({
        id: song.id,
        title: song.title,
        artist_id: song.artist_id,
        album_id: song.album_id,
        cover_url: song.cover_url,
        duration: song.duration,
        artists: song.artists,
        albums: song.albums,
        src: song.audio_url ? `/audio/${song.audio_url}` : null,
        image: song.cover_url ?? '/img/default-cover.jpg'
      }))
      setTracks(mapped)
      setQueue(
        mapped.map((song) => ({
          title: song.title,
          artist: song.artists?.name ?? 'Unknown',
          image: song.image,
          src: song.src ?? ''
        }))
      )
    }
    fetchSongs()
  }, [])

  const currentTrack = useMemo(() => (
    queue[currentIndex] || {
      title: '',
      artist: '',
      image: '',
      src: ''
    }
  ), [queue, currentIndex])

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
  }, [currentIndex])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') togglePlay()
      else if (e.code === 'ArrowRight') playNext()
      else if (e.code === 'ArrowLeft') playPrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying, currentIndex, playNext, playPrev, togglePlay])  

  useEffect(() => {
    if (currentTrack?.src) {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      audioRef.current.src = currentTrack.src;
      audioRef.current.load();

      const onLoadedMetadata = () => {
        setDuration(audioRef.current?.duration || 0);
        if (isPlaying) {
          audioRef.current?.play();
        }        
      };
      const onTimeUpdate = () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      };

      audioRef.current.addEventListener('loadedmetadata', onLoadedMetadata);
      audioRef.current.addEventListener('timeupdate', onTimeUpdate);

      return () => {
        audioRef.current?.removeEventListener('loadedmetadata', onLoadedMetadata);
        audioRef.current?.removeEventListener('timeupdate', onTimeUpdate);
      };
    }
  }, [currentTrack, isPlaying]);

  return (
    <PlayerContext.Provider
     value={{
         audioRef, 
         isPlaying, 
         togglePlay, 
         currentTrack, 
         setCurrentTrack,
         duration,
         currentTime,
         queue,
         setQueue,
         playNext,
         playPrev,
         isMini,
         setIsMini,
         setIsPlaying, 
         tracks: tracks.map(song => ({
           title: song.title,
           artist: song.artists?.name ?? 'Unknown',
           image: song.cover_url ?? '/img/default-cover.jpg',
           src: song.audio_url ? `/audio/${song.audio_url}` : ''
         }))
     }}>
      {children}
      {currentTrack.src ? (
        <audio ref={audioRef} src={currentTrack.src} onEnded={playNext} />
      ) : null}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => useContext(PlayerContext)
