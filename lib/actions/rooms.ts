"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { getUserOrRedirect } from "@/lib/server/utils";
import { roomCreationSchema } from "@/lib/schemas/room-creation";
import { roomEditSchema } from "../schemas/room-edit";
import { roomDeletionSchema } from "../schemas/room-deletion";
import { roomStatusSchema } from "../schemas/room-status";
import { Vote } from "../../vote.types";
import { Ballot, Borda, Baldwin } from "votes";

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

    const votesByUsers = votes.reduce<{ [key: string]: Vote[] }>(
      (acc, vote) => {
        if (!acc[vote.user_id]) {
          acc[vote.user_id] = [];
        }
        acc[vote.user_id].push(vote);
        return acc;
      },
      {}
    );

    const ballots: Ballot[] = Object.values(votesByUsers).map((userVotes) => ({
      ranking: [...userVotes]
        .sort((a, b) => a.rank - b.rank)
        .map((v) => [v.choice_id]),
      weight: 1,
    }));

    const candidates = choices.map((choice) => choice.id);

    const borda = new Borda({ candidates, ballots });

    console.log(borda.scores());
    console.log(borda.ranking());
    console.log(borda.matrix);

    return;
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

  redirect(`/rooms/${data.slug}`, RedirectType.replace);
};
