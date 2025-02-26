import { getCookie } from "hono/cookie";

import { getRoomUsersByRoomId } from "../entities/roomUsers";
import { socket, subscriptions } from ".";

export const resultsSocket = socket.upgradeWebSocket(async (c) => {
  const id = c.req.param("id");
  const session = getCookie(c, "session") ?? "";

  const roomUsers = await getRoomUsersByRoomId(id);
  const isRoomMember = roomUsers.some((user) => user.id === session);

  if (!isRoomMember) {
    return {
      onOpen: (_, ws) => {
        ws.send("Unauthorized");
        ws.close();
      },
    };
  }

  return {
    onOpen: (_, ws) => {
      subscriptions.results.push({ roomId: id, ws, session });
    },
    onClose: () => {
      const subIndex = subscriptions.results.findIndex(
        (sub) => sub.roomId !== id && sub.session !== session,
      );

      if (subIndex === -1) return;
      subscriptions.results.splice(subIndex, 1);
    },
  };
});
