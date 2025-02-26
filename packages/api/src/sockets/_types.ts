import type { ServerWebSocket } from "bun";
import type { WSContext } from "hono/ws";

import type { Result, Room, RoomUser } from "../db/schema";

export type Subscriptions = {
  room: Subscription[];
  roomUsers: Subscription[];
  results: Subscription[];
};

export type Subscription = {
  roomId: string;
  ws: WSContext<ServerWebSocket<undefined>>;
  session: string;
};

export type ParsedRoomPayload = {
  table: "rooms";
  operation: string;
  data: Room;
};

export type ParsedRoomUserPayload = {
  table: "room_users";
  operation: string;
  data: RoomUser;
};

export type ParsedResultPayload = {
  table: "results";
  operation: string;
  data: Result;
};

export type PayloadHandler<T extends object = object> = (
  data: T,
) => void | Promise<void>;

export type ParsedPayload =
  | ParsedRoomPayload
  | ParsedRoomUserPayload
  | ParsedResultPayload;

export type PayloadHandlerMap = {
  rooms: PayloadHandler<ParsedRoomPayload["data"]>;
  room_users: PayloadHandler<ParsedRoomUserPayload["data"]>;
  results: PayloadHandler<ParsedResultPayload["data"]>;
};
