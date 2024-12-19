import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { createClient } from "../lib/supabase/server";
import { getLocale } from "./getLocale";

export default getRequestConfig(async () => {
  const supabase = createClient(cookies());
  const { data } = await supabase.auth.getUser();
  const user = data.user ?? null;
  const locale = await getLocale(user);

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
