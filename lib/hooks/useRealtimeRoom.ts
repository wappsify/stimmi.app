import { useEffect, useState } from "react";
import { createClient } from "../supabase/client";
import { Room } from "../../room.types";

export const useRealtimeRoom = (initialRoom: Room) => {
  const [room, setRoom] = useState(initialRoom);
  useEffect(() => {
    const supabase = createClient();

    const fetchRoom = async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select()
        .eq("id", initialRoom.id)
        .single();
      if (error) {
        console.error("Error fetching room", error);
        return;
      }
      setRoom(data);
    };

    const changes = supabase
      .channel("messages-room")
      .on<Room>(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rooms",
          filter: `id=eq.${initialRoom.id}`,
        },
        () => void fetchRoom(),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(changes);
    };
  }, [initialRoom.id]);

  return room;
};
