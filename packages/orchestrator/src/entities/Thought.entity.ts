import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { v7 as uuid } from "uuid";
import { Session } from "./Session.entity";

@Entity()
export class Thought {
  @PrimaryColumn("uuid")
  id: string = uuid();

  @ManyToOne(() => Session, (session) => session.thoughts)
  session: Session;

  @Column()
  toolName?: string;

  @Column()
  toolId?: string;

  @Column()
  input?: string;

  @Column()
  response: string;

  @Column()
  reasoning: string;

  @Column()
  satisfied: boolean;
}
