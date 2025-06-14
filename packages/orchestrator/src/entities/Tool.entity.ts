import { Column, Entity, PrimaryColumn } from "typeorm";
import { v7 as uuid } from "uuid";

@Entity()
export class Tool {
  @PrimaryColumn("uuid")
  id: string = uuid();

  @Column()
  name: string;

  @Column()
  type: "model" | "mcp" | "openapi";

  @Column("text", { nullable: true })
  description: string;

  @Column("text", { array: true })
  strengths: Array<string>;

  @Column("text", { array: true })
  weaknesses: Array<string>;

  @Column("text", { array: true })
  usageHints: Array<string>;

  @Column("text", { nullable: true })
  entrypoint?: string;

  @Column("boolean")
  enabled: boolean = true;

  @Column("jsonb", { nullable: true })
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

  @Column("jsonb", { nullable: true })
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
