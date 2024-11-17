"use client";
import { FormEventHandler, useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client"; // Ensure you have a Supabase client setup
import Link from "next/link";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const supabase = createClient();
  const router = useRouter();

  const handleLogin: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      router.push("/rooms");
    }
  };

  return (
    <form
      className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
      onSubmit={handleLogin}
    >
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="email"
        >
          Email
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>
      {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
      <div className="flex items-center justify-between">
        <Button variant="default" size="lg" type="submit">
          Login
        </Button>
        <Button variant="link" size="sm" asChild>
          <Link href="/register">Register</Link>
        </Button>
      </div>
    </form>
  );
}
