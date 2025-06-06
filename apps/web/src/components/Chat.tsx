import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";

interface Session {
  id: string;
}

interface Message {
  id: string;
  content: string;
  type: "user" | "agent" | "thought";
}

const Chat: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/sessions")
      .then((res) => res.json())
      .then((data) => setSessions(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    // fetch existing messages
    fetch(`http://localhost:3000/sessions/${sessionId}/messages`)
      .then((res) => res.json())
      .then((data: { id: string; content: string; role: "user" | "agent" }[]) =>
        setMessages(
          data.map((m) => ({ id: m.id, content: m.content, type: m.role }))
        )
      )
      .catch(console.error);
    // open websocket
    const ws = new WebSocket(`ws://localhost:3000?sessionId=${sessionId}`);
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data) as {
        type: "thought" | "message";
        data: any;
      };
      if (msg.type === "thought") {
        setMessages((prev) => [
          ...prev,
          {
            id: (prev.length + 1).toString(),
            content: msg.data,
            type: "thought",
          },
        ]);
      } else if (msg.type === "message") {
        setMessages((prev) => [
          ...prev,
          { id: msg.data.id, content: msg.data.content, type: "agent" },
        ]);
      }
    };
    wsRef.current = ws;
    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [sessionId]);

  const handleSend = () => {
    if (!input.trim() || !sessionId) return;
    // add user's message to chat
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), content: input, type: "user" },
    ]);
    fetch(`http://localhost:3000/sessions/${sessionId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input }),
    }).catch(console.error);
    setInput("");
  };

  return (
    <div className="chat-container">
      <h2>Chat</h2>
      {!sessionId && (
        <div className="session-selector">
          <label>Please select a session:&nbsp;</label>
          <select
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
          >
            <option value="">--Choose a session--</option>
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id}
              </option>
            ))}
          </select>
        </div>
      )}
      {sessionId && (
        <div className="chat-box">
          <div className="messages">
            {messages.map((m) => (
              <div key={m.id} className={`message ${m.type}`}>
                <strong>{m.type}:</strong>&nbsp;{m.content}
              </div>
            ))}
          </div>
          <div className="input-box">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
