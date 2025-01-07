import { createServerClient } from "@supabase/ssr";
import type { cookies } from "next/headers";

import type { Database } from "./database.types";

export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          const cookies = await cookieStore;
          const allCookies = cookies.getAll();
          return allCookies;
        },
        async setAll(cookiesToSet) {
          const cookies = await cookieStore;
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookies.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
};
