import { Client } from "pg";

import { handleTableEvents } from "../sockets/handleTableEvents";

export const setupChangesListener = () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  void client.connect();

  client.on("notification", handleTableEvents);

  void client.query("LISTEN table_changes");

  return client;
};

export const destroyChangesListener = async (client: Client) => {
  return client.end();
};
