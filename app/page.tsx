import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { UserDropdownMenu } from "@/components/user-dropdown-menu";
import { SquareArrowRight } from "lucide-react";

export default async function Home() {
  const supabase = createClient(cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="bg-gray-100 container mx-auto">
      {user && (
        <div className="flex justify-end h-[52px] items-center mt-2 px-2">
          <UserDropdownMenu />
        </div>
      )}
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="text-9xl mb-4 animate-logoFadeIn">🗳️</div>
        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-center">
          Welcome to{" "}
          <span className="relative inline-block after:animate-underlineExpand after:absolute after:w-full after:h-1 after:bottom-0 after:left-0 after:bg-primary after:scale-x-0 after:origin-bottom-left">
            stimmi.app
          </span>
        </h1>
        <p className="text-lg text-gray-700 text-center mb-6">
          Your app for quick and easy ranked choice polls!
        </p>
        <div className="flex space-x-4">
          {user ? (
            <Button variant="default" size="lg" asChild>
              <Link href="/rooms">
                <SquareArrowRight /> Show me my rooms
              </Link>
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
    </main>
  );
}
