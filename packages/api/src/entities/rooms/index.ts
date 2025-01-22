import { and, desc, eq, inArray } from "drizzle-orm";

import { db } from "../../db";
import { roomsTable } from "../../db/schema";

export const getRoomsByAccountId = async (accountId: string) => {
  const rooms = await db
    .select()
    .from(roomsTable)
    .where(eq(roomsTable.account_id, accountId))
    .orderBy(desc(roomsTable.created_at));
  return rooms;
};

export const getPublicRoomBySlug = async (slug: string) => {
  const [room] = await db
    .select()
    .from(roomsTable)
    .where(
      and(
        eq(roomsTable.slug, slug),
        inArray(roomsTable.status, ["open", "results"])
      )
    );
  return room;
};

export const getRoomBySlugAndAccount = async (
  slug: string,
  accountId: string
) => {
  const [room] = await db
    .select()
    .from(roomsTable)
    .where(
      and(eq(roomsTable.slug, slug), eq(roomsTable.account_id, accountId))
    );
  return room;
};
