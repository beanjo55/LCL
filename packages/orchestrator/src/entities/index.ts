export * from "./Message.entity";
export * from "./Session.entity";
export * from "./Thought.entity";
export * from "./Tool.entity";

import { Message } from "./Message.entity";
import { Session } from "./Session.entity";
import { Thought } from "./Thought.entity";
import { Tool } from "./Tool.entity";

export const entities = [Message, Session, Thought, Tool] as const;
