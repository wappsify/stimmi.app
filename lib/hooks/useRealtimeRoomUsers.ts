import { useEffect, useState } from "react";
import { createClient } from "../supabase/client";
import { RoomUser } from "../../room_user.types";

export const useRealtimeRoomUsers = (
  roomId: string,
  initialValues: RoomUser[]
) => {
  const [roomUsers, setRoomUsers] = useState(initialValues);
  useEffect(() => {
    const supabase = createClient();

    const changes = supabase
      .channel("messages-roomusers")
      .on<RoomUser>(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "room_users",
          filter: `room_id=eq.${roomId}`,
        },
        async () => {
          const { data, error } = await supabase
            .from("room_users")
            .select("*")
            .eq("room_id", roomId);
          if (error) {
            console.error("Error fetching room users", error);
            return;
          }
          setRoomUsers(data);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(changes);
    };
  }, [roomId]);

  return roomUsers;
};
