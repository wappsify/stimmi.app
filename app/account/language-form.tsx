"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useUser } from "../../lib/hooks/useUser";
import { createClient } from "../../lib/supabase/client";

export const LanguageForm: React.FC<{ initialValue: string }> = ({
  initialValue,
}) => {
  const [locale, setLocale] = useState(initialValue);
  const supabase = createClient();
  const user = useUser();
  const t = useTranslations("account");

  const handleLocaleChange = async (newLocale: string) => {
    if (user) {
      setLocale(newLocale);

      const { error } = await supabase.auth.updateUser({
        data: { locale: newLocale },
      });

      if (error) {
        console.error("Error updating locale:", error);
      }
      location.reload();
    }
  };

  return (
    <div className=" max-w-md mx-auto">
      <label htmlFor="locale" className="block text-xl mb-2">
        {t("select_locale")}
      </label>
      <Select
        value={locale}
        onValueChange={(value) => void handleLocaleChange(value)}
        name="locale"
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t("select_locale")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en-US">{t("english")}</SelectItem>
          <SelectItem value="de-DE">{t("german")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
