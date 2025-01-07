import { getTranslations } from "next-intl/server";

import { RegisterForm } from "@/components/RegisterForm";
import { TwoColumnLayout } from "@/components/TwoColumnLayout";
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
