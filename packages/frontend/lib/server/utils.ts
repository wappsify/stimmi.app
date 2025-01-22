"use server";
import type { Account, User } from "@packages/api/src/db/schema";
import { getAccountById } from "@packages/api/src/entities/accounts";
import {
  type SessionValidationResult,
  validateSessionToken,
} from "@packages/api/src/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

export async function redirectIfAuthenticated() {
  const { user } = await getCurrentSession();

  if (user) {
    redirect("/rooms");
  }
}

export async function getUserOrRedirect(): Promise<User> {
  const { user } = await getCurrentSession();
  if (!user) {
    return redirect("/login");
  }
  return user;
}

export async function getAccountOrRedirect(): Promise<{
  user: User;
  account: Account;
}> {
  const user = await getUserOrRedirect();

  if (!user.account_id) {
    return redirect("/login");
  }

  const account = await getAccountById(user.account_id);

  if (!account) {
    return redirect("/login");
  }
  return { user, account };
}

export const getCurrentSession = cache(
  async (): Promise<SessionValidationResult> => {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value ?? null;
    if (token === null) {
      return { session: null, user: null };
    }
    const result = await validateSessionToken(token);
    return result;
  }
);

export async function setSessionTokenCookie(
  token: string,
  expiresAt: Date
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export async function deleteSessionTokenCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}
