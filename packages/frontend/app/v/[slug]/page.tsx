import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { Separator } from "@/components/ui/separator";
import { VotingSection } from "@/components/voting-section";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const t = await getTranslations("voting_page");
  const slug = (await params).slug;

  const supabase = createClient(cookies());

  const { data: room } = await supabase
    .from("rooms")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!room) {
    return {
      title: t("metadata_default_title"),
    };
  }

  return {
    title: t("metadata_title", { roomName: room.name }),
    description: t("metadata_description", { roomName: room.name }),
    robots: { index: false, follow: false },
  };
}

const VotingPage: React.FC<{
  params: Promise<{ slug: string }>;
}> = async ({ params }) => {
  const t = await getTranslations("voting_page");
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error: roomUsersError, data: existingUsers } = await supabase
    .from("room_users")
    .select()
    .eq("room_id", room.id);

  if (roomUsersError) {
    console.error(roomUsersError);
    return <div>{t("error_fetching_room_users")}</div>;
  }

  if (user) {
    // check if user has already voted
    if (existingUsers?.some((u) => u.user_id === user.id && u.has_voted)) {
      redirect(`/v/${room.slug}/results`);
    }
  }

  return (
    <div className="grid">
      <h1 className="text-3xl text-center mb-4">
        {t.rich("welcome_message", {
          strong: (children) => <strong>{children}</strong>,
        })}
        <br />
      </h1>

      <p className="text-xl text-center">{t("instruction_message")}</p>

      <Separator className="my-6" />
      <VotingSection room={room} roomUsers={existingUsers} />
    </div>
  );
};

export default VotingPage;
