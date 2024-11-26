"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserOrRedirect } from "@/lib/server/utils";

export const createRoom = async (formData: FormData) => {
  const user = await getUserOrRedirect();

  const supabase = createClient(cookies());

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
