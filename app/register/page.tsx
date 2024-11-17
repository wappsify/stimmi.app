"use client";
import { RegisterForm } from "@/components/RegisterForm";
import { TwoColumnLayout } from "@/components/TwoColumnLayout";

export default function RegisterPage() {
  return (
    <TwoColumnLayout imageSrc="/placeholder.svg" imageAlt="Register Image">
      <RegisterForm />
    </TwoColumnLayout>
  );
}
