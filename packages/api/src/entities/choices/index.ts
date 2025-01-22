import { eq } from "drizzle-orm";

import { db } from "../../db";
import { choicesTable } from "../../db/schema";

export const getChoicesByRoomId = async (roomId: string) => {
  const choices = await db
    .select()
    .from(choicesTable)
    .where(eq(choicesTable.room_id, roomId));
  return choices;
};
