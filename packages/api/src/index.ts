import { Hono } from "hono";

import { setupChangesListener } from "./db/listener";
import { socket } from "./sockets";
import { resultsSocket } from "./sockets/results";
import { roomSocket } from "./sockets/room";
import { roomUsersSocket } from "./sockets/roomUsers";

const app = new Hono();

app.get("/room/:id", roomSocket);
app.get("/room-users/:id", roomUsersSocket);
app.get("/results/:id", resultsSocket);

setupChangesListener();

export default {
  port: 3001,
  fetch: app.fetch,
  websocket: socket.websocket,
};
