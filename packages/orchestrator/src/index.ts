export enum TimelineItemType {
  MESSAGE = "message",
  THOUGHT = "thought",
}

export enum TimelineRoleType {
  USER = "user",
  AGENT = "agent",
  SYSTEM = "system",
}

export type TimelineItem = {
  type: TimelineItemType;
  id: string;
  role: TimelineRoleType;
  content: string;
  action?: string;
  tool?: string;
  reasoning?: string;
  createdAt: Date;
};

export enum ToolType {
  MODEL = "model",
  MCP = "mcp",
  OPENAPI = "openapi",
}
