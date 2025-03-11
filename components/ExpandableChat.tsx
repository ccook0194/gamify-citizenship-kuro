'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useSelector } from 'react-redux'
import { GradientButton } from '@/components/ui/gradient-button'
import moment from 'moment'
import { dateConvert, shortenMessage } from '@/lib/utils'

// Inline custom scrollbar styling
const customScrollbarStyles = `
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #ffecec;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #ff5a78;
  border-radius: 3px;
}
`

type Message = {
  id: string
  sender: string
  content: string
  timestamp: Date
}

const characterProfiles: Record<string, { pfp: string; color: string }> = {
  Kuro: { pfp: '/pfps/pfp1.png', color: 'bg-rose-200' },
  Theo: { pfp: '/pfps/pfp2.png', color: 'bg-cyan-200' },
  Milo: { pfp: '/pfps/pfp3.png', color: 'bg-amber-200' },
  Klaus: { pfp: '/pfps/pfp4.png', color: 'bg-blue-200' },
  Ava: { pfp: '/pfps/pfp5.png', color: 'bg-yellow-50' },
  Alice: { pfp: '/pfps/pfp6.png', color: 'bg-pink-200' },
  Ivy: { pfp: '/pfps/pfp7.png', color: 'bg-violet-200' },
  System: { pfp: '', color: 'bg-slate-600' },
}

/* Animation Variants - matching our other component exactly */
const containerVariants = {
  collapsed: { height: 60, width: 400, transition: { duration: 0.3 } },
  expanded: { height: 600, width: 400, transition: { duration: 0.3 } },
}
// Stagger container with reversed order for "show" (newest first)
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, staggerDirection: -1 } },
  exit: { transition: { staggerChildren: 0.05, staggerDirection: 1 } },
}
const messageVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 12 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
}

interface ExpandableChatProps {
  currentTime: Date
}

export default function ExpandableChat({ currentTime }: ExpandableChatProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [queue, setQueue] = useState<Message[]>([])
  const [curIndex, setCurIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Helper: add a new message with a truly unique ID
  const addMessageToQueue = (sender: string, content: string, time: Date) => {
    const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
    setQueue((prev) => [...prev, { id: uniqueId, sender, content, timestamp: time }])
  }

  useEffect(() => {
    const now = dateConvert(currentTime)
    let newMessages = [...messages]
    let index = curIndex

    while ( index < queue.length && now > queue[index].timestamp  ) {
        newMessages.push(queue[index ++])
    }

    if ( index !== curIndex ) {
      setCurIndex(index)
      setMessages(newMessages)
    }
  }, [queue, currentTime])

  // Simulate incoming messages
  useEffect(() => {
    addMessageToQueue('System', "Welcome to Kuro's World Chat Logs!", dateConvert(currentTime))
  }, [])

  // Auto-scroll when expanded and messages update
  useEffect(() => {
    if (isExpanded && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isExpanded])

  const lastMsg = messages[messages.length - 1]

  // Toggle function
  const toggleExpand = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setIsExpanded((prev) => !prev)
  }

  return (
    <div className="fixed bottom-4 right-4 z-[1200] select-none max-w-[400px] w-full">
      <style jsx global>{customScrollbarStyles}</style>

      <motion.div
        className="rounded-2xl shadow-[4px_4px_0_0_black] overflow-hidden bg-white border-2 border-black"
        variants={containerVariants}
        initial="collapsed"
        animate={isExpanded ? 'expanded' : 'collapsed'}
      >
        {isExpanded ? (
          // Expanded Chat View
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-red-200 border-b border-red-300">
              <h3 className="text-sm font-bold text-black font-title">World Chat Logs</h3>
              <GradientButton onClick={toggleExpand} size="sm">
                ▼
              </GradientButton>
            </div>
            {/* Message List */}
            <div className="relative flex-grow bg-white custom-scrollbar overflow-y-auto overflow-x-hidden" ref={scrollRef}>
              <AnimatePresence>
                <motion.div
                    className="p-3 space-y-3"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                  >
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        className={`flex flex-col ${msg.sender === 'Kuro' ? 'items-start' : 'items-start'}`}
                        variants={messageVariants}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={characterProfiles[msg.sender]?.pfp} alt={msg.sender} />
                            <AvatarFallback className={characterProfiles[msg.sender]?.color}>
                              {msg.sender.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`relative w-[80%] px-4 py-3 rounded-3xl shadow-md break-words transition-all hover:brightness-105 ${
                              msg.sender === 'System'
                                ? 'bg-slate-600 text-white'
                                : characterProfiles[msg.sender]
                                ? characterProfiles[msg.sender].color + ' text-black'
                                : 'bg-slate-700 text-black'
                            }`}
                          >
                            <p className="font-bold text-xs mb-1 font-title">{msg.sender}</p>
                            <p className="text-sm leading-snug font-body">{msg.content}</p>
                            <span className="absolute bottom-1 right-2 text-[0.7rem] text-slate-500 font-body">
                              {moment(msg.timestamp).format("HH:mm")}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
              </AnimatePresence>
            </div>
          </div>
        ) : (
          // Collapsed Chat Preview (with arrow button)
          <div className="flex items-center px-4 py-2 cursor-pointer bg-white" onClick={toggleExpand}>
            <Avatar className="w-10 h-10">
              <AvatarImage src={lastMsg ? characterProfiles[lastMsg.sender]?.pfp : ''} alt={lastMsg?.sender || 'System'} />
              <AvatarFallback className={lastMsg ? characterProfiles[lastMsg.sender]?.color : 'bg-slate-500'}>
                {lastMsg ? lastMsg.sender.charAt(0) : 'S'}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 flex flex-col flex-grow">
              <div className="flex justify-between">
                <span className="text-xs font-bold text-black font-title">
                  {lastMsg ? lastMsg.sender : 'System'}
                </span>
                <span className="text-xs text-slate-400 font-body">
                  {lastMsg ? moment(lastMsg.timestamp).format("HH:mm") : ''}
                </span>
              </div>
              <div className="text-sm text-slate-900 truncate max-w-[250px] font-body">
                {lastMsg ? lastMsg.content : 'No messages yet.'}
              </div>
            </div>
            <GradientButton onClick={toggleExpand} size="sm" className="ml-2">
              ▲
            </GradientButton>
          </div>
        )}
      </motion.div>

    </div>
  )
}
