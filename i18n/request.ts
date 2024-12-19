import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  // TODO: fetch locale from user / browser settings
  const locale = "en";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
