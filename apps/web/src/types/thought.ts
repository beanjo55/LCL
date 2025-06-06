export interface Thought {
  id: string;
  sessionId: string;
  response: string;
  reasoning: string;
  satisfied: boolean;
}
