import type { Notification } from "pg";

import type { Result, Room, RoomUser } from "../db/schema";
import { getResultsByRoomId } from "../entities/results";
import { getRoomUsersByRoomId } from "../entities/roomUsers";
import { subscriptions } from ".";
import type {
  ParsedPayload,
  PayloadHandler,
  PayloadHandlerMap,
} from "./_types";

const handleRoomEvent: PayloadHandler<Room> = (data) => {
  subscriptions.room.forEach((sub) => {
    if (sub.roomId === data.id) {
      sub.ws.send(JSON.stringify(data));
    }
  });
};

const handleRoomUserEvent: PayloadHandler<RoomUser> = async (data) => {
  const roomUsers = await getRoomUsersByRoomId(data.room_id);

  subscriptions.roomUsers.forEach((sub) => {
    if (sub.roomId === data.room_id) {
      sub.ws.send(JSON.stringify(roomUsers));
    }
  });
};

const handleResultEvent: PayloadHandler<Result> = async (data) => {
  const results = await getResultsByRoomId(data.room_id);

  subscriptions.results.forEach((sub) => {
    if (sub.roomId === data.room_id) {
      sub.ws.send(JSON.stringify(results));
    }
  });
};

const handlerMap: PayloadHandlerMap = {
  rooms: handleRoomEvent,
  room_users: handleRoomUserEvent,
  results: handleResultEvent,
};

export const handleTableEvents = (message: Notification) => {
  const payload = JSON.parse(message.payload ?? "") as ParsedPayload;

  const handler = handlerMap[payload.table] as PayloadHandler<
    typeof payload.data
  >;

  void handler(payload.data);
};
