import { getChoicesByRoomId } from "@packages/api/src/entities/choices";
import { getRoomBySlugAndAccount } from "@packages/api/src/entities/rooms";
import { getTranslations } from "next-intl/server";

import { ChoicesEditForm } from "@/components/choices-edit-form";

import { getAccountOrRedirect } from "../../../../lib/server/utils";

const RoomEditPage: React.FC<{
  params: Promise<{ slug: string }>;
}> = async ({ params }) => {
  const { slug } = await params;
  const t = await getTranslations("choices_edit");

  const { account } = await getAccountOrRedirect();
  const room = await getRoomBySlugAndAccount(slug, account.id);

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
