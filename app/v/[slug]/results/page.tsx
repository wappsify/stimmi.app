import { ActiveUsersText } from "@/components/active-users-text";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import { LoaderPinwheel } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { RoomStatusForm } from "../../../../components/RoomStatusForm";

const ResultsPage: React.FC<{
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
    return <div>Error loading room users</div>;
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
    return <div>Error loading choices</div>;
  }

  return (
    <div className="grid">
      <h1 className="text-xl text-center mb-4">
        Results of
        <br /> <strong className="text-2xl">{room.name}</strong>
      </h1>
      <Separator className="mb-6" />

      {room.user_id === user.id && room.status === "open" && (
        <div className="grid gap-4 mb-6">
          <p className="text-sm text-center">
            To calculate the results, close the room. Only you as room owner can
            do this.
          </p>
          <RoomStatusForm room={room} choices={choices} />
        </div>
      )}

      {room.status === "open" && (
        <div className="grid gap-4">
          <ActiveUsersText roomUsers={roomUsers} roomId={room.id} />
          <LoaderPinwheel className="size-20 animate-spinSlow text-slate-400 place-self-center" />
          <p className="text-center text-sm">
            We&apos;re still waiting for the room owner to close the room before
            the results are calculated!
          </p>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
