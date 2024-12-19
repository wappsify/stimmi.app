import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

async function RoomSubpageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = await getTranslations("room_edit");

  return (
    <div className="grid gap-4">
      <Button
        variant="outline"
        size="sm"
        asChild
        className="sm:place-self-start"
      >
        <Link href="./">
          <ArrowLeft />
          {t("back_to_room_overview")}
        </Link>
      </Button>
      {children}
    </div>
  );
}

export default RoomSubpageLayout;
