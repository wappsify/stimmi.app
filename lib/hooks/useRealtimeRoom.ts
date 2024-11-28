import { useEffect, useState } from "react";
import { createClient } from "../supabase/client";
import { Room } from "../../room.types";

export const useRealtimeRoom = (initialRoom: Room) => {
  const [room, setRoom] = useState(initialRoom);
  useEffect(() => {
    const supabase = createClient();

    const changes = supabase
      .channel("table-filter-changes")
      .on<Room>(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rooms",
          filter: `id=eq.${initialRoom.id}`,
        },
        async () => {
          const { data, error } = await supabase
            .from("rooms")
            .select("*")
            .eq("id", initialRoom.id)
            .single();
          if (error) {
            console.error("Error fetching room", error);
            return;
          }
          setRoom(data);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(changes);
    };
  }, [initialRoom.id]);

  return room;
};
