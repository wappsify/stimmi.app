"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { getUserOrRedirect } from "@/lib/server/utils";
import { roomCreationSchema } from "@/lib/schemas/room-creation";
import { roomEditSchema } from "../schemas/room-edit";

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

  redirect(`/rooms/${data.slug}`);
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

  redirect(`/rooms/${data.slug}`, RedirectType.replace);
};
