export interface ToolCall {
  id: string;
  sessionId: string;
  toolId?: string;
  toolName: string;
  input: string;
  response: string;
  reasoning: string;
}
