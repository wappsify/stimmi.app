import { eq } from "drizzle-orm";

import { db } from "../../db";
import { resultsTable } from "../../db/schema";

export const getResultsByRoomId = async (roomId: string) => {
  const results = await db
    .select()
    .from(resultsTable)
    .where(eq(resultsTable.room_id, roomId));

  return results;
};
