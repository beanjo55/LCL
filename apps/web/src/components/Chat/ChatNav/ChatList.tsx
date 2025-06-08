import React, { useEffect, useState } from "react";
import type { Session } from "../../../types/session";
import ChatListEntry from "./ChatListEntry";

const ChatList: React.FC = () => {
  const [sessions, setSessions] = useState<Array<Session>>([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch("/api/sessions");
        if (!response.ok) {
          throw new Error("Failed to fetch sessions");
        }
        const data: Array<Session> = await response.json();
        setSessions(data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };
    fetchSessions();
  }, []);

  return (
    <React.Fragment>
      <h2>Chat Sessions</h2>
      {sessions.length ? (
        sessions.map((session) => (
          <ChatListEntry key={session.id} session={session} />
        ))
      ) : (
        <p>No chat sessions available</p>
      )}
    </React.Fragment>
  );
};

export default ChatList;
