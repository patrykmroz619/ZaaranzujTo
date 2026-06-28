import { INestApplication } from "@nestjs/common";
import { getConnectionToken } from "@nestjs/mongoose";
import { type Connection, ConnectionStates } from "mongoose";

const getAppConnection = (input: { app: INestApplication }) => {
  try {
    return input.app.get<Connection>(getConnectionToken(), { strict: false });
  } catch {
    return null;
  }
};

export const clearDatabaseForApp = async (input: { app: INestApplication }) => {
  const connection = getAppConnection({ app: input.app });

  if (!connection || connection.readyState !== ConnectionStates.connected) {
    return;
  }

  const cleanupTasks = Object.values(connection.collections).map(async (collection) => {
    await collection.deleteMany({});
  });

  await Promise.all(cleanupTasks);
};
