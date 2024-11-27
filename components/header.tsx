import { Button } from "@/components/ui/button";
import { UserDropdownMenu } from "@/components/user-dropdown-menu";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";

const Header: React.FC = async () => {
  const supabase = createClient(cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="py-2 bg-gray-200 border-b-primary border-b mb-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded p-2"
        >
          <div className="text-3xl mr-2">🗳️</div>
          <div className="logo text-xl font-semibold text-primary">
            stimmi.app
          </div>
        </Link>
        <div className="user-menu flex items-center gap-4 pr-2">
          {user ? (
            <UserDropdownMenu />
          ) : (
            <>
              <Button variant="link">Login</Button>
              <Button variant="link">Register</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export { Header };
