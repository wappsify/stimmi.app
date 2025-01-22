import { Hono } from "hono";
import { Client } from "pg";

import { db } from "./db";
import { accountsTable } from "./db/schema";

const app = new Hono();

app.get("/", async (c) => {
  const accounts = await db.select().from(accountsTable);
  return c.json(accounts);
});

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
void client.connect();

client.on("notification", (msg) => {
  console.log("Received notification:", msg.payload);
});

void client.query("LISTEN table_changes");

export default { port: 3001, fetch: app.fetch };
