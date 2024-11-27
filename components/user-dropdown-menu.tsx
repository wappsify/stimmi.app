"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";

const UserDropdownMenu: React.FC = () => {
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    location.reload();
  };

  return (
    <>
      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link href="/rooms">Rooms</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/account">Account</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="hidden sm:flex gap-2">
        <Button variant="link" asChild>
          <Link href="/rooms">Rooms</Link>
        </Button>
        <Button variant="link" asChild>
          <Link href="/account">Account</Link>
        </Button>

        <Button variant="ghost" onClick={handleSignOut}>
          <LogOut /> Logout
        </Button>
      </div>
    </>
  );
};

export { UserDropdownMenu };
