export interface Tool {
  id: string;
  name: string;
  type: "model" | "mcp" | "openapi";
  strengths: Array<string>;
  weaknesses: Array<string>;
  usageHints: Array<string>;
  description: string;
  enabled: boolean;
  entrypoint?: string;

  mcpConfig?: {
    serverUrl: string;
    endpointPath: string;
    inputSchema?: object;
    authToken?: string;
    annotations?: {
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
