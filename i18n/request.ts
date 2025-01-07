import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import { createClient } from "@/lib/supabase/server";

import type { Messages } from "../global";
import { getLocale } from "./getLocale";

export default getRequestConfig(async () => {
  const supabase = createClient(cookies());
  const { data } = await supabase.auth.getUser();
  const user = data.user ?? null;
  const locale = await getLocale(user);

  const messages = (
    (await import(`../messages/${locale}.json`)) as {
      default: Messages;
    }
  ).default;

  return {
    locale,
    messages,
  };
});
