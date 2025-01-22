import {
  createAccount,
  getAccountByGoogleId,
} from "@packages/api/src/entities/accounts";
import { createSession, generateSessionToken } from "@packages/api/src/session";
import type { OAuth2Tokens } from "arctic";
import { decodeIdToken } from "arctic";
import { cookies } from "next/headers";

import { google } from "@/lib/auth/google";
import { setSessionTokenCookie } from "@/lib/server/session";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const storedState = cookieStore.get("google_oauth_state")?.value ?? null;
  const codeVerifier = cookieStore.get("google_code_verifier")?.value ?? null;
  if (
    code === null ||
    state === null ||
    storedState === null ||
    codeVerifier === null
  ) {
    return new Response(null, {
      status: 400,
    });
  }
  if (state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await google.validateAuthorizationCode(code, codeVerifier);
  } catch {
    // Invalid code or client credentials
    return new Response(null, {
      status: 400,
    });
  }
  const claims = decodeIdToken(tokens.idToken()) as {
    sub: string;
    name: string;
  };
  const googleUserId = claims.sub;
  const username = claims.name;

  const { user: existingUser } = await getAccountByGoogleId(googleUserId);

  if (existingUser) {
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, existingUser.id);
    await setSessionTokenCookie(sessionToken, session.expires_at);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  }

  const { user } = await createAccount(googleUserId, username);

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  await setSessionTokenCookie(sessionToken, session.expires_at);
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
    },
  });
}
