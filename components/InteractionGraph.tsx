'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Star, Trophy, MessageCircle } from 'lucide-react'

type Interaction = {
  character: string
  count: number
  level: number
}

const characters = ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan']
const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500']

export default function InteractionGraph() {
  const [interactions, setInteractions] = useState<Interaction[]>(
    characters.map(character => ({ 
      character, 
      count: Math.floor(Math.random() * 100),
      level: Math.floor(Math.random() * 5) + 1
    }))
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setInteractions(prev => 
        prev.map(interaction => {
          const newCount = Math.max(0, interaction.count + Math.floor(Math.random() * 10) - 3)
          const newLevel = Math.floor(newCount / 20) + 1
          return {
            ...interaction,
            count: newCount,
            level: newLevel
          }
        })
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur supports-[backdrop-filter]:bg-slate-800/75 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-yellow-400 flex items-center gap-2">
          <Trophy className="w-6 h-6" />
          Character Interactions Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {interactions.map((interaction, index) => (
            <li 
              key={interaction.character}
              className={`p-4 rounded-lg ${colors[index]} bg-opacity-20`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg text-slate-100">{interaction.character}</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-slate-300">Level {interaction.level}</span>
                </div>
              </div>
              <Progress value={(interaction.count % 20) * 5} className="h-2 mb-2" />
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-slate-300">Interactions: {interaction.count}</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

