'use client'

import { useState, useEffect } from 'react'
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { InteractionDetailsModal } from './InteractionDetailsModal'
import { Star, Trophy } from 'lucide-react'

type Character = {
  name: string
  level: number
  xp: number
  interactions: number
}

const initialCharacters: Character[] = [
  { name: 'Alice', level: 1, xp: 0, interactions: 0 },
  { name: 'Bob', level: 1, xp: 0, interactions: 0 },
  { name: 'Charlie', level: 1, xp: 0, interactions: 0 },
  { name: 'Diana', level: 1, xp: 0, interactions: 0 },
  { name: 'Ethan', level: 1, xp: 0, interactions: 0 },
]

const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500']

export default function CharacterList() {
  const [characters, setCharacters] = useState<Character[]>(initialCharacters)
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCharacters(prev => 
        prev.map(character => {
          const newInteractions = character.interactions + Math.floor(Math.random() * 3)
          const newXP = character.xp + Math.floor(Math.random() * 10)
          const newLevel = Math.floor(newXP / 100) + 1
          return {
            ...character,
            interactions: newInteractions,
            xp: newXP % 100,
            level: newLevel
          }
        })
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleCharacterClick = (character: string) => {
    setSelectedCharacter(character)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-4">
      {characters.map((character, index) => (
        <div 
          key={character.name}
          className={`p-4 rounded-lg cursor-pointer transition-all ${colors[index]} bg-opacity-20 hover:bg-opacity-30 hover:transform hover:scale-105`}
          onClick={() => handleCharacterClick(character.name)}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-lg">{character.name}</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>Level {character.level}</span>
            </div>
          </div>
          <Progress value={character.xp} className="h-2 mb-2" />
          <div className="flex justify-between items-center">
            <span className="text-sm">Interactions: {character.interactions}</span>
            <Button size="sm" variant="outline" className="text-xs">
              <Trophy className="w-3 h-3 mr-1" />
              View Achievements
            </Button>
          </div>
        </div>
      ))}
      {selectedCharacter && (
        <InteractionDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          character={selectedCharacter}
        />
      )}
    </div>
  )
}

