import { getRequestConfig } from "next-intl/server";
import { createClient } from "../lib/supabase/server";
import { cookies, headers } from "next/headers";
import { resolveAcceptLanguage } from "resolve-accept-language";

const FALLBACK_LOCALE = "de-DE";
const AVAILABLE_LOCALES = ["en-US", "de-DE"];

export default getRequestConfig(async () => {
  const supabase = createClient(cookies());
  const user = await supabase.auth.getUser();
  const acceptLanguageHeader = headers().get("Accept-Language");
  console.log("acl", acceptLanguageHeader);

  const locale =
    user?.data.user?.user_metadata.locale ??
    (acceptLanguageHeader
      ? resolveAcceptLanguage(
          acceptLanguageHeader,
          AVAILABLE_LOCALES,
          FALLBACK_LOCALE
        )
      : FALLBACK_LOCALE);

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
