import { LoginForm } from "@/components/LoginForm";
import { TwoColumnLayout } from "@/components/TwoColumnLayout";
import { redirectIfAuthenticated } from "@/lib/server/utils";

export default async function LoginPage() {
  await redirectIfAuthenticated();

  return (
    <TwoColumnLayout imageSrc="/placeholder.svg" imageAlt="Login Image">
      <LoginForm />
    </TwoColumnLayout>
  );
}
