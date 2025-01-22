import { type User } from "@packages/api/src/db/schema";
import { getAccountById } from "@packages/api/src/entities/accounts";
import { headers } from "next/headers";
import { resolveAcceptLanguage } from "resolve-accept-language";

export const FALLBACK_LOCALE = "de-DE";
export const AVAILABLE_LOCALES = ["en-US", "de-DE"];

export const getLocale = async (user: User | null) => {
  const acceptLanguageHeader = (await headers()).get("Accept-Language");

  if (user?.account_id) {
    const account = await getAccountById(user.account_id);

    if (account?.locale) {
      return account.locale;
    }
  }

  const locale = acceptLanguageHeader
    ? resolveAcceptLanguage(
        acceptLanguageHeader,
        AVAILABLE_LOCALES,
        FALLBACK_LOCALE
      )
    : FALLBACK_LOCALE;

  return locale;
};
