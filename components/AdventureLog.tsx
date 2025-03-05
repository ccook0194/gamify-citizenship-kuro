'use client'

import { useState, useEffect } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { MapPin } from 'lucide-react'

type Adventure = {
  id: number
  time: string
  description: string
  location: string
}

const initialAdventures: Adventure[] = [
  { id: 1, time: '08:00', description: 'Kuro wakes up and stretches', location: 'Home' },
  { id: 2, time: '08:15', description: 'Kuro has breakfast', location: 'Kitchen' },
  { id: 3, time: '08:30', description: 'Kuro grooms himself', location: 'Living Room' },
  { id: 4, time: '09:00', description: 'Kuro looks out the window', location: 'Window Sill' },
  { id: 5, time: '09:30', description: 'Kuro decides to go for a walk', location: 'Front Door' },
]

const locations = ['Park', 'Cafe', 'Bookstore', 'Fish Market', 'Rooftop', 'Alley', 'Beach']

export default function AdventureLog() {
  const [adventures, setAdventures] = useState<Adventure[]>(initialAdventures)
  const [showAll, setShowAll] = useState(false)

  const visibleAdventures = showAll ? adventures : adventures.slice(-5)

  useEffect(() => {
    const interval = setInterval(() => {
      const newAdventure = {
        id: Date.now(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        description: `Kuro ${['meows', 'stretches', 'yawns', 'purrs', 'plays with a toy'][Math.floor(Math.random() * 5)]}`,
        location: locations[Math.floor(Math.random() * locations.length)]
      }
      setAdventures(prev => [...prev, newAdventure])
    }, 10000) // Add new adventure every 10 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[400px]">
        {visibleAdventures.map((adventure) => (
          <div key={adventure.id} className="mb-4 p-3 bg-slate-700/50 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium">{adventure.time}</span>
              <div className="flex items-center text-xs text-slate-300">
                <MapPin className="w-3 h-3 mr-1" />
                {adventure.location}
              </div>
            </div>
            <p className="text-sm">{adventure.description}</p>
          </div>
        ))}
      </ScrollArea>
      {adventures.length > 5 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAll(!showAll)}
          className="w-full"
        >
          {showAll ? 'Show Less' : 'Show More'}
        </Button>
      )}
    </div>
  )
}

