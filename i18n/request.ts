import { getRequestConfig } from "next-intl/server";
import { getUserOrRedirect } from "../lib/server/utils";
import { getLocale } from "./getLocale";

export default getRequestConfig(async () => {
  const user = await getUserOrRedirect();

  const locale = await getLocale(user);

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
