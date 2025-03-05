export interface BasicNeeds {
  energy: number;
  health: number;
}

export interface SocialRelationship {
  closeness: number;
}

export interface Agent {
  name: string;
  emotion: string;
  basic_needs: BasicNeeds;
  thoughts: string;
  activity: string;
  location: string[];
  social_relationships: Record<string, SocialRelationship>;
}

export interface AgentState {
  agents: Agent[];
  conversations: Record<string, any[]>;
  loading: boolean;
  error: string | null;
}
