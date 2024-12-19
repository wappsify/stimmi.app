import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import RoomEditForm from "@/components/RoomEditForm";
import { getTranslations } from "next-intl/server";

const RoomEditPage: React.FC<{
  params: Promise<{ slug: string }>;
}> = async ({ params }) => {
  const supabase = createClient(cookies());
  const { slug } = await params;
  const t = await getTranslations("room_edit");

  const { data: room, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching room:", error);
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
