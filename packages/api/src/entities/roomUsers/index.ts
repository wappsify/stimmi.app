import { and, eq, inArray } from "drizzle-orm";

import { db } from "../../db";
import { roomsTable, roomUsersTable } from "../../db/schema";

export const getRoomUsersByRoomId = async (roomId: string) => {
  const roomUsers = await db
    .select({ id: roomUsersTable.user_id, hasVoted: roomUsersTable.has_voted })
    .from(roomUsersTable)
    .leftJoin(roomsTable, eq(roomsTable.id, roomUsersTable.room_id))
    .where(
      and(
        eq(roomUsersTable.room_id, roomId),
        inArray(roomsTable.status, ["open", "results"]),
      ),
    );

  return roomUsers;
};
