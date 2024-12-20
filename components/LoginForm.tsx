"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { FormSubmitButton } from "@/components/forms/elements/form-submit-button";
import { FormInputField } from "@/components/forms/elements/form-input-field";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const t = useTranslations("login");
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: LoginFormValues) => {
    const { email, password } = data;
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      form.setError("root", { message: error.message });
    } else {
      router.push("/rooms");
      toast.success(
        <div>
          <strong>{t("login_success")}</strong>
          <br />
          {t("login_success_message")}
        </div>
      );
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
      <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
        <FormInputField<LoginFormValues>
          name="email"
          control={form.control}
          placeholder="Email"
          label={t("email_label")}
          description={t("email_description")}
        />
        <FormInputField<LoginFormValues>
          name="password"
          control={form.control}
          type="password"
          placeholder="Password"
          label={t("password_label")}
          description={t("password_description")}
        />
        {form.formState.errors.root && (
          <p className="text-red-500 text-xs italic mb-4">
            {form.formState.errors.root.message}
          </p>
        )}
        <div className="flex items-center justify-between">
          <FormSubmitButton
            type="submit"
            className="place-self-center"
            isLoading={isLoading}
          >
            {t("login_button")}
          </FormSubmitButton>
          <Button variant="outline" asChild>
            <Link href="/register">{t("register_instead")}</Link>
          </Button>
        </div>
      </Form>
    </div>
  );
}
