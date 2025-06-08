import type { Session } from "../types/session";
import type { TimelineItem } from "../types/timelineItem";
import type { Tool } from "../types/tool";
import type { ApiClient, SessionsApi } from "./clientTypes";

const mockSessions: Array<Session> = [
  { id: "1", name: "Mock Session 1", task: "Mock Task 1" },
  { id: "2", name: "Mock Session 2", task: "Mock Task 2" },
];

const mockTools: Array<Tool> = [
  {
    id: "1",
    name: "Mock Tool 1",
    type: "model",
    description: "this is a mock model tool for development",
    strengths: ["fast", "accurate"],
    weaknesses: ["expensive"],
    usageHints: ["dunno yet"],
    enabled: true,
  },
  {
    id: "2",
    name: "Mock Tool 2",
    type: "mcp",
    description: "this is a mock mcp tool for development",
    strengths: ["fast", "accurate"],
    weaknesses: ["expensive"],
    usageHints: ["dunno yet"],
    enabled: true,
  },
  {
    id: "3",
    name: "Mock Tool 3",
    type: "openapi",
    description: "this is a mock openapi tool for development",
    strengths: ["fast", "accurate"],
    weaknesses: ["expensive"],
    usageHints: ["dunno yet"],
    enabled: true,
  },
  {
    id: "4",
    name: "Mock Tool 4",
    type: "mcp",
    description: "this is a mock disabled mcp tool for development",
    strengths: ["fast", "accurate"],
    weaknesses: ["expensive"],
    usageHints: ["dunno yet"],
    enabled: false,
  },
];

const mockTimelineItems: Array<TimelineItem> = [
  {
    id: "1",
    sessionId: "1",
    type: "message",
    content: "mock user content",
    role: "user",
  },
  {
    id: "2",
    sessionId: "1",
    type: "message",
    content: "mock agent content",
    role: "agent",
  },
  {
    id: "3",
    sessionId: "1",
    type: "thought",
    response: "mock thought response",
    reasoning: "because i need to have a reason",
    satisfied: true,
  },
  {
    id: "4",
    sessionId: "1",
    type: "toolCall",
    toolId: "1",
    toolName: "Mock Tool",
    input: "what was passed to the tool",
    response: "mock tool response",
    reasoning: "because i need to have a reason",
  },
];

export class MockApiClient implements ApiClient {
  sessions: SessionsApi = {
    getSessions: async () => mockSessions,
    getSession: async (id) => mockSessions.find((session) => session.id === id),
    createSession: async (name) =>
      ({
        id: Math.random().toString(36).substring(7),
        name,
      } as Session),
  };
  tools = {
    getTools: async () => mockTools,
    getTool: async (id: string) => mockTools.find((tool) => tool.id === id),
  };
  timeline = {
    getTimeline: async (sessionId: string) =>
      mockTimelineItems.map((t) => ({ ...t, sessionId })),
    addItem: async (sessionId: string, item: TimelineItem) =>
      ({
        sessionId,
        ...item,
      } as TimelineItem),
  };
}
