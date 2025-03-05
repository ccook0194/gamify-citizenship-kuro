import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Star, Heart, MessageCircle, Trophy } from 'lucide-react'

type InteractionDetailsModalProps = {
  isOpen: boolean
  onClose: () => void
  character: string
}

export function InteractionDetailsModal({
  isOpen,
  onClose,
  character
}: InteractionDetailsModalProps) {
  const friendshipLevel = Math.floor(Math.random() * 5) + 1
  const friendshipProgress = Math.floor(Math.random() * 100)

  const achievements = [
    "First Meeting",
    "Coffee Buddies",
    "Adventure Partners",
    "Trusted Confidant",
    "Inseparable Friends"
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-slate-800 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            Kuro & {character}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-6">
          <div className="bg-slate-700 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400" /> Friendship Level {friendshipLevel}
            </h3>
            <Progress value={friendshipProgress} className="h-2 mb-2" />
            <p className="text-sm">{friendshipProgress}% to next level</p>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-400" /> Relationship
            </h3>
            <p className="text-sm mb-2"><span className="font-medium">{character} thinks:</span> Kuro is a playful and curious cat.</p>
            <p className="text-sm"><span className="font-medium">Kuro thinks:</span> {character} is a great friend to have adventures with.</p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" /> Achievements
            </h3>
            <ScrollArea className="h-[150px]">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${index < friendshipLevel ? 'bg-yellow-400' : 'bg-slate-600'}`}></div>
                  <span className={index < friendshipLevel ? 'text-slate-100' : 'text-slate-400'}>{achievement}</span>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

