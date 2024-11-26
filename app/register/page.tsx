import { RegisterForm } from "@/components/RegisterForm";
import { TwoColumnLayout } from "@/components/TwoColumnLayout";
import { redirectIfAuthenticated } from "@/lib/server/utils";

export default async function RegisterPage() {
  await redirectIfAuthenticated();

  return (
    <TwoColumnLayout imageSrc="/placeholder.svg" imageAlt="Register Image">
      <RegisterForm />
    </TwoColumnLayout>
  );
}
