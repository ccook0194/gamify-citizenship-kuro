import { ScrollArea } from "@/components/ui/scroll-area"
import { Scroll } from 'lucide-react'

const activities = [
  { id: 1, time: '10:00 AM', location: 'Forest', description: 'Found a hidden cave.' },
  { id: 2, time: '12:00 PM', location: 'Village', description: 'Talked to the villagers.' },
  { id: 3, time: '2:00 PM', location: 'Mountain', description: 'Climbed the mountain.' },
]

export default function ActivityLog() {
  return (
    <div className="bg-slate-800/50 border-slate-700/50 backdrop-blur supports-[backdrop-filter]:bg-slate-800/75 shadow-lg rounded-lg p-4">
      <h3 className="text-xl font-bold text-yellow-400 flex items-center gap-2 mb-4">
        <Scroll className="w-6 h-6" />
        Kuro's Quest Log
      </h3>
      <ScrollArea className="h-[300px]">
        {activities.map((activity) => (
          <div key={activity.id} className="mb-4 p-3 bg-slate-700/50 rounded-lg border border-slate-600/50">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-yellow-400">{activity.time}</span>
              <span className="text-xs text-slate-400">{activity.location}</span>
            </div>
            <p className="text-sm text-slate-300">{activity.description}</p>
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}

