import { Separator } from "@/components/ui/separator";
import { VotingSection } from "@/components/voting-section";
import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
  searchParams: URLSearchParams;
}): Promise<Metadata> {
  // read route params
  const slug = params.slug;

  const supabase = createClient(cookies());

  const { data: room } = await supabase
    .from("rooms")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!room) {
    return {
      title: "Vote in room | stimmi.app",
    };
  }

  return {
    title: `Vote in ${room.name} | stimmi.app`,
    description: `Someone wants you to vote in the room ${room.name}! Rank your choices now on stimmi.app.`,
    robots: { index: false, follow: false },
  };
}

const VotingPage: React.FC<{
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error: roomUsersError, data: existingUsers } = await supabase
    .from("room_users")
    .select()
    .eq("room_id", room.id);

  if (roomUsersError) {
    console.error(roomUsersError);
    return <div>Error fetching room users</div>;
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
        Hey there, welcome to <strong>stimmi.app</strong>!
        <br />
      </h1>

      <p className="text-xl text-center">
        Whoever sent you this link wants you to rank some choices.
      </p>

      <Separator className="my-6" />
      <VotingSection room={room} roomUsers={existingUsers} />
    </div>
  );
};

export default VotingPage;
