import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export default async function Home() {
  const supabase = createClient(cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-9xl mb-4 animate-logoFadeIn">🗳️</div>
      <h1 className="text-5xl font-bold mb-4">Welcome to stimmi.app</h1>
      <p className="text-lg text-gray-700 mb-6">
        Your app for quick and easy ranked choice polls!
      </p>
      <div className="flex space-x-4">
        {user ? (
          <Button variant="default" size="lg" asChild>
            <Link href="/rooms">Show me my rooms</Link>
          </Button>
        ) : (
          <>
            <Button variant="default" size="lg" asChild>
              <Link href="/register">Register</Link>
            </Button>
            <Button variant="default" size="lg" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
