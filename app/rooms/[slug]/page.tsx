import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { RoomDeletionForm } from "../../../components/RoomDeletionForm";

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

  return (
    <div className="grid gap-2">
      <h1 className="text-3xl">
        You are currently viewing room <strong>{room.name}</strong>
      </h1>
      <Button variant="outline" asChild>
        <Link href={`/rooms/${room.slug}/edit`}>Edit</Link>
      </Button>
      <RoomDeletionForm room={room} />
    </div>
  );
};

export default RoomOverviewPage;
