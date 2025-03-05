'use client'

import '@fontsource/dynapuff'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BasicNeedsChart } from '@/components/analytics/BasicNeedsChart'
import { SocialChart } from '@/components/analytics/SocialChart'
import { EmotionsChart } from '@/components/analytics/EmotionsChart'
import { ActivitiesChart } from '@/components/analytics/ActivitiesChart'
import { EventLog } from '@/components/analytics/EventLog'
import { mockAnalytics, agentProfiles, AgentAnalytics } from '@/lib/mock-analytics'
import { globalEvents, agentEvents } from '@/lib/mock-events'
import { ArrowLeft } from 'lucide-react'
import styles from '@/styles/dashboard.module.css'
import backStyles from '@/styles/back-button.module.css'
import moment from 'moment'
import withAuth from '@/hoc/withAuth'

const DashboardPage = () => {
  const [selectedAgent, setSelectedAgent] = useState('Kuro')
  const [analytics, setAnalytics] = useState<Record<string, AgentAnalytics>>({})
  const [agentData, setAgentData] = useState<AgentAnalytics>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start_time: moment(new Date(new Date(2025, 1, 6, new Date().getHours(), new Date().getMinutes()).getTime() - 10 * 60 * 60000)).format("YYYY-MM-DD HH:mm"),
        end_time: "2025-02-06 " + moment(new Date()).format("HH:mm")
      })
    }).then(async (response) => {
      if (!response.ok) throw new Error("Failed to fetch time")
  
      const data = await response.json()

      setAnalytics(data.data)
      setAgentData(data.data[selectedAgent])
      setIsLoading(false)
    }).catch((err) => {
      console.log(err)
    })
    console.log(agentData)
  }, [])

  useEffect(() => {
    const data = analytics[selectedAgent]
    if (data) setAgentData(data)
  }, [selectedAgent])

  return (
    <div className="min-h-screen bg-white relative">
      <div className="fixed inset-0 pointer-events-none">
        <Image
          src="/cloudsblue.png"
          alt="Clouds"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      
      <div className="relative p-8 pt-4">
        <div className="flex justify-between items-center mb-4">
          <Link href="/" className={backStyles.backButton}>
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Menu</span>
          </Link>
        </div>
        <div className={`text-center mb-8 ${styles.fadeIn}`}>
          <h1 className="text-4xl font-bold text-slate-900">Analytics Dashboard</h1>
          <p className="text-slate-800 mt-2">Track and analyze agent behavior and interactions</p>
        </div>

        { isLoading || agentData == undefined ? (
          <div className="h-[50vh] flex flex-col justify-center items-center gap-4">
            <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-900 font-['DynaPuff'] text-lg">Fetching data...</p>
          </div>
        ) : (
          <>
            <Tabs defaultValue="Kuro" className="w-full max-w-7xl mx-auto" onValueChange={setSelectedAgent}>
              <TabsList className={`w-full justify-start mb-8 ${styles.slideIn}`}>
                {Object.keys(mockAnalytics).map((agent) => (
                  <TabsTrigger
                    key={agent}
                    value={agent}
                    className={`px-8 py-3 data-[state=active]:bg-white flex items-center gap-2 ${agentProfiles[agent].color} bg-opacity-20 data-[state=active]:bg-opacity-100`}
                  >
                    <div className="relative w-6 h-6 rounded-full overflow-hidden">
                      <Image
                        src={agentProfiles[agent].pfp}
                        alt={agent}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {agent}
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.keys(mockAnalytics).map((agent) => (
                <TabsContent key={agent} value={agent} className="space-y-8">
                  <div className={styles.chartGrid}>
                    <div className={styles.chartContainer}>
                      <BasicNeedsChart
                        timestamps={agentData.basicNeeds.timestamps}
                        energy={agentData.basicNeeds.energy}
                        health={agentData.basicNeeds.health}
                      />
                    </div>
                    <div className={styles.chartContainer}>
                      <SocialChart
                        relationships={agentData.socialRelationships}
                      />
                    </div>
                    <div className={styles.chartContainer}>
                      <EmotionsChart
                        emotions={agentData.emotions}
                      />
                    </div>
                    <div className={styles.chartContainer}>
                      <ActivitiesChart
                        timestamps={agentData.activities.timestamps}
                        activities={agentData.activities.activities}
                      />
                    </div>
                  </div>
                  
                  {agentEvents[agent] && (
                    <div className={styles.chartContainer}>
                      <EventLog 
                        events={agentData.activities.activities} 
                        showAgentImages={false}
                        title={`${agent}'s Recent Events`}
                        maxHeight="300px"
                      />
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>

            {/* <div className="max-w-7xl mx-auto mt-8">
              <EventLog 
                events={globalEvents} 
                title="Global Event Timeline"
                maxHeight="300px"
              />
            </div> */}
          </>
        )}
      </div>
    </div>
  )
}

export default withAuth(DashboardPage)