import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateRoom } from "@/lib/actions/rooms";
import { SubmitButton } from "../../../components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";

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
      <form action={updateRoom}>
        <input type="hidden" name="id" value={room.id} />
        <div>
          <Input
            type="text"
            id="name"
            name="name"
            defaultValue={room.name}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <Textarea
            id="description"
            name="description"
            defaultValue={room.description}
            required
          />
        </div>
        <SubmitButton type="submit">Save Changes</SubmitButton>
      </form>
      <Button variant="outline" asChild>
        <Link href="/rooms">Back to Rooms</Link>
      </Button>
    </div>
  );
};

export default RoomEditPage;
