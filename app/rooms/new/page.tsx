import RoomCreationForm from "@/components/RoomCreationForm";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Create a new room | stimmi.app",
};

const NewRoomPage: React.FC = async () => {
  const t = await getTranslations("new_room");

  return (
    <section className="max-w-md mx-auto grid gap-4">
      <h1 className="text-3xl font-bold text-center">{t("title")}</h1>
      <h2 className="text-2xl font-semibold">{t("subtitle")}</h2>
      <RoomCreationForm />
    </section>
  );
};

export default NewRoomPage;
