import "reflect-metadata";

export * from "./entities";
export * from "./database";
export * from "./runtime";

export enum TimelineItemType {
  MESSAGE = "message",
  THOUGHT = "thought",
}

export enum TimelineRoleType {
  USER = "user",
  AGENT = "agent",
  SYSTEM = "system",
}

export interface TimelineItem {
  type: TimelineItemType;
  id: string;
  role: TimelineRoleType;
  content: string;
  action?: string;
  tool?: string;
  reasoning?: string;
  createdAt: Date;
}

export enum ToolType {
  MODEL = "model",
  MCP = "mcp",
  OPENAPI = "openapi",
}

export interface Tool {
  id: string;
  name: string;
  type: ToolType;
  displayName?: string;
  description?: string;
  strengths: Array<string>;
  weaknesses: Array<string>;
  usageHints: Array<string>;
  entrypoint?: string;
  enabled: boolean;

  mcpConfig?: {
    serverUrl: string;
    endpointPath: string;
    inputSchema?: object;
    authToken?: string;
    annotations?: {
      // Optional hints about tool behavior
      title?: string; // Human-readable title for the tool
      readOnlyHint?: boolean; // If true, the tool does not modify its environment
      destructiveHint?: boolean; // If true, the tool may perform destructive updates
      idempotentHint?: boolean; // If true, repeated calls with same args have no additional effect
      openWorldHint?: boolean; // If true, tool interacts with external entities
    };
  };

  openapiConfig?: {
    baseUrl: string;
    path: string;
    method: "GET" | "POST";
    headers?: Record<string, string>;
    requestSchema?: object;
    operationId: string;
    authType?: "none" | "bearer" | "apiKey";
  };
}
