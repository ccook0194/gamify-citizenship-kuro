'use client'

import { useState, useEffect, useRef } from 'react'
import MapComponent from './Map'
import { Button } from './ui/button'

export default function WorldView() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [weather, setWeather] = useState('sunny')
  const [isClient, setIsClient] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    setIsClient(true)
    setCurrentTime(new Date())
  }, [])

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    const weatherInterval = setInterval(() => {
      const weathers = ['sunny', 'partly cloudy', 'cloudy', 'light rain', 'heavy rain']
      setWeather(weathers[Math.floor(Math.random() * weathers.length)])
    }, 300000) // Change weather every 5 minutes

    return () => {
      clearInterval(timeInterval)
      clearInterval(weatherInterval)
    }
  }, [])

  return (
    <div className="h-full relative">
      {currentTime && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-black/50 p-2 rounded-lg">
          <div className="text-white">
            {currentTime.toLocaleTimeString()} - {weather}
          </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (audioRef.current) {
              if (isPlaying) {
                audioRef.current.pause()
              } else {
                audioRef.current.play()
              }
              setIsPlaying(!isPlaying)
            }
          }}
        >
          {isPlaying ? '🔊 Pause' : '🔈 Play'}
        </Button>
        </div>
      )}
      <audio ref={audioRef} src="/audio/track.mp3" loop />
      {isClient && <MapComponent weather={weather} />}
    </div>
  )
}
