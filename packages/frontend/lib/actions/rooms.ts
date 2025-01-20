"use server";

import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import type { Ballot } from "votes";
import { Borda, RandomCandidates } from "votes";

import { roomCreationSchema } from "@/lib/schemas/room-creation";
import { getUserOrRedirect } from "@/lib/server/utils";
import { createClient } from "@/lib/supabase/server";

import { roomDeletionSchema } from "../schemas/room-deletion";
import { roomEditSchema } from "../schemas/room-edit";
import { roomStatusSchema } from "../schemas/room-status";
import type { Vote } from "../supabase/vote.types";

export const createRoom = async (formData: FormData) => {
  const user = await getUserOrRedirect();

  const supabase = createClient(cookies());

  const { data: values, success } = roomCreationSchema.safeParse({
    name: formData.get("name"),
  });

  if (!success) {
    throw new Error("Invalid form data");
  }

  const { data, error } = await supabase
    .from("rooms")
    .insert({
      name: values.name,
      user_id: user.id,
      description: "",
      headline: "",
      slug: "",
    })
    .select()
    .single();

  if (error) {
    throw new Error("Failed to create room");
  }

  redirect(`/rooms/${data.slug}/choices`);
};

export const updateRoom = async (formData: FormData) => {
  const { data: values, success } = roomEditSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!success) {
    throw new Error("Invalid form data");
  }

  const supabase = createClient(cookies());

  const { data, error } = await supabase
    .from("rooms")
    .update({
      name: values.name,
      description: values.description,
    })
    .eq("id", values.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating room:", error);
    throw new Error("Failed to update room");
  }

  redirect(`/rooms/${data.slug}/details`, RedirectType.replace);
};

export const deleteRoom = async (formData: FormData) => {
  const { data: values, success } = roomDeletionSchema.safeParse({
    id: formData.get("id"),
  });

  if (!success) {
    throw new Error("Invalid form data");
  }

  const supabase = createClient(cookies());

  const { error } = await supabase
    .from("rooms")
    .delete()
    .eq("id", values.id)

    .select()
    .single();

  if (error) {
    console.error("Error deleting room:", error);
    throw new Error("Failed to delete room");
  }

  redirect(`/rooms`, RedirectType.replace);
};

export const changeRoomStatus = async (formData: FormData) => {
  const { data: values, success } = roomStatusSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
  });

  if (!success) {
    throw new Error("Invalid form data");
  }

  const supabase = createClient(cookies());

  if (values.status === "results") {
    // fetch choices of room
    const { data: choices, error: choicesError } = await supabase
      .from("choices")
      .select("id")
      .eq("room_id", values.id);

    if (choicesError) {
      console.error("Error fetching choices:", choicesError);
      throw new Error("Failed to fetch choices");
    }

    // fetch votes of room
    const { data: votes, error: votesError } = await supabase
      .from("votes")
      .select()
      .eq("room_id", values.id);

    if (votesError) {
      console.error("Error fetching votes:", votesError);
      throw new Error("Failed to fetch votes");
    }

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

    const { error: resultsError } = await supabase
      .from("results")
      .insert(placements);

    if (resultsError) {
      console.error("Error inserting results:", resultsError);
      throw new Error("Failed to insert results");
    }
  }

  const { data, error } = await supabase
    .from("rooms")
    .update({
      status: values.status,
    })
    .eq("id", values.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating room status:", error);
    throw new Error("Failed to update room status");
  }

  if (values.status === "results") {
    redirect(`/v/${data.slug}/results`, RedirectType.replace);
  } else {
    redirect(`/rooms/${data.slug}`, RedirectType.replace);
  }
};
