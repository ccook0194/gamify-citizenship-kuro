import React from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar } from 'lucide-react'

const events = [
  { id: 1, time: '9:00 AM', title: 'Morning Stroll', description: 'Kuro enjoys a peaceful walk in the park.' },
  { id: 2, time: '11:00 AM', title: 'Chasing Butterflies', description: 'Kuro playfully chases colorful butterflies in the garden.' },
  { id: 3, time: '1:00 PM', title: 'Nap Time', description: 'Kuro finds a cozy sunny spot for a quick nap.' },
  { id: 4, time: '3:00 PM', title: 'Bird Watching', description: 'Kuro observes birds from the safety of the backyard.' },
  { id: 5, time: '5:00 PM', title: 'Exploring', description: 'Kuro explores the neighborhood, meeting new friends.' },
]

export default function EventsList() {
  return (
    <div className="bg-slate-800/50 border-slate-700/50 backdrop-blur supports-[backdrop-filter]:bg-slate-800/75 shadow-lg rounded-lg p-4">
      <h3 className="text-xl font-bold text-yellow-400 flex items-center gap-2 mb-4 font-title">
        <Calendar className="w-6 h-6" />
        Kuro's Events
      </h3>
      <ScrollArea className="h-[300px]">
        {events.map((event) => (
          <div key={event.id} className="mb-4 p-3 bg-slate-700/50 rounded-lg border border-slate-600/50">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-yellow-400 font-body">{event.time}</span>
              <span className="text-sm font-semibold text-slate-200 font-title">{event.title}</span>
            </div>
            <p className="text-sm text-slate-300 font-body">{event.description}</p>
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}
