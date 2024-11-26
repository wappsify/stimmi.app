import { createClient } from "../../lib/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getUserOrRedirect } from "@/lib/server/utils";

const RoomsPage = async () => {
  const supabase = createClient(cookies());

  const user = await getUserOrRedirect();

  const { data: rooms, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching rooms:", error);
    return <div>Error loading rooms</div>;
  }

  return (
    <div>
      <h1>Rooms</h1>
      <Button asChild>
        <Link href="/rooms/new">Create New Room</Link>
      </Button>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rooms.map((room) => (
          <li key={room.id}>
            <Link href={`/rooms/${room.slug}`}>
              <Card className="cursor-pointer">
                <CardContent>{room.name}</CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomsPage;
