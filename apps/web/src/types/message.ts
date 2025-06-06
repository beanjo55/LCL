export interface Message {
  id: string;
  content: string;
  role: "user" | "agent";
  sessionId: string;
}
