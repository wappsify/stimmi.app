import { getTranslations } from "next-intl/server";
import { getLocale } from "../../i18n/getLocale";
import { getUserOrRedirect } from "../../lib/server/utils";
import { LanguageForm } from "./language-form";

const AccountPage: React.FC = async () => {
  const t = await getTranslations("account");
  const user = await getUserOrRedirect();

  const initialLocale = user.user_metadata.locale ?? getLocale(user);

  return (
    <>
      <h1 className="text-3xl text-center font-bold mb-6">
        {t("account_settings")}
      </h1>
      <LanguageForm initialValue={initialLocale} />
    </>
  );
};

export default AccountPage;
