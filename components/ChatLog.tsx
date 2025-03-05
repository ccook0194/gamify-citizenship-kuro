'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from 'lucide-react'

const initialMessages = [
  { id: 1, sender: 'Kuro', content: 'Hello!', timestamp: '10:00 AM' },
  { id: 2, sender: 'User', content: 'Hi there!', timestamp: '10:01 AM' },
]

export default function ChatLog() {
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: 'User',
        content: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages([...messages, newMsg])
      setNewMessage('')
    }
  }

  return (
    <div className="bg-slate-900 p-4 rounded-lg">
      <ScrollArea className="h-[300px] mb-4">
        {messages.map((message) => (
          <div key={message.id} className={`mb-2 ${message.sender === 'Kuro' ? 'text-right' : ''}`}>
            <div className={`inline-block max-w-[80%] p-2 rounded-lg ${
              message.sender === 'Kuro' ? 'bg-yellow-500 text-slate-900' : 'bg-slate-700 text-slate-100'
            }`}>
              <p className="font-bold text-xs mb-1">{message.sender}</p>
              <p className="text-sm">{message.content}</p>
            </div>
            <p className="text-xs text-slate-400 mt-1">{message.timestamp}</p>
          </div>
        ))}
      </ScrollArea>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow bg-slate-700 border-slate-600 text-slate-100"
        />
        <Button type="submit" className="bg-yellow-500 text-slate-900 hover:bg-yellow-600">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  )
}

