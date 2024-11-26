"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const createRoom = async (formData: FormData) => {
  const supabase = createClient(cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const roomName = formData.get("roomName") as string;

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
