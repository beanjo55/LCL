import type React from "react";
import type { Session } from "../../../types/session";

const ChatListEntry: React.FC<{ session: Session }> = ({ session }) => {
  return (
    <div>
      <h3>{session.name}</h3>
      <p>ID: {session.id}</p>
    </div>
  );
};

export default ChatListEntry;
