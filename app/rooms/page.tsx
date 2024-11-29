import { createClient } from "../../lib/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getUserOrRedirect } from "@/lib/server/utils";
import { Crown, Edit, Eye, PlusCircle } from "lucide-react";

const RoomsPage = async () => {
  const supabase = createClient(cookies());

  const user = await getUserOrRedirect();

  const { data: rooms, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching rooms:", error);
    return <div>Error loading rooms</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-6">All your rooms</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <li className="h-full">
          <Card className="h-full bg-primary text-secondary">
            <CardHeader>
              <CardTitle>Create a new room</CardTitle>
              <CardDescription className="text-muted">
                You may create a new room at any time by clicking below!
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 mt-auto">
              <Button variant="secondary" asChild>
                <Link href={`/rooms/new`}>
                  <PlusCircle />
                  Start creating room
                </Link>
              </Button>
            </CardContent>
          </Card>
        </li>
        {rooms.map((room) => (
          <li key={room.id} className="h-full">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{room.name || <i>No title</i>}</CardTitle>
                <CardDescription>
                  {room.description || "You haven't set a description yet."}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto grid grid-cols-2 gap-2">
                {room.status === "results" ? (
                  <Button className="col-span-2" size="sm" asChild>
                    <Link href={`/v/${room.slug}/results`}>
                      <Crown />
                      View room results
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button className="col-span-2" size="sm" asChild>
                      <Link href={`/rooms/${room.slug}`}>
                        <Eye />
                        Room overview
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/rooms/${room.slug}/details`}>
                        <Edit />
                        Edit details
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/rooms/${room.slug}/choices`}>
                        <Edit />
                        Edit choices
                      </Link>
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomsPage;
