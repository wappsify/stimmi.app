import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
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
          Viewing room: <strong>{room.name}</strong>
        </h1>
        <p className="prose mb-6">
          You may edit the room details, add choices to the room or delete the
          room from this page.
        </p>
        <div className="grid gap-2 grid-cols-2 ">
          <Button asChild>
            <Link href={`/rooms/${room.slug}/details`}>
              <Edit />
              Edit room details
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/rooms/${room.slug}/choices`}>
              <Edit />
              Add and edit choices
            </Link>
          </Button>
          <RoomDeletionForm room={room} className="col-span-2" />
        </div>
      </div>
    </div>
  );
};

export default RoomOverviewPage;
