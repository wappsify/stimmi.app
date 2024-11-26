import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import RoomEditForm from "@/components/RoomEditForm";

const RoomEditPage: React.FC<{
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

  return (
    <div>
      <h1>Edit Room: {room.name}</h1>
      <RoomEditForm room={room} />
      <Button variant="outline" asChild>
        <Link href="/rooms">Back to Rooms</Link>
      </Button>
    </div>
  );
};

export default RoomEditPage;
