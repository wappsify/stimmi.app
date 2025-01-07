"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { type User } from "@supabase/supabase-js";

export async function redirectIfAuthenticated() {
  const supabase = createClient(cookies());
  const { data } = await supabase.auth.getUser();
  if (data.user) {
    redirect("/rooms");
  }
}

export async function getUserOrRedirect() {
  const supabase = createClient(cookies());
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return redirect("/login");
  }
  return data.user as User;
}
