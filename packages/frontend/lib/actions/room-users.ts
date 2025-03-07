import { db } from "@packages/api/src/db";
import { choicesTable, roomUsersTable } from "@packages/api/src/db/schema";
import { eq } from "drizzle-orm";

import { getUserOrRedirect } from "../server/utils";
import { shuffleArray } from "../utils/shuffleArray";

export const addSessionUserToRoom = async (roomId: string) => {
  const { id } = await getUserOrRedirect();
  await db.insert(roomUsersTable).values({
    room_id: roomId,
    user_id: id,
    has_voted: false,
  });

  const choices = await db
    .select()
    .from(choicesTable)
    .where(eq(choicesTable.room_id, roomId));

  return shuffleArray(choices, id);
};
