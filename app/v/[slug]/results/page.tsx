import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ResultsView } from "../../../../components/results-view";
import { getTranslations } from "next-intl/server";

const ResultsPage: React.FC<{
  params: Promise<{ slug: string }>;
}> = async ({ params }) => {
  const t = await getTranslations("results_page");
  const supabase = createClient(cookies());

  const { slug } = await params;

  const { data: room, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching room:", error);
    return <div>{t("error_loading_room")}</div>;
  }

  // check if user is in room_users and has voted
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/v/${slug}`);
  }

  const { data: roomUsers, error: roomUsersError } = await supabase
    .from("room_users")
    .select("*")
    .eq("room_id", room.id);

  if (roomUsersError) {
    console.error("Error fetching room users:", roomUsersError);
    return <div>{t("error_loading_room_users")}</div>;
  }

  if (
    !roomUsers.some((u) => u.user_id === user.id && u.has_voted) &&
    room.user_id !== user.id
  ) {
    redirect(`/v/${slug}`);
  }

  const { data: choices, error: choicesError } = await supabase
    .from("choices")
    .select("*")
    .eq("room_id", room.id);

  if (choicesError) {
    console.error("Error fetching choices:", choicesError);
    return <div>{t("error_loading_choices")}</div>;
  }

  return (
    <div className="grid">
      <h1 className="text-xl text-center mb-4">
        {t.rich("results_title", {
          roomName: room.name,
          nameWrapper: (children) => (
            <>
              <br />
              <strong className="text-2xl">{children}</strong>
            </>
          ),
        })}
      </h1>
      <Separator className="mb-6" />
      <ResultsView
        room={room}
        roomUsers={roomUsers}
        choices={choices}
        user={user}
      />
    </div>
  );
};

export default ResultsPage;
