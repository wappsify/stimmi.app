"use server";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { votingSchema } from "../schemas/submit-votes";
import { getUserOrRedirect } from "../server/utils";
import { createClient } from "../supabase/server";
import { formDataToObject } from "../utils";

export const submitVotes = async (formData: FormData) => {
  const transformedFormData = formDataToObject(formData);
  const {
    data: values,
    success,
    error,
  } = votingSchema.safeParse({
    roomId: transformedFormData.roomId,
    choices: (
      transformedFormData.choices as { id: string; rank: string }[]
    ).map((choice) => ({
      id: choice.id,
      rank: parseInt(choice.rank, 10),
    })),
  });

  if (!success) {
    console.error("Invalid form data:", error);
    throw new Error("Invalid form data");
  }

  const supabase = createClient(cookies());

  const user = await getUserOrRedirect();

  const { error: submitError } = await supabase.from("votes").insert(
    values.choices.map((choice, index) => ({
      rank: index + 1,
      room_id: values.roomId,
      choice_id: choice.id,
      user_id: user.id,
    }))
  );

  if (submitError) {
    console.error("Error submitting votes:", submitError);
    throw new Error("Failed to submit votes");
  }

  const { error: updateError } = await supabase
    .from("room_users")
    .update({ has_voted: true })
    .eq("room_id", values.roomId)
    .eq("user_id", user.id);

  if (updateError) {
    console.error("Error updating room_users:", updateError);
    throw new Error("Failed to update room_users");
  }

  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", values.roomId)
    .single();

  if (roomError) {
    console.error("Error fetching room:", roomError);
    throw new Error("Failed to fetch room");
  }

  redirect(`/v/${room.slug}/results`, RedirectType.replace);
};
