'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MapComponent from './Map'
import ChatLog from './ChatLog'
import ActivityList from './ActivityList'
import EventsList from './EventsList'

export default function TrumanShow() {
  const [currentEvent, setCurrentEvent] = useState("Kuro is exploring the neighborhood")
  const [weather, setWeather] = useState("sunny")

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate event changes
      const events = [
        "Kuro is chasing butterflies in the park",
        "Kuro is napping in a sunny spot",
        "Kuro is watching birds from the window",
        "Kuro is playing with a ball of yarn",
        "Kuro is exploring the neighborhood"
      ]
      setCurrentEvent(events[Math.floor(Math.random() * events.length)])

      // Simulate weather changes
      const weathers = ["sunny", "partly cloudy", "cloudy", "light rain", "heavy rain"]
      setWeather(weathers[Math.floor(Math.random() * weathers.length)])
    }, 60000) // Change event and weather every minute

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur supports-[backdrop-filter]:bg-slate-800/75 shadow-lg">
      <CardContent className="p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-yellow-400 tracking-wide">Kuro's World Adventure</h1>
        <div className="space-y-6">
          <MapComponent currentEvent={currentEvent} weather={weather} />
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>
            <TabsContent value="chat">
              <ChatLog />
            </TabsContent>
            <TabsContent value="activity">
              <ActivityList />
            </TabsContent>
            <TabsContent value="events">
              <EventsList />
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}

