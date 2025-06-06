// src/runtime/index.ts
import { v7 as uuidv7 } from "uuid";
import { spawn } from "child_process";
import { Database } from "../database";
import { Message, Session, Thought, Tool } from "../entities";

const db = new Database(process.env.DATABASE_URL!);

const sessionMemory: Record<
  string,
  { messages: Message[]; thoughts: Thought[] }
> = {};
let toolCache: Tool[] = [];

async function initDatabase() {
  if (!db.getDataSource().isInitialized) {
    await db.getDataSource().initialize();
    toolCache = await db.getToolsRepository().find();
  }
}

function callModelStream(
  model: string,
  prompt: string,
  onChunk: (chunk: string) => void
): Promise<string> {
  return new Promise((resolve) => {
    const proc = spawn("ollama", ["run", model, "-p", prompt]);
    let output = "";

    proc.stdout.on("data", (data) => {
      const chunk = data.toString();
      output += chunk;
      onChunk(chunk);
    });

    proc.stderr.on("data", (data) => console.error(data.toString()));
    proc.on("close", () => resolve(output.trim()));
  });
}

function buildSystemPrompt(task: string): string {
  const toolList = toolCache
    .map((tool) => `- ${tool.name}: ${tool.description}`)
    .join("\n");
  return `You are a model orchestrator working on the task: "${task}"

You have access to tools:
${toolList}

Think step-by-step and decide whether to use a tool, contribute to the answer, or finalize the answer.
Always assume a purpose built tool will function more effectively than yourself, if a tool is available, use it.
If using a tool, respond with:
TOOL: <tool>\nINPUT: <input>\nREASONING: <why>

If satisfied with your work, respond with:\nFINAL: <output>`;
}

async function replyMessage(
  session: Session,
  role: "user" | "agent",
  content: string
): Promise<Message> {
  const messageRepo = db.getMessagesRepository();
  const message = messageRepo.create({ id: uuidv7(), session, role, content });
  await messageRepo.save(message);
  sessionMemory[session.id].messages.push(message);
  return message;
}

async function replyThought(
  session: Session,
  data: Omit<Thought, "id" | "session">
): Promise<Thought> {
  const thoughtRepo = db.getThoughtsRepository();
  const thought = thoughtRepo.create({ id: uuidv7(), session, ...data });
  await thoughtRepo.save(thought);
  sessionMemory[session.id].thoughts.push(thought);
  return thought;
}

async function callTool(
  tool: string,
  input: string,
  onUpdate: (chunk: string) => void
): Promise<string> {
  let result = "";
  await callModelStream(tool, input, (chunk) => {
    result += chunk;
    onUpdate(chunk);
  });
  return result;
}

export async function runOrchestrationStream(
  sessionId: string,
  input: string,
  onThought: (thought: Thought) => void,
  onMessage: (message: Message) => void
) {
  await initDatabase();

  const sessionRepo = db.getSessionsRepository();
  let session = await sessionRepo.findOne({
    where: { id: sessionId },
    relations: ["thoughts", "messages"],
  });

  if (!session) {
    session = sessionRepo.create({
      id: sessionId,
      task: input,
      messages: [],
      thoughts: [],
    });
    await sessionRepo.save(session);
  }

  sessionMemory[sessionId] = {
    messages: [...session.messages],
    thoughts: [...session.thoughts],
  };

  const userMessage = await replyMessage(session, "user", input);
  onMessage(userMessage);

  const systemPrompt = buildSystemPrompt(session.task);
  const thoughtLog = sessionMemory[sessionId].thoughts
    .map(
      (thought) =>
        `Step ${thought.id}: TOOL=${thought.toolName || "n/a"}\nINPUT: ${
          thought.input || ""
        }\nRESPONSE: ${thought.response || ""}\nREASONING: ${
          thought.reasoning
        }\nSATISFIED: ${thought.satisfied}\n`
    )
    .join("\n---\n");

  const fullPrompt = `${systemPrompt}\n\nTHOUGHTS:\n${thoughtLog}\n`;

  let controllerOutput = "";
  await callModelStream(
    "devstral:24b-small-2505-q4_K_M",
    fullPrompt,
    (chunk) => (controllerOutput += chunk)
  );

  if (controllerOutput.startsWith("FINAL:")) {
    const finalContent = controllerOutput.replace(/^FINAL:\s*/, "").trim();
    const finalMessage = await replyMessage(session, "agent", finalContent);
    onMessage(finalMessage);
    return;
  }

  const toolMatch = controllerOutput.match(/TOOL:\s*(\w+)/);
  const inputMatch = controllerOutput.match(/INPUT:\s*([\s\S]+?)REASONING:/);
  const reasonMatch = controllerOutput.match(/REASONING:\s*([\s\S]+)/);

  if (!toolMatch || !inputMatch || !reasonMatch) {
    throw new Error("Invalid response format from controller.");
  }

  const tool = toolMatch[1].trim();
  const toolInput = inputMatch[1].trim();
  const reasoning = reasonMatch[1].trim();

  let toolOutput = "";
  await callTool(tool, toolInput, (chunk) => (toolOutput += chunk));

  const thought = await replyThought(session, {
    toolName: tool,
    toolId: toolCache.find((t) => t.name === tool)?.id || "unknown",
    input: toolInput,
    response: toolOutput,
    reasoning,
    satisfied:
      toolOutput.toLowerCase().includes("done") || toolOutput.length > 0,
  });

  onThought(thought);
}
