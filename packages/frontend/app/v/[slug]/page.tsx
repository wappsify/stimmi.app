import { getPublicRoomBySlug } from "@packages/api/src/entities/rooms";
import { getRoomUsersByRoomId } from "@packages/api/src/entities/roomUsers";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { Separator } from "@/components/ui/separator";
import { VotingSection } from "@/components/voting-section";
import { getCurrentSession } from "@/lib/server/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const t = await getTranslations("voting_page");
  const slug = (await params).slug;

  const room = await getPublicRoomBySlug(slug);

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

  const { slug } = await params;

  try {
    const room = await getPublicRoomBySlug(slug);

    const { user } = await getCurrentSession();

    try {
      const existingUsers = await getRoomUsersByRoomId(room.id);

      if (user) {
        // check if user has already voted
        if (existingUsers.some((u) => u.id === user.id && u.hasVoted)) {
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
          <VotingSection room={room} roomUsers={existingUsers} user={user} />
        </div>
      );
    } catch (roomUsersError) {
      console.error(roomUsersError);
      return <div>{t("error_fetching_room_users")}</div>;
    }
  } catch (error) {
    if (error) {
      console.error("Error fetching room:", error);
      return <div>{t("error_loading_room")}</div>;
    }
  }
};

export default VotingPage;
