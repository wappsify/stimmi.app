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
      <h1 className="text-3xl font-bold text-center mb-6">
        Edit room {room.name}
      </h1>
      <RoomEditForm room={room} />
    </div>
  );
};

export default RoomEditPage;
