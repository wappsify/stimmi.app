import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    <div>
      <h1 className="text-3xl">
        You are currently viewing room <strong>{room.name}</strong>
        <Button variant="outline" asChild>
          <Link href={`/rooms/${room.slug}/edit`}>Edit</Link>
        </Button>
      </h1>
    </div>
  );
};

export default RoomOverviewPage;
