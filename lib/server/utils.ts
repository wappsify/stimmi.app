"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function redirectIfAuthenticated() {
  const supabase = createClient(cookies());
  const { data } = await supabase.auth.getUser();
  if (data.user) {
    redirect("/rooms");
  }
}
