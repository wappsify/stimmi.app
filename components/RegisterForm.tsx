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

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const supabase = createClient();

  const onSubmit = async (data: RegisterFormValues) => {
    const { email, password } = data;
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      form.setError("root", { message: error.message });
    } else {
      router.push("/rooms");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
      <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
        <FormInputField<RegisterFormValues>
          name="email"
          control={form.control}
          placeholder="Email"
          label="Email"
          description="Enter your email address."
        />
        <FormInputField<RegisterFormValues>
          name="password"
          control={form.control}
          type="password"
          placeholder="Password"
          label="Password"
          description="Enter a password with at least 8 characters."
        />
        {form.formState.errors.root && (
          <p className="text-red-500 text-xs italic mb-4">
            {form.formState.errors.root.message}
          </p>
        )}
        <div className="flex items-center justify-between">
          <FormSubmitButton type="submit" className="place-self-center">
            Register
          </FormSubmitButton>
          <Button variant="outline" asChild>
            <Link href="/login">Login instead</Link>
          </Button>
        </div>
      </Form>
    </div>
  );
}
