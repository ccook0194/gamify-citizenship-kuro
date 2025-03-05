'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, MapPin } from 'lucide-react'

const events = [
  { id: 1, title: "Morning Stroll", location: "Park", description: "Kuro enjoys a peaceful walk in the park." },
  { id: 2, title: "Chasing Butterflies", location: "Garden", description: "Kuro playfully chases colorful butterflies in the garden." },
  { id: 3, title: "Nap Time", location: "Sunny Spot", description: "Kuro finds a cozy sunny spot for a quick nap." },
  { id: 4, title: "Bird Watching", location: "Backyard", description: "Kuro observes birds from the safety of the backyard." },
  { id: 5, title: "Exploring", location: "Neighborhood", description: "Kuro explores the neighborhood, meeting new friends." },
]

export default function CurrentEvent() {
  const [currentEvent, setCurrentEvent] = useState(events[0])
  const [pastEvents, setPastEvents] = useState<typeof events>([])

  useEffect(() => {
    const interval = setInterval(() => {
      const newEvent = events[Math.floor(Math.random() * events.length)]
      setPastEvents(prev => [currentEvent, ...prev].slice(0, 5))
      setCurrentEvent(newEvent)
    }, 30000) // Change event every 30 seconds

    return () => clearInterval(interval)
  }, [currentEvent])

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur supports-[backdrop-filter]:bg-slate-800/75 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-yellow-400 flex items-center gap-2">
          <Clock className="w-6 h-6" />
          Current Event
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-slate-700/50 rounded-lg border border-slate-600/50">
          <h3 className="text-lg font-semibold text-slate-100 mb-2">{currentEvent.title}</h3>
          <div className="flex items-center text-sm text-slate-300 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            {currentEvent.location}
          </div>
          <p className="text-sm text-slate-300">{currentEvent.description}</p>
        </div>
        <h4 className="text-md font-semibold text-slate-200 mb-2">Past Events</h4>
        <ScrollArea className="h-[200px]">
          {pastEvents.map((event) => (
            <div key={event.id} className="mb-3 p-2 bg-slate-700/30 rounded border border-slate-600/30">
              <h5 className="text-sm font-medium text-slate-200">{event.title}</h5>
              <div className="flex items-center text-xs text-slate-400 mt-1">
                <MapPin className="w-3 h-3 mr-1" />
                {event.location}
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

