import { getRequestConfig } from "next-intl/server";

import { getCurrentSession } from "@/lib/server/utils";

import type { Messages } from "../global";
import { getLocale } from "./getLocale";

export default getRequestConfig(async () => {
  const { user } = await getCurrentSession();
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
