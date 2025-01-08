import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";

import ChoiceEditForm from "@/components/choices-edit-form";
import { createClient } from "@/lib/supabase/server";

const RoomEditPage: React.FC<{
  params: Promise<{ slug: string }>;
}> = async ({ params }) => {
  const supabase = createClient(cookies());
  const { slug } = await params;
  const t = await getTranslations("choices_edit");

  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("*")
    .eq("slug", slug)
    .single();

  if (roomError) {
    console.error("Error fetching room:", roomError);
    return <div>{t("error_loading")}</div>;
  }

  const { data: choices, error: choicesError } = await supabase
    .from("choices")
    .select("*")
    .eq("room_id", room.id);

  if (choicesError) {
    console.error("Error fetching data:", choicesError);
    return <div>{t("error_loading")}</div>;
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl text-center mb-6 font-bold">
        {t("edit_room_choices")}
      </h1>
      <p className="prose mb-6">{t("edit_room_choices_description")}</p>
      <ChoiceEditForm room={room} choices={choices} />
    </div>
  );
};

export default RoomEditPage;
