import React, { useEffect, useState } from 'react'
import { Agent } from "@/redux/types/agent"
import { AgentInteractState } from "@/redux/types/interactions"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { MapPin, Heart, MessageCircle, Clock } from 'lucide-react'
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { capitalizeFirstLetter } from '@/lib/utils'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 12 }
  }
}

const hoverSpring = {
  scale: 1.02,
  transition: { type: "spring", stiffness: 300, damping: 15 }
}

interface AIAgent {
  id: number;
  name: string;
  location: string;
  avatar: string;
  color: string;
  isMainAgent: boolean;
}

interface AIAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: AIAgent | null;
  date: Date;
}

const AIAgentDialog = ({ open, onOpenChange, agent, date }: AIAgentDialogProps) => {
  if (!agent) return null

  const agents = useSelector((state: RootState) => state.agentActivity.agents as Agent[])
  const agentInteracts = useSelector((state: RootState) => state.agentInteracts as AgentInteractState).interacts

  const [mood, setMood] = useState("Happy")
  const [activity, setActivity] = useState("")
  const [location, setLocation] = useState(agent.location)
  const [relationWithKuro, setRelationWithKuro] = useState(0)
  const [interactCount, setInteractCount] = useState(0)
  const [interactDate, setInteractDate] = useState<Date | null>(null)

  useEffect(() => {
    if (!agents || !agent) return;
    
    const agentActivity = agents.find((agt) => agt.name === agent.name);
    const interact = agentInteracts[agent.id - 1];

    if (agentActivity) {
      setMood(agentActivity.emotion)
      setActivity(agentActivity.activity.split('>')[0])
      setLocation(agentActivity.location.join(" > "))
      setRelationWithKuro(agentActivity.social_relationships['Kuro']?.closeness / 2 | 0)  
    } else {
      setMood("Happy")
      setActivity("")
      setLocation(agent.location)
      setRelationWithKuro(0)
    }
    
    setInteractCount(interact.totalInteractions)
    if (interact.lastInteractDate) setInteractDate(new Date(interact.lastInteractDate!))
  }, [agent, agents])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white border-2 border-black shadow-[4px_4px_0_0_black] p-0 overflow-hidden rounded-xl">
        {/* Tech pattern background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" 
          style={{
            backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />

        <DialogHeader className="p-4 border-b-2 border-black bg-gradient-to-r from-blue-100 to-purple-100 rounded-t-lg">
          <DialogTitle className="text-2xl font-bold text-black font-title">
            {agent.name}
          </DialogTitle>
        </DialogHeader>

        <motion.div 
          className="p-4 space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div 
            variants={itemVariants}
            whileHover={hoverSpring}
            className="rounded-xl border-2 border-black bg-gradient-to-r from-red-100 to-pink-100 p-3 shadow-[2px_2px_0_0_black]"
          >
            <h3 className="text-lg font-medium text-black mb-2 flex items-center font-title">
              <Heart className="w-5 h-5 mr-2 text-red-500" />
              Relationship with Kuro
            </h3>
            <div className="w-full h-3 border-2 border-black rounded-full overflow-hidden bg-white">
              <div 
                className="h-full bg-gradient-to-r from-red-400 to-pink-400" 
                style={{ width: `${relationWithKuro * 20}%` }} 
              />
            </div>
            <p className="text-sm text-black mt-2 font-body">Level {relationWithKuro} / 5</p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            whileHover={hoverSpring}
            className="rounded-xl border-2 border-black bg-gradient-to-r from-blue-100 to-cyan-100 p-3 shadow-[2px_2px_0_0_black]"
          >
            <h3 className="text-lg font-medium text-black mb-2 flex items-center font-title">
              <MessageCircle className="w-5 h-5 mr-2 text-blue-500" />
              Interactions
            </h3>
            <p className="text-sm text-black font-body">Total interactions: {interactCount}</p>
            <p className="text-sm text-black font-body">Last interaction: { interactDate ?
                Math.floor((date.getTime() - interactDate!.getTime()) / (60 * 60000))
                : ''
              } hours ago</p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            whileHover={hoverSpring}
            className="rounded-xl border-2 border-black bg-gradient-to-r from-green-100 to-emerald-100 p-3 shadow-[2px_2px_0_0_black]"
          >
            <h3 className="text-lg font-medium text-black mb-2 flex items-center font-title">
              <MapPin className="w-5 h-5 mr-2 text-green-500" />
              Current Location
            </h3>
            <p className="text-sm text-black font-body">{location}</p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            whileHover={hoverSpring}
            className="rounded-xl border-2 border-black bg-gradient-to-r from-purple-100 to-violet-100 p-3 shadow-[2px_2px_0_0_black]"
          >
            <h3 className="text-lg font-medium text-black mb-2 flex items-center font-title">
              <Clock className="w-5 h-5 mr-2 text-purple-500" />
              Current Status
            </h3>
            <p className="text-sm text-black font-body">Mood: { capitalizeFirstLetter(mood) }</p>
            <p className="text-sm text-black font-body">Activity: { capitalizeFirstLetter(activity) }</p>
          </motion.div>
        </motion.div>

        <style jsx>{`
          /* Custom scrollbar */
          :global(.custom-scrollbar::-webkit-scrollbar) {
            width: 6px;
          }
          :global(.custom-scrollbar::-webkit-scrollbar-track) {
            background: #ffecec;
            border-radius: 3px;
          }
          :global(.custom-scrollbar::-webkit-scrollbar-thumb) {
            background-color: #ff5a78;
            border-radius: 3px;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  )
}

export default AIAgentDialog
