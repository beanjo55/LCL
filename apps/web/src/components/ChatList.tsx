import React, { useState } from "react";
import type { Session } from "../types/session";

const ChatList: React.FC = () => {
  const [sessions, setSessions] = useState<Array<Session>>([]);
};

export default ChatList;
