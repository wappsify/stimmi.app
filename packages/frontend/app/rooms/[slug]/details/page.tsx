import { getRoomBySlug } from "@packages/api/src/entities/rooms";
import { getTranslations } from "next-intl/server";

import { RoomEditForm } from "@/components/room-edit-form";

const RoomEditPage: React.FC<{
  params: Promise<{ slug: string }>;
}> = async ({ params }) => {
  const { slug } = await params;
  const t = await getTranslations("room_edit");

  const room = await getRoomBySlug(slug);

  if (!room) {
    return <div>{t("error_loading")}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl text-center mb-6">
        {t.rich("edit_room", {
          name: room.name,
          strong: (children) => <strong>{children}</strong>,
        })}
      </h1>
      <RoomEditForm room={room} />
    </div>
  );
};

export default RoomEditPage;
