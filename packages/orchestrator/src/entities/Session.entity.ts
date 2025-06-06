import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { v7 as uuid } from "uuid";
import { Message } from "./Message.entity";
import { Thought } from "./Thought.entity";

@Entity()
export class Session {
  @PrimaryColumn("uuid")
  id: string = uuid();

  @OneToMany(() => Thought, (thought) => thought.session)
  thoughts: Array<Thought>;

  @OneToMany(() => Message, (message) => message.session)
  messages: Array<Message>;

  @Column("text")
  name: string;

  @Column()
  task: string;
}
