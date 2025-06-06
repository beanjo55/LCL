import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { v7 as uuid } from "uuid";
import { Session } from "./Session.entity";

@Entity()
export class Message {
  @PrimaryColumn("uuid")
  id: string = uuid();

  @ManyToOne(() => Session, (session) => session.messages)
  session: Session;

  @Column("text")
  role: "user" | "agent";

  @Column("text")
  content: string;
}
