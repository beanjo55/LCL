// src/server.ts
import express, { Request, Response } from "express";
import { WebSocketServer } from "ws";
import { createServer } from "http";
import { Database, runOrchestrationStream } from "orchestrator";
import { json } from "body-parser";

const app = express();
const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });
const db = new Database(process.env.DATABASE_URL!);

let sessionSockets: Map<string, any> = new Map();

app.use(json());

// WebSocket registration only
wss.on("connection", (socket, req) => {
  const sessionId = new URL(req.url || "", "http://localhost").searchParams.get(
    "sessionId"
  );
  if (!sessionId) return socket.close();

  sessionSockets.set(sessionId, socket);
  socket.on("close", () => sessionSockets.delete(sessionId));
});

// REST Endpoints
app.get("/sessions", async (_: Request, res: Response) => {
  const sessions = await db.getSessionsRepository().find();
  res.json(sessions);
});

app.get(
  "/sessions/:sessionId",
  async (req: Request<{ sessionId: string }>, res: any) => {
    const session = await db.getSessionsRepository().findOne({
      where: { id: req.params.sessionId },
      relations: ["messages", "thoughts"],
    });
    if (!session) return res.sendStatus(404);
    res.json(session);
  }
);

app.post(
  "/sessions/:sessionId/messages",
  async (req: Request<{ sessionId: string }>, res: any) => {
    const session = await db
      .getSessionsRepository()
      .findOneBy({ id: req.params.sessionId });
    if (!session) return res.sendStatus(404);

    const ws = sessionSockets.get(req.params.sessionId);

    await runOrchestrationStream(
      req.params.sessionId,
      req.body.content,
      (thought) => ws?.send(JSON.stringify({ type: "thought", data: thought })),
      (message) => ws?.send(JSON.stringify({ type: "message", data: message }))
    );

    res.sendStatus(202);
  }
);

app.get(
  "/sessions/:sessionId/messages",
  async (req: Request<{ sessionId: string }>, res: Response) => {
    const messages = await db.getMessagesRepository().find({
      where: { session: { id: req.params.sessionId } },
      order: { id: "ASC" },
    });
    res.json(messages);
  }
);

app.delete(
  "/sessions/:sessionId",
  async (req: Request<{ sessionId: string }>, res: Response) => {
    await db.getSessionsRepository().delete({ id: req.params.sessionId });
    res.sendStatus(204);
  }
);

app.get("/tools", async (_: Request, res: Response) => {
  const tools = await db.getToolsRepository().find();
  res.json(tools);
});

app.post("/tools", async (req: Request, res: Response) => {
  const tool = db.getToolsRepository().create(req.body);
  await db.getToolsRepository().save(tool);
  res.status(201).json(tool);
});

app.patch(
  "/tools/:toolId",
  async (req: Request<{ toolId: string }>, res: Response) => {
    await db.getToolsRepository().update({ id: req.params.toolId }, req.body);
    const updated = await db
      .getToolsRepository()
      .findOneBy({ id: req.params.toolId });
    res.json(updated);
  }
);

app.delete(
  "/tools/:toolId",
  async (req: Request<{ toolId: string }>, res: Response) => {
    await db.getToolsRepository().delete({ id: req.params.toolId });
    res.sendStatus(204);
  }
);

httpServer.listen(3000, () =>
  console.log("Server running on http://localhost:3000")
);
