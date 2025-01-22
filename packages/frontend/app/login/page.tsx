import { getTranslations } from "next-intl/server";

import { TwoColumnLayout } from "@/components/two-column-layout";
import { redirectIfAuthenticated } from "@/lib/server/utils";

export default async function LoginPage() {
  await redirectIfAuthenticated();
  const t = await getTranslations("login");

  return (
    <TwoColumnLayout
      imageSrc="/placeholder.svg"
      imageAlt={t("login_image_alt")}
    >
      <a href="/login/google">Sign in with Google</a>
    </TwoColumnLayout>
  );
}
