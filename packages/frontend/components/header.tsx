import { cookies } from "next/headers";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { UserDropdownMenu } from "@/components/user-dropdown-menu";
import { createClient } from "@/lib/supabase/server";

type HeaderProps = {
  hideNavigation?: boolean;
};

const Header: React.FC<HeaderProps> = async ({ hideNavigation }) => {
  const supabase = createClient(cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const t = await getTranslations();

  return (
    <header className="py-2 bg-gray-200 border-b-primary border-b-2 mb-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded p-2"
        >
          <div className="text-3xl mr-2">🗳️</div>
          <div className="logo text-xl font-semibold text-primary">
            {t("header.name")}
          </div>
        </Link>
        {!hideNavigation && (
          <div className="user-menu flex items-center gap-4 pr-2">
            {user && !user.is_anonymous ? (
              <UserDropdownMenu />
            ) : (
              <>
                <Button variant="link">{t("home.login")}</Button>
                <Button variant="link">{t("home.register")}</Button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export { Header };
