import { getTranslations } from "next-intl/server";

import { LoginForm } from "@/components/LoginForm";
import { TwoColumnLayout } from "@/components/TwoColumnLayout";
import { redirectIfAuthenticated } from "@/lib/server/utils";

export default async function LoginPage() {
  await redirectIfAuthenticated();
  const t = await getTranslations("login");

  return (
    <TwoColumnLayout
      imageSrc="/placeholder.svg"
      imageAlt={t("login_image_alt")}
    >
      <LoginForm />
    </TwoColumnLayout>
  );
}
