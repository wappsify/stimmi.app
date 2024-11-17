"use client";
import { LoginForm } from "@/components/LoginForm";
import { TwoColumnLayout } from "@/components/TwoColumnLayout";

export default function LoginPage() {
  return (
    <TwoColumnLayout imageSrc="/placeholder.svg" imageAlt="Login Image">
      <LoginForm />
    </TwoColumnLayout>
  );
}
