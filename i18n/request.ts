import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { createClient } from "../lib/supabase/server";
import { getLocale } from "./getLocale";
import { Messages } from "../global";

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
