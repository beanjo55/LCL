import type { Session } from "../types/session";
import type { TimelineItem } from "../types/timelineItem";
import type { Tool } from "../types/tool";

export interface SessionsApi {
  getSessions(): Promise<Array<Session>>;
  getSession(id: string): Promise<Session>;
  createSession(name: string): Promise<Session>;
}

export interface ToolsApi {
  getTools(): Promise<Array<Tool>>;
  getTool(id: string): Promise<Tool>;
}

export interface TimelineApi {
  getTimeline(sessionId: string): Promise<Array<TimelineItem>>;
  addItem(
    sessionId: string,
    item: Omit<TimelineItem, "id">
  ): Promise<TimelineItem>;
}

export interface ApiClient {
  sessions: SessionsApi;
  tools: ToolsApi;
  timeline: TimelineApi;
}
