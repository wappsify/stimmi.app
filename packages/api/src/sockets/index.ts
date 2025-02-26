import type { ServerWebSocket } from "bun";
import { createBunWebSocket } from "hono/bun";

import type { Subscriptions } from "./_types";

export const socket = createBunWebSocket<ServerWebSocket>();

export const subscriptions: Subscriptions = {
  room: [],
  roomUsers: [],
  results: [],
};
