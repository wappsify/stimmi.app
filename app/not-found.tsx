import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Frown } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("not_found");
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <Frown size={64} className="mb-4" />
      <h2 className="text-4xl font-bold text-gray-800 mb-4">{t("title")}</h2>
      <p className="text-lg text-gray-600 mb-8">{t("message")}</p>
      <Button variant="default" asChild>
        <Link href="/" passHref>
          {t("return_home")}
        </Link>
      </Button>
    </div>
  );
}
