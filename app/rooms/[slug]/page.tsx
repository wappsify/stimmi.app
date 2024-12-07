import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Crown, Edit } from "lucide-react";
import { RoomDeletionForm } from "../../../components/RoomDeletionForm";
import { Room } from "../../../room.types";
import { Separator } from "../../../components/ui/separator";
import { RoomStatusForm } from "../../../components/RoomStatusForm";
import { Input } from "../../../components/ui/input";

const statusMap: { [key in Room["status"]]: string } = {
  private: "Private",
  open: "Open for voting",
  results: "Results available",
};

const RoomOverviewPage: React.FC<{
  params: Promise<{ slug: string }>;
}> = async ({ params }) => {
  const supabase = createClient(cookies());
  const { slug } = await params;

  const { data: room, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching room:", error);
    return <div>Error loading room</div>;
  }

  const { data: choices, error: choicesError } = await supabase
    .from("choices")
    .select("*")
    .eq("room_id", room.id);

  if (choicesError) {
    console.error("Error fetching choices:", choicesError);
    return <div>Error loading choices</div>;
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
          Back to list of rooms
        </Link>
      </Button>

      <div className="grid max-w-md mx-auto">
        <h1 className="text-3xl text-center mb-4">
          Room <strong>≫{room.name}≪</strong>
        </h1>
        <p className="prose">
          You may edit the room details, add choices to the room and open the
          room for voting.
        </p>
        <Separator className="my-6" />
        <div>
          <h2 className="text-xl">
            Current room status: <strong>{statusMap[room.status]}</strong>
          </h2>
          <p className="text-sm text-gray-500">
            {room.status === "private" && (
              <>
                The room is currently private and not open for voting. Only you
                have access to it. You may add choices to the room and open it
                for voting.
              </>
            )}
            {room.status === "open" && (
              <>
                The room is currently open for voting. Share the link with your
                friends and let them rank the choices! Link:
                <br />
                <Input
                  readOnly
                  className="mt-2 select-all"
                  value={`${process.env.NEXT_PUBLIC_BASE_URL}/v/${room.slug}`}
                />
              </>
            )}
            {room.status === "results" && (
              <>
                The room is closed for voting. You and anybody that voted on it
                may view the results of the room.
              </>
            )}
          </p>
        </div>
        <Separator className="my-6" />

        <div className="grid gap-2 grid-cols-2 ">
          <Button
            asChild
            variant="outline"
            disabled={room.status !== "private"}
          >
            <Link href={`/rooms/${room.slug}/details`}>
              <Edit />
              Edit room details
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            disabled={room.status !== "private"}
          >
            <Link href={`/rooms/${room.slug}/choices`}>
              <Edit />
              Add and edit choices
            </Link>
          </Button>
          {room.status === "results" ? (
            <Button asChild className="col-span-2">
              <Link href={`/v/${room.slug}/results`}>
                <Crown />
                View room results
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
