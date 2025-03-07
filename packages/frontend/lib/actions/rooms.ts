"use server";

import { db } from "@packages/api/src/db";
import type { Vote } from "@packages/api/src/db/schema";
import {
  choicesTable,
  resultsTable,
  roomsTable,
  votesTable,
} from "@packages/api/src/db/schema";
import { getRoomByIdAndAccount } from "@packages/api/src/entities/rooms";
import { and, eq } from "drizzle-orm";
import { redirect, RedirectType } from "next/navigation";
import type { Ballot } from "votes";
import { Borda, RandomCandidates } from "votes";

import { roomCreationSchema } from "@/lib/schemas/room-creation";
import { getAccountOrRedirect } from "@/lib/server/utils";

import { roomDeletionSchema } from "../schemas/room-deletion";
import { roomEditSchema } from "../schemas/room-edit";
import { roomStatusSchema } from "../schemas/room-status";

export const createRoom = async (formData: FormData) => {
  const { account } = await getAccountOrRedirect();

  const { data: values, success } = roomCreationSchema.safeParse({
    name: formData.get("name"),
  });

  if (!success) {
    throw new Error("Invalid form data");
  }

  const [room] = await db
    .insert(roomsTable)
    .values({
      name: values.name,
      account_id: account.id,
      description: "",
      headline: "",
      slug: "",
    })
    .returning();

  console.log(room);

  redirect(`/rooms/${room.slug}/choices`);
};

export const updateRoom = async (formData: FormData) => {
  const { account } = await getAccountOrRedirect();

  const { data: values, success } = roomEditSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!success) {
    throw new Error("Invalid form data");
  }

  const room = await getRoomByIdAndAccount(values.id, account.id);

  if (!room) {
    throw new Error("Room not found");
  }

  try {
    const [updatedRoom] = await db
      .update(roomsTable)
      .set({
        name: values.name,
        description: values.description,
      })
      .where(eq(roomsTable.id, room.id))
      .returning();
    redirect(`/rooms/${updatedRoom.slug}/details`, RedirectType.replace);
  } catch (error) {
    console.error("Error updating room:", error);
    throw new Error("Failed to update room");
  }
};

export const deleteRoom = async (formData: FormData) => {
  const { account } = await getAccountOrRedirect();

  const { data: values, success } = roomDeletionSchema.safeParse({
    id: formData.get("id"),
  });

  if (!success) {
    throw new Error("Invalid form data");
  }

  try {
    await db
      .delete(roomsTable)
      .where(
        and(
          eq(roomsTable.id, values.id),
          eq(roomsTable.account_id, account.id),
        ),
      );
  } catch (error) {
    console.error("Error deleting room:", error);
    throw new Error("Failed to delete room");
  }

  redirect(`/rooms`, RedirectType.replace);
};

export const changeRoomStatus = async (formData: FormData) => {
  const { account } = await getAccountOrRedirect();

  const { data: values, success } = roomStatusSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
  });

  if (!success) {
    throw new Error("Invalid form data");
  }

  if (values.status === "results") {
    // fetch choices of room
    const choices = await db
      .select()
      .from(choicesTable)
      .where(
        and(
          eq(choicesTable.room_id, values.id),
          eq(choicesTable.account_id, account.id),
        ),
      );

    // fetch votes of room
    const votes = await db
      .select()
      .from(votesTable)
      .where(eq(votesTable.room_id, values.id));

    const votesByUsers = votes.reduce<Record<string, Vote[]>>((acc, vote) => {
      if (!acc[vote.user_id]) {
        acc[vote.user_id] = [];
      }
      acc[vote.user_id].push(vote);
      return acc;
    }, {});

    const ballots: Ballot[] = Object.values(votesByUsers).map((userVotes) => ({
      ranking: [...userVotes]
        .sort((a, b) => a.rank - b.rank)
        .map((v) => [v.choice_id]),
      weight: 1,
    }));

    const candidates = choices.map((choice) => choice.id);

    const borda = new Borda({ candidates, ballots });

    const scores = borda.scores();
    const ranking = borda.ranking();
    const placements = Object.entries(scores).map(([choice_id, score]) => ({
      choice_id,
      points: score,
      room_id: values.id,
    }));

    if (ranking[0].length > 1) {
      const randomTieBreaker = new RandomCandidates({ candidates: ranking[0] });
      const [tiebreakWinner] = randomTieBreaker.ranking();
      const tiebreakWinningIndex = placements.findIndex(
        (p) => p.choice_id === tiebreakWinner[0],
      );
      const tiebreak = placements[tiebreakWinningIndex];
      tiebreak.points += 1;
    }

    try {
      await db.insert(resultsTable).values(placements);
    } catch (error) {
      console.error("Error inserting results:", error);
      throw new Error("Failed to insert results");
    }
  }

  try {
    const [room] = await db
      .update(roomsTable)
      .set({ status: values.status })
      .where(
        and(
          eq(roomsTable.id, values.id),
          eq(roomsTable.account_id, account.id),
        ),
      )
      .returning();

    if (values.status === "results") {
      redirect(`/v/${room.slug}/results`, RedirectType.replace);
    } else {
      redirect(`/rooms/${room.slug}`, RedirectType.replace);
    }
  } catch (error) {
    console.error("Error updating room status:", error);
    throw new Error("Failed to update room status");
  }
};
