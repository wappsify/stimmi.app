import { Hono } from "hono";

import { db } from "./db";
import { accountsTable } from "./db/schema";

const app = new Hono();

app.get("/", async (c) => {
  const accounts = await db.select().from(accountsTable);
  return c.json(accounts);
});

export default { port: 3001, fetch: app.fetch };
