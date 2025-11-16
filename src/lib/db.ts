import { DataSource } from "typeorm";
import "reflect-metadata";

let dataSource: DataSource | null = null;

export async function getDbConnection() {
  if (!dataSource) {
    dataSource = new DataSource({
      type: "postgres",
      url: process.env.DATABASE_URL,
      entities: [__dirname + "/../entities/*.ts"], // Or explicit imports: [User, Post]
      synchronize: false, // Never true in prod—use migrations!
      logging: process.env.NODE_ENV === "development",
    });
  }

  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  return dataSource;
}
