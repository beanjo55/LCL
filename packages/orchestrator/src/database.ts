import { DataSource, Repository } from "typeorm";
import { Message, Thought, Tool, Session } from "./entities";

export class Database {
  private static instance: DataSource;

  constructor(connectionURI: string) {
    if (!Database.instance) {
      Database.instance = new DataSource({
        type: "postgres",
        url: connectionURI,
        synchronize: true,
        logging: false,
        entities: [Message, Thought, Tool, Session],
      });

      Database.instance.initialize().catch((err) => {
        console.error("Database connection failed", err);
        process.exit(1);
      });
    }
  }

  getDataSource(): DataSource {
    if (!Database.instance.isInitialized) {
      throw new Error("Database connection is not initialized");
    }
    return Database.instance;
  }

  getToolsRepository(): Repository<Tool> {
    return Database.instance.getRepository(Tool);
  }

  getMessagesRepository(): Repository<Message> {
    return Database.instance.getRepository(Message);
  }

  getThoughtsRepository(): Repository<Thought> {
    return Database.instance.getRepository(Thought);
  }

  getSessionsRepository(): Repository<Session> {
    return Database.instance.getRepository(Session);
  }
}
