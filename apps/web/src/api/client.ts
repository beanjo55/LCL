import type { Session } from "../types/session";
import type { TimelineItem } from "../types/timelineItem";
import type { Tool } from "../types/tool";
import type {
  ApiClient,
  SessionsApi,
  TimelineApi,
  ToolsApi,
} from "./clientTypes";

export class RealApiClient implements ApiClient {
  sessions: SessionsApi = {
    async getSessions(): Promise<Array<Session>> {
      const response = await fetch("/api/sessions");
      if (!response.ok) {
        throw new Error("Failed to fetch sessions");
      }
      return response.json();
    },

    async getSession(id: string): Promise<Session> {
      const response = await fetch(`/api/sessions/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch session with id ${id}`);
      }
      return response.json();
    },

    async createSession(name: string): Promise<Session> {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        throw new Error("Failed to create session");
      }
      return response.json();
    },
  };
  tools: ToolsApi = {
    async getTools(): Promise<Array<Tool>> {
      const response = await fetch("/api/tools");
      if (!response.ok) {
        throw new Error("Failed to fetch tools");
      }
      return response.json();
    },

    async getTool(id: string): Promise<Tool> {
      const response = await fetch(`/api/tools/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch tool with id ${id}`);
      }
      return response.json();
    },
  };
  timeline: TimelineApi = {
    async getTimeline(sessionId: string): Promise<Array<TimelineItem>> {
      const response = await fetch(`/api/sessions/${sessionId}/timeline`);
      if (!response.ok) {
        throw new Error(`Failed to fetch timeline for session ${sessionId}`);
      }
      return response.json();
    },

    async addItem(
      sessionId: string,
      item: Omit<TimelineItem, "id">
    ): Promise<TimelineItem> {
      const response = await fetch(`/api/sessions/${sessionId}/timeline`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });
      if (!response.ok) {
        throw new Error("Failed to add item to timeline");
      }
      return response.json();
    },
  };
}
