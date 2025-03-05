export interface AgentInteraction {
  totalInteractions: number;
  lastInteractDate: string | null;
}

export interface AgentInteractState {
  interacts: AgentInteraction[];
}
