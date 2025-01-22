import { getChoicesByRoomId } from "@packages/api/src/entities/choices";
import { getRoomBySlug } from "@packages/api/src/entities/rooms";
import { getTranslations } from "next-intl/server";

import { ChoicesEditForm } from "@/components/choices-edit-form";

const RoomEditPage: React.FC<{
  params: Promise<{ slug: string }>;
}> = async ({ params }) => {
  const { slug } = await params;
  const t = await getTranslations("choices_edit");

  const room = await getRoomBySlug(slug);

  if (!room) {
    console.error("Error fetching room, room not found");
    return <div>{t("error_loading")}</div>;
  }

  const choices = await getChoicesByRoomId(room.id);

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl text-center mb-6 font-bold">
        {t("edit_room_choices")}
      </h1>
      <p
        className="pr
      ose mb-6"
      >
        {t("edit_room_choices_description")}
      </p>
      <ChoicesEditForm room={room} choices={choices} />
    </div>
  );
};

export default RoomEditPage;
