"use client";
import { FormEventHandler, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client"; // Ensure you have a Supabase client setup
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { FormSubmitButton } from "@/components/forms/submit-button";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const supabase = createClient();

  const handleRegister: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      router.push("/rooms");
    }
    setIsLoading(false);
  };

  return (
    <form
      className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
      onSubmit={handleRegister}
    >
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="email"
        >
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
        />
      </div>
      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="password"
        >
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
      </div>
      {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
      <div className="flex items-center justify-between">
        <FormSubmitButton
          variant="default"
          size="lg"
          type="submit"
          isLoading={isLoading}
        >
          Register
        </FormSubmitButton>
        <Button variant="link" size="sm" asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </form>
  );
}
