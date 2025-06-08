import type { Session } from "../types/session";
import type { TimelineItem } from "../types/timelineItem";
import type { Tool } from "../types/tool";
import type { ApiClient, SessionsApi } from "./clientTypes";

export class MockApiClient implements ApiClient {
  sessions: SessionsApi = {
    getSessions: async () =>
      [
        { id: "1", name: "Mock Session 1" },
        { id: "2", name: "Mock Session 2" },
      ] as Array<Session>,
    getSession: async (id) => ({ id, name: `Mock Session ${id}` } as Session),
    createSession: async (name) =>
      ({
        id: Math.random().toString(36).substring(7),
        name,
      } as Session),
  };
  tools = {
    getTools: async () => [] as Array<Tool>,
    getTool: async (id) => ({ id, name: `Mock Tool ${id}` } as Tool),
  };
  timeline = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getTimeline: async (sessionId) => [] as Array<TimelineItem>,
    addItem: async (sessionId, item) =>
      ({
        sessionId,
        ...item,
      } as TimelineItem),
  };
}
