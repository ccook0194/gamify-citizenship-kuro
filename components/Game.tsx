'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from './Header'
import CharacterList from './CharacterList'
import AdventureLog from './AdventureLog'
import WorldChat from './WorldChat'

export default function Game() {
  const [gameState, setGameState] = useState({
    level: 1,
    xp: 0,
    coins: 100,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        xp: prev.xp + 1,
        coins: prev.coins + Math.floor(Math.random() * 5),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (gameState.xp >= gameState.level * 100) {
      setGameState(prev => ({
        ...prev,
        level: prev.level + 1,
        xp: 0,
      }))
    }
  }, [gameState.xp, gameState.level])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100 p-4">
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur supports-[backdrop-filter]:bg-slate-800/75 shadow-lg">
        <CardContent className="p-4">
          <Header gameState={gameState} />
          <Tabs defaultValue="characters" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="characters">Characters</TabsTrigger>
              <TabsTrigger value="adventures">Adventures</TabsTrigger>
              <TabsTrigger value="chat">World Chat</TabsTrigger>
            </TabsList>
            <TabsContent value="characters">
              <CharacterList />
            </TabsContent>
            <TabsContent value="adventures">
              <AdventureLog />
            </TabsContent>
            <TabsContent value="chat">
              <WorldChat />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

