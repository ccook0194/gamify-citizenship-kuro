export interface Event {
  id: string;
  timestamp: string;
  type: 'interaction' | 'activity' | 'emotion' | 'achievement';
  description: string;
  agents: string[];
  location?: string;
  impact?: number;
}

export const globalEvents: Event[] = [
  {
    id: '1',
    timestamp: '2025-02-20T10:00:00Z',
    type: 'interaction',
    description: 'Kuro and Ivy collaborated on a research project',
    agents: ['Kuro', 'Ivy'],
    location: 'Library',
    impact: 85
  },
  {
    id: '2',
    timestamp: '2025-02-20T11:30:00Z',
    type: 'achievement',
    description: 'Theo completed a groundbreaking invention',
    agents: ['Theo'],
    impact: 95
  },
  {
    id: '3',
    timestamp: '2025-02-20T13:15:00Z',
    type: 'activity',
    description: 'Group meditation session led by Alice',
    agents: ['Alice', 'Ivy', 'Ava'],
    location: 'Garden',
    impact: 75
  },
  {
    id: '4',
    timestamp: '2025-02-20T14:45:00Z',
    type: 'emotion',
    description: 'Milo and Klaus discovered a hidden treasure room',
    agents: ['Milo', 'Klaus'],
    location: 'Ancient Ruins',
    impact: 90
  },
  {
    id: '18',
    timestamp: '2025-02-20T12:00:00Z',
    type: 'interaction',
    description: 'Council meeting to discuss recent discoveries',
    agents: ['Kuro', 'Theo', 'Ivy', 'Klaus', 'Ava'],
    location: 'Great Hall',
    impact: 92
  },
  {
    id: '19',
    timestamp: '2025-02-20T15:45:00Z',
    type: 'achievement',
    description: 'Combined magical energies to heal the ancient tree',
    agents: ['Alice', 'Ivy', 'Ava'],
    location: 'Sacred Grove',
    impact: 98
  },
  {
    id: '20',
    timestamp: '2025-02-20T09:00:00Z',
    type: 'activity',
    description: 'Morning training and knowledge exchange session',
    agents: ['Kuro', 'Theo', 'Milo'],
    location: 'Training Grounds',
    impact: 82
  },
  {
    id: '21',
    timestamp: '2025-02-20T16:30:00Z',
    type: 'emotion',
    description: 'Collective celebration of the day\'s achievements',
    agents: ['Kuro', 'Theo', 'Milo', 'Klaus', 'Ava', 'Alice', 'Ivy'],
    location: 'Great Hall',
    impact: 95
  }
]

export const agentEvents: Record<string, Event[]> = {
  Kuro: [
    {
      id: '5',
      timestamp: '2025-02-20T09:30:00Z',
      type: 'activity',
      description: 'Morning training session with Theo',
      agents: ['Kuro', 'Theo'],
      location: 'Training Grounds',
      impact: 70
    },
    {
      id: '1',
      timestamp: '2025-02-20T10:00:00Z',
      type: 'interaction',
      description: 'Collaborated with Ivy on a research project',
      agents: ['Kuro', 'Ivy'],
      location: 'Library',
      impact: 85
    },
    {
      id: '8',
      timestamp: '2025-02-20T15:30:00Z',
      type: 'emotion',
      description: 'Experienced a moment of profound insight',
      agents: ['Kuro'],
      location: 'Meditation Room',
      impact: 90
    }
  ],
  Theo: [
    {
      id: '6',
      timestamp: '2025-02-20T08:15:00Z',
      type: 'activity',
      description: 'Early morning invention testing',
      agents: ['Theo'],
      location: 'Workshop',
      impact: 80
    },
    {
      id: '2',
      timestamp: '2025-02-20T11:30:00Z',
      type: 'achievement',
      description: 'Completed a groundbreaking invention',
      agents: ['Theo'],
      impact: 95
    },
    {
      id: '9',
      timestamp: '2025-02-20T14:00:00Z',
      type: 'interaction',
      description: 'Shared invention insights with Klaus',
      agents: ['Theo', 'Klaus'],
      location: 'Workshop',
      impact: 75
    }
  ],
  Ivy: [
    {
      id: '7',
      timestamp: '2025-02-20T07:45:00Z',
      type: 'activity',
      description: 'Morning meditation and study',
      agents: ['Ivy'],
      location: 'Garden',
      impact: 65
    },
    {
      id: '3',
      timestamp: '2025-02-20T13:15:00Z',
      type: 'activity',
      description: 'Led group meditation session',
      agents: ['Alice', 'Ivy', 'Ava'],
      location: 'Garden',
      impact: 75
    },
    {
      id: '10',
      timestamp: '2025-02-20T16:00:00Z',
      type: 'achievement',
      description: 'Discovered a new healing technique',
      agents: ['Ivy'],
      location: 'Ancient Library',
      impact: 88
    }
  ],
  Milo: [
    {
      id: '11',
      timestamp: '2025-02-20T08:00:00Z',
      type: 'activity',
      description: 'Started a new expedition',
      agents: ['Milo'],
      location: 'Forest Edge',
      impact: 70
    },
    {
      id: '4',
      timestamp: '2025-02-20T14:45:00Z',
      type: 'emotion',
      description: 'Discovered a hidden treasure room',
      agents: ['Milo', 'Klaus'],
      location: 'Ancient Ruins',
      impact: 90
    }
  ],
  Klaus: [
    {
      id: '12',
      timestamp: '2025-02-20T09:00:00Z',
      type: 'activity',
      description: 'Conducted ancient text research',
      agents: ['Klaus'],
      location: 'Archives',
      impact: 75
    },
    {
      id: '13',
      timestamp: '2025-02-20T12:30:00Z',
      type: 'achievement',
      description: 'Decoded an important historical document',
      agents: ['Klaus'],
      location: 'Archives',
      impact: 85
    }
  ],
  Ava: [
    {
      id: '14',
      timestamp: '2025-02-20T10:30:00Z',
      type: 'emotion',
      description: 'Created a beautiful art piece',
      agents: ['Ava'],
      location: 'Art Studio',
      impact: 80
    },
    {
      id: '15',
      timestamp: '2025-02-20T15:00:00Z',
      type: 'interaction',
      description: 'Taught art techniques to Alice',
      agents: ['Ava', 'Alice'],
      location: 'Art Studio',
      impact: 70
    }
  ],
  Alice: [
    {
      id: '16',
      timestamp: '2025-02-20T11:00:00Z',
      type: 'activity',
      description: 'Tended to the healing garden',
      agents: ['Alice'],
      location: 'Garden',
      impact: 75
    },
    {
      id: '17',
      timestamp: '2025-02-20T16:30:00Z',
      type: 'achievement',
      description: 'Developed a new healing potion',
      agents: ['Alice'],
      location: 'Alchemy Lab',
      impact: 85
    }
  ]
}
