'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Cat, Send } from 'lucide-react'
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type Thought = {
  id: number
  content: string
  timestamp: Date
}

export default function AgentInterface() {
  const agents = useSelector((state: RootState) => state.agentActivity.agents)

  const [thoughts, setThoughts] = useState<Thought[]>([])
  const [newThought, setNewThought] = useState('')


  useEffect(() => {
    if ( agents === undefined ) return ;
    const agent = agents.find((agent) => agent.name == 'Kuro')
    if ( agent ) {
      const newThought = {
        id: Date.now(),
        content: agent.thoughts,
        timestamp: new Date(),
      }
      setThoughts(prev => [...prev, newThought].slice(-10))
    }
  }, [agents])

  const handleSubmitThought = (e: React.FormEvent) => {
    e.preventDefault()
    if (newThought.trim()) {
      const thought = {
        id: Date.now(),
        content: newThought.trim(),
        timestamp: new Date(),
      }
      setThoughts(prev => [...prev, thought].slice(-10)) // Keep only the last 10 thoughts
      setNewThought('')
    }
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
          <Cat className="w-6 h-6" />
          Kuro's Interface
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] mb-4">
          {thoughts.map((thought) => (
            <div key={thought.id} className="mb-3 p-3 bg-slate-700 rounded-lg">
              <p className="text-sm text-slate-200">{thought.content}</p>
              <p className="text-xs text-slate-400 mt-1">
                {thought.timestamp.toLocaleTimeString()}
              </p>
            </div>
          ))}
        </ScrollArea>
        <form onSubmit={handleSubmitThought} className="flex gap-2">
          <Textarea
            placeholder="Enter a thought for Kuro..."
            value={newThought}
            onChange={(e) => setNewThought(e.target.value)}
            className="flex-grow bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400"
          />
          <Button type="submit" className="bg-yellow-500 text-slate-900 hover:bg-yellow-600">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

