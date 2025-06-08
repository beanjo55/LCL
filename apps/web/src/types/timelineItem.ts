interface BaseTimelineItem {
  id: string;
  sessionId: string;
  type: "message" | "toolCall" | "thought";
}

interface MessageTimelineItem extends BaseTimelineItem {
  type: "message";
  content: string;
  role: "user" | "agent";
}

interface ThoughtTimelineItem extends BaseTimelineItem {
  type: "thought";
  response: string;
  reasoning: string;
  satisfied: boolean;
}

interface ToolCallTimelineItem extends BaseTimelineItem {
  type: "toolCall";
  toolId?: string;
  toolName: string;
  input: string;
  response: string;
  reasoning: string;
}

export type TimelineItem =
  | MessageTimelineItem
  | ThoughtTimelineItem
  | ToolCallTimelineItem;
