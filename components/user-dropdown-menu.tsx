"use client";
import { LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";

const UserDropdownMenu: React.FC = () => {
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    location.reload();
  };

  const t = useTranslations("header");

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
              <Link href="/rooms">{t("rooms")}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/account">{t("account")}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => void handleSignOut()}>
              <LogOut />
              {t("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="hidden sm:flex gap-2">
        <Button variant="link" asChild>
          <Link href="/rooms">{t("rooms")}</Link>
        </Button>
        <Button variant="link" asChild>
          <Link href="/account">{t("account")}</Link>
        </Button>

        <Button variant="ghost" onClick={() => void handleSignOut()}>
          <LogOut /> {t("logout")}
        </Button>
      </div>
    </>
  );
};

export { UserDropdownMenu };
