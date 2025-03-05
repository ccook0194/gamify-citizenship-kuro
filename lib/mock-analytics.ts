export interface AgentActivity {
  category: string,
  intensity: number,
  timestamp: string,
  location: string,
  description: string,
  agents: string[]
}
export interface AgentAnalytics {
  basicNeeds: {
    timestamps: string[];
    energy: number[];
    health: number[];
  };
  socialRelationships: {
    agent: string;
    closeness: number;
    interactions: number;
  }[];
  activities: {
    timestamps: string[];
    activities: AgentActivity[];
  };
  emotions: {
    emotion: string;
    percentage: number;
  }[];
}

export interface AgentProfile {
  pfp: string;
  color: string;
}

export const agentProfiles: Record<string, AgentProfile> = {
  Kuro: { pfp: '/pfps/pfp1.png', color: 'bg-rose-200' },
  Theo: { pfp: '/pfps/pfp2.png', color: 'bg-cyan-200' },
  Milo: { pfp: '/pfps/pfp3.png', color: 'bg-amber-200' },
  Klaus: { pfp: '/pfps/pfp4.png', color: 'bg-blue-200' },
  Ava: { pfp: '/pfps/pfp5.png', color: 'bg-yellow-50' },
  Alice: { pfp: '/pfps/pfp6.png', color: 'bg-pink-200' },
  Ivy: { pfp: '/pfps/pfp7.png', color: 'bg-violet-200' }
}

export const mockAnalytics: Record<string, AgentAnalytics> = {
  Kuro: {
    basicNeeds: {
      timestamps: generateTimestamps(7),
      energy: [85, 75, 90, 65, 80, 95, 70],
      health: [90, 88, 85, 92, 87, 89, 91],
    },
    socialRelationships: [
      { agent: "Ivy", closeness: 85, interactions: 42 },
      { agent: "Theo", closeness: 75, interactions: 35 },
      { agent: "Alice", closeness: 65, interactions: 28 },
    ],
    activities: {
      timestamps: generateTimestamps(5),
      activities: [],
    },
    emotions: [
      { emotion: "Happy", percentage: 45 },
      { emotion: "Curious", percentage: 25 },
      { emotion: "Excited", percentage: 20 },
      { emotion: "Calm", percentage: 10 },
    ],
  },
  Theo: {
    basicNeeds: {
      timestamps: generateTimestamps(7),
      energy: [88, 92, 85, 90, 87, 89, 91],
      health: [90, 92, 89, 91, 88, 90, 93],
    },
    socialRelationships: [
      { agent: "Kuro", closeness: 75, interactions: 35 },
      { agent: "Milo", closeness: 80, interactions: 40 },
      { agent: "Klaus", closeness: 85, interactions: 42 },
    ],
    activities: {
      timestamps: generateTimestamps(5),
      activities: [],
    },
    emotions: [
      { emotion: "Focused", percentage: 40 },
      { emotion: "Innovative", percentage: 30 },
      { emotion: "Determined", percentage: 20 },
      { emotion: "Excited", percentage: 10 },
    ],
  },
  Milo: {
    basicNeeds: {
      timestamps: generateTimestamps(7),
      energy: [82, 88, 85, 90, 87, 84, 89],
      health: [87, 89, 91, 88, 90, 92, 89],
    },
    socialRelationships: [
      { agent: "Theo", closeness: 80, interactions: 40 },
      { agent: "Ava", closeness: 75, interactions: 35 },
      { agent: "Klaus", closeness: 70, interactions: 30 },
    ],
    activities: {
      timestamps: generateTimestamps(5),
      activities: [],
    },
    emotions: [
      { emotion: "Adventurous", percentage: 40 },
      { emotion: "Curious", percentage: 30 },
      { emotion: "Brave", percentage: 20 },
      { emotion: "Excited", percentage: 10 },
    ],
  },
  Klaus: {
    basicNeeds: {
      timestamps: generateTimestamps(7),
      energy: [85, 90, 87, 92, 88, 91, 89],
      health: [89, 91, 90, 88, 92, 90, 93],
    },
    socialRelationships: [
      { agent: "Theo", closeness: 85, interactions: 42 },
      { agent: "Milo", closeness: 70, interactions: 30 },
      { agent: "Ava", closeness: 75, interactions: 35 },
    ],
    activities: {
      timestamps: generateTimestamps(5),
      activities: [],
    },
    emotions: [
      { emotion: "Wise", percentage: 35 },
      { emotion: "Patient", percentage: 30 },
      { emotion: "Thoughtful", percentage: 25 },
      { emotion: "Curious", percentage: 10 },
    ],
  },
  Ava: {
    basicNeeds: {
      timestamps: generateTimestamps(7),
      energy: [90, 85, 88, 92, 87, 89, 91],
      health: [88, 90, 92, 89, 91, 90, 93],
    },
    socialRelationships: [
      { agent: "Milo", closeness: 75, interactions: 35 },
      { agent: "Klaus", closeness: 75, interactions: 35 },
      { agent: "Alice", closeness: 80, interactions: 38 },
    ],
    activities: {
      timestamps: generateTimestamps(5),
      activities: [],
    },
    emotions: [
      { emotion: "Creative", percentage: 40 },
      { emotion: "Inspired", percentage: 30 },
      { emotion: "Joyful", percentage: 20 },
      { emotion: "Peaceful", percentage: 10 },
    ],
  },
  Alice: {
    basicNeeds: {
      timestamps: generateTimestamps(7),
      energy: [87, 90, 85, 88, 92, 86, 89],
      health: [90, 88, 91, 89, 92, 90, 93],
    },
    socialRelationships: [
      { agent: "Kuro", closeness: 65, interactions: 28 },
      { agent: "Ava", closeness: 80, interactions: 38 },
      { agent: "Ivy", closeness: 75, interactions: 35 },
    ],
    activities: {
      timestamps: generateTimestamps(5),
      activities: [],
    },
    emotions: [
      { emotion: "Caring", percentage: 35 },
      { emotion: "Gentle", percentage: 30 },
      { emotion: "Peaceful", percentage: 25 },
      { emotion: "Loving", percentage: 10 },
    ],
  },
  Ivy: {
    basicNeeds: {
      timestamps: generateTimestamps(7),
      energy: [90, 85, 75, 80, 95, 70, 85],
      health: [88, 92, 90, 85, 89, 91, 87],
    },
    socialRelationships: [
      { agent: "Kuro", closeness: 85, interactions: 42 },
      { agent: "Alice", closeness: 75, interactions: 35 },
      { agent: "Ava", closeness: 70, interactions: 32 },
    ],
    activities: {
      timestamps: generateTimestamps(5),
      activities: [],
    },
    emotions: [
      { emotion: "Wise", percentage: 40 },
      { emotion: "Patient", percentage: 30 },
      { emotion: "Focused", percentage: 20 },
      { emotion: "Serene", percentage: 10 },
    ],
  },
};

function generateTimestamps(days: number): string[] {
  const timestamps: string[] = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    timestamps.push(date.toISOString().split('T')[0]);
  }
  
  return timestamps;
}
