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
import { getTranslations } from "next-intl/server";

const RoomsPage = async () => {
  const t = await getTranslations("rooms");
  const supabase = createClient(cookies());

  const user = await getUserOrRedirect();

  const { data: rooms, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching rooms:", error);
    return <div>{t("error_loading")}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-6">{t("all_rooms")}</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <li className="h-full">
          <Card className="h-full bg-primary text-secondary">
            <CardHeader>
              <CardTitle>{t("create_new_room")}</CardTitle>
              <CardDescription className="text-muted">
                {t("create_new_room_description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 mt-auto">
              <Button variant="secondary" asChild>
                <Link href={`/rooms/new`}>
                  <PlusCircle />
                  <span className="truncate">{t("start_creating_room")}</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </li>
        {rooms.map((room) => (
          <li key={room.id} className="h-full">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{room.name || <i>{t("no_title")}</i>}</CardTitle>
                <CardDescription>
                  {room.description || t("no_description")}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto grid grid-cols-2 gap-2">
                {room.status === "results" ? (
                  <Button className="col-span-2" size="sm" asChild>
                    <Link href={`/v/${room.slug}/results`}>
                      <Crown />
                      {t("view_room_results")}
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button className="col-span-2" size="sm" asChild>
                      <Link href={`/rooms/${room.slug}`}>
                        <Eye />
                        {t("room_overview")}
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/rooms/${room.slug}/details`}>
                        <Edit />
                        <span className="truncate">{t("edit_details")}</span>
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/rooms/${room.slug}/choices`}>
                        <Edit />
                        <span className="truncate">{t("edit_choices")}</span>
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
