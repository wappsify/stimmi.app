import { ArrowLeft, Crown, Edit } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { RoomDeletionForm } from "@/components/room-deletion-form";
import { RoomStatusForm } from "@/components/room-status-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";

const RoomOverviewPage: React.FC<{
  params: Promise<{ slug: string }>;
}> = async ({ params }) => {
  const supabase = createClient(cookies());
  const { slug } = await params;
  const t = await getTranslations("room_overview");

  const { data: room, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching room:", error);
    return <div>{t("error_loading_room")}</div>;
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
    <div className="grid gap-4">
      <Button
        variant="outline"
        size="sm"
        asChild
        className="sm:place-self-start"
      >
        <Link href="/rooms">
          <ArrowLeft />
          {t("back_to_list_of_rooms")}
        </Link>
      </Button>

      <div className="grid max-w-md mx-auto">
        <h1 className="text-3xl text-center mb-4">
          {t.rich("room", {
            name: room.name,
            strong: (children) => <strong>{children}</strong>,
          })}
        </h1>
        <p className="prose">{t("description")}</p>
        <Separator className="my-6" />
        <div>
          <h2 className="text-xl">
            {t.rich("current_room_status", {
              status: t(room.status),
              strong: (children) => <strong>{children}</strong>,
            })}
          </h2>
          <p className="text-sm text-gray-500">
            {room.status === "private" && t("private_status_description")}
            {room.status === "open" && (
              <>
                {t("open_status_description")}
                <br />
                <Input
                  readOnly
                  className="mt-2 select-all"
                  value={`${process.env.NEXT_PUBLIC_BASE_URL}/v/${room.slug}`}
                />
              </>
            )}
            {room.status === "results" && t("results_status_description")}
          </p>
        </div>
        <Separator className="my-6" />

        <div className="grid gap-2 grid-cols-2">
          <Button
            asChild
            variant="outline"
            disabled={room.status !== "private"}
          >
            <Link href={`/rooms/${room.slug}/details`}>
              <Edit />
              <span className="truncate">{t("edit_room_details")}</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            disabled={room.status !== "private"}
          >
            <Link href={`/rooms/${room.slug}/choices`}>
              <Edit />
              <span className="truncate">{t("add_and_edit_choices")}</span>
            </Link>
          </Button>
          {room.status === "results" ? (
            <Button asChild className="col-span-2">
              <Link href={`/v/${room.slug}/results`}>
                <Crown />
                <span className="truncate">{t("view_room_results")}</span>
              </Link>
            </Button>
          ) : (
            <RoomStatusForm
              room={room}
              choices={choices}
              className="col-span-2"
            />
          )}
          <Separator className="col-span-2 my-6" />
          <RoomDeletionForm room={room} className="col-span-2" />
        </div>
      </div>
    </div>
  );
};

export default RoomOverviewPage;
