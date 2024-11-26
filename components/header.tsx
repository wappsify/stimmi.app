import { Button } from "@/components/ui/button";
import { UserDropdownMenu } from "@/components/user-dropdown-menu";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

const Header: React.FC = async () => {
  const supabase = createClient(cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="p-4 bg-gray-200 border-b-primary border-b">
      <div className="container mx-auto flex justify-between items-center">
        <div className="logo text-xl font-bold">stimmi</div>
        <div className="user-menu flex items-center gap-4">
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
