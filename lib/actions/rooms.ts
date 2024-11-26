"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserOrRedirect } from "@/lib/server/utils";

export const createRoom = async (formData: FormData) => {
  const user = await getUserOrRedirect();

  const supabase = createClient(cookies());

  const roomName = formData.get("name") as string;

  const { data, error } = await supabase
    .from("rooms")
    .insert({
      name: roomName,
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
  const supabase = createClient(cookies());

  const roomId = formData.get("id") as string;
  const roomName = formData.get("name") as string;
  const roomDescription = formData.get("description") as string;

  const { data, error } = await supabase
    .from("rooms")
    .update({
      name: roomName,
      description: roomDescription,
    })
    .eq("id", roomId)
    .select()
    .single();

  if (error) {
    console.error("Error updating room:", error);
    throw new Error("Failed to update room");
  }

  redirect(`/rooms/${data.slug}`);
};
