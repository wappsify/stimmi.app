import { User } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { resolveAcceptLanguage } from "resolve-accept-language";

export const FALLBACK_LOCALE = "de-DE";
export const AVAILABLE_LOCALES = ["en-US", "de-DE"];

export const getLocale = async (user: User | null) => {
  const acceptLanguageHeader = (await headers()).get("Accept-Language");

  const desiredLocale = user?.user_metadata?.locale;
  const locale = acceptLanguageHeader
    ? resolveAcceptLanguage(
        desiredLocale ?? acceptLanguageHeader,
        AVAILABLE_LOCALES,
        FALLBACK_LOCALE,
      )
    : FALLBACK_LOCALE;

  return locale;
};
