import { createClient } from "../../lib/supabase/server";
import { cookies } from "next/headers";

const RoomsPage = async () => {
  const supabase = createClient(cookies());
  const { data: rooms, error } = await supabase.from("rooms").select("*");

  if (error) {
    console.error("Error fetching rooms:", error);
    return <div>Error loading rooms</div>;
  }

  return (
    <div>
      <h1>Rooms</h1>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>{room.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default RoomsPage;
