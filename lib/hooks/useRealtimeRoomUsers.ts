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
      .channel("table-filter-changes")
      .on<RoomUser>(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "room_users",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setRoomUsers((prev) => {
            return [...prev, payload.new];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(changes);
    };
  }, [roomId]);

  return roomUsers;
};
