import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Cat, Battery, Brain, PlayCircle, HeartPulse, Heart } from 'lucide-react'
import { useSelector } from "react-redux"
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

interface CharacterStatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
}

const CharacterStatsDialog = ({ open, onOpenChange, name }: CharacterStatsDialogProps) => {
  const [stats, setStats] = useState({
    activity: "Waiting for the awakening...",
    mood: "Happy",
    energy: 60,
    thoughts: "Waiting for the awakening...",
    relationWithKuro: 0
  })

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case "Ecstatic": return "😺"
      case "Happy": return "😸"
      case "Content": return "😺"
      case "Curious": return "🙀"
      case "Playful": return "😽"
      case "Sleepy": return "😴"
      case "Grumpy": return "😾"
      default: return "😺"
    }
  }

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

        <DialogHeader className="p-4 border-b-2 border-black bg-gradient-to-r from-yellow-100 to-orange-100 rounded-t-lg">
          <DialogTitle className="text-2xl font-bold text-black flex items-center gap-2 font-title">
            <Cat className="w-6 h-6" />
            {name}'s Status
          </DialogTitle>
        </DialogHeader>

        <motion.div 
          className="p-4 space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              variants={itemVariants}
              whileHover={hoverSpring}
              className="rounded-xl border-2 border-black bg-gradient-to-r from-blue-100 to-cyan-100 p-3 shadow-[2px_2px_0_0_black]"
            >
              <div className="flex items-center gap-2 mb-2">
                <PlayCircle className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-black font-body">Activity</span>
              </div>
              <p className="text-sm text-black font-body">{capitalizeFirstLetter(stats.activity)}</p>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              whileHover={hoverSpring}
              className="rounded-xl border-2 border-black bg-gradient-to-r from-red-100 to-pink-100 p-3 shadow-[2px_2px_0_0_black]"
            >
              <div className="flex items-center gap-2 mb-2">
                <HeartPulse className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium text-black font-body">Mood</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-300 font-body">{capitalizeFirstLetter(stats.mood)}</span>
                <span className="text-2xl" role="img" aria-label={`Mood: ${stats.mood}`}>
                  {getMoodEmoji(stats.mood)}
                </span>
              </div>
            </motion.div>
          </div>

          <motion.div 
            variants={itemVariants}
            whileHover={hoverSpring}
            className="rounded-xl border-2 border-black bg-gradient-to-r from-yellow-100 to-amber-100 p-3 shadow-[2px_2px_0_0_black]"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Battery className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium text-black font-body">Energy</span>
              </div>
              <span className="text-sm text-black font-body">{stats.energy}%</span>
            </div>
            <Progress value={stats.energy} className="h-2 bg-white border border-black" />
          </motion.div>
          { name != "Kuro" && (
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <h3 className="text-lg font-medium text-slate-200 mb-2 flex items-center font-title">
                <Heart className="w-5 h-5 mr-2 text-red-400" />
                Relationship with Kuro
              </h3>
              <Progress value={stats.relationWithKuro * 20} className="h-2 mb-2" />
              <p className="text-sm text-slate-300 font-body">Level {stats.relationWithKuro} / 5</p>
            </div>
          )}

          <motion.div 
            variants={itemVariants}
            whileHover={hoverSpring}
            className="rounded-xl border-2 border-black bg-gradient-to-r from-purple-100 to-violet-100 p-3 shadow-[2px_2px_0_0_black]"
          >
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-black font-title">{name}'s Thoughts</span>
            </div>
            <p className="text-sm text-black italic font-body">
              "{stats.thoughts}"
            </p>
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

export default CharacterStatsDialog
