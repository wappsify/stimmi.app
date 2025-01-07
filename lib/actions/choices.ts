"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { choicesEditSchema } from "../schemas/choices-edit";
import { getUserOrRedirect } from "../server/utils";
import { createClient } from "../supabase/server";
import { formDataToObject } from "../utils";

export const updateChoices = async (formData: FormData) => {
  const transformedFormData = formDataToObject(formData);
  const { data: values, success } = choicesEditSchema.safeParse({
    roomId: transformedFormData.roomId,
    choices: transformedFormData.choices,
  });

  if (!success) {
    throw new Error("Invalid form data");
  }

  const supabase = createClient(cookies());

  const { error } = await supabase
    .from("choices")
    .delete()
    .eq("room_id", values.roomId)
    .select();

  if (error) {
    console.error("Error removing old choices:", error);
    throw new Error("Failed to remove old choices");
  }

  const user = await getUserOrRedirect();

  const newChoices = values.choices.map((choice) => ({
    room_id: values.roomId,
    user_id: user.id,
    name: choice.name,
    description: "",
  }));

  await supabase.from("choices").insert(newChoices).select();
  revalidatePath("/rooms/[slug]", "page");
};
