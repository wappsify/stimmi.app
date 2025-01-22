import { getTranslations } from "next-intl/server";

import { LanguageForm } from "@/components/language-form";
import { getLocale } from "@/i18n/getLocale";
import { getUserOrRedirect } from "@/lib/server/utils";

const AccountPage: React.FC = async () => {
  const t = await getTranslations("account");
  const user = await getUserOrRedirect();

  const initialLocale = await getLocale(user);

  return (
    <>
      <h1 className="text-3xl text-center font-bold mb-6">
        {t("account_settings")}
      </h1>

      <LanguageForm initialValue={initialLocale} user={user} />
    </>
  );
};

export default AccountPage;
