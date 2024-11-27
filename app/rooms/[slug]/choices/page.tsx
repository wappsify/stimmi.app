import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import ChoiceEditForm from "../../../../components/ChoicesEditForm";

const RoomEditPage: React.FC<{
  params: Promise<{ slug: string }>;
}> = async ({ params }) => {
  const supabase = createClient(cookies());
  const { slug } = await params;

  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("*")
    .eq("slug", slug)
    .single();

  if (roomError) {
    console.error("Error fetching room:", roomError);
    return <div>Error loading room</div>;
  }

  const { data: choices, error: choicesError } = await supabase
    .from("choices")
    .select("*")
    .eq("room_id", room.id);

  if (choicesError) {
    console.error("Error fetching data:", choicesError);
    return <div>Error loading choices</div>;
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl text-center mb-6 font-bold">Edit room choices</h1>
      <p className="prose mb-6">
        You may add as many choices as you like. Keep in mind that more choices
        require more effort when ranking them.
        <br />
        <br /> The choices will be displayed in a random order to the voters.
      </p>
      <ChoiceEditForm room={room} choices={choices} />
    </div>
  );
};

export default RoomEditPage;
