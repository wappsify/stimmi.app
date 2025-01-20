import { getTranslations } from "next-intl/server";

import { RegisterForm } from "@/components/register-form";
import { TwoColumnLayout } from "@/components/two-column-layout";
import { redirectIfAuthenticated } from "@/lib/server/utils";

export default async function RegisterPage() {
  await redirectIfAuthenticated();
  const t = await getTranslations("register");

  return (
    <TwoColumnLayout
      imageSrc="/placeholder.svg"
      imageAlt={t("register_image_alt")}
    >
      <RegisterForm />
    </TwoColumnLayout>
  );
}
