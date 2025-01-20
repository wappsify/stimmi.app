"use client";
import { useTranslations } from "next-intl";
import React from "react";

import { useRealtimeRoomUsers } from "@/lib/hooks/useRealtimeRoomUsers";
import type { RoomUser } from "@/lib/supabase/room_user.types";

export const ActiveUsersText: React.FC<{
  roomUsers: RoomUser[];
  roomId: string;
}> = ({ roomUsers, roomId }) => {
  const t = useTranslations("results");
  const realtimeRoomUsers = useRealtimeRoomUsers(roomId, roomUsers);
  const totalUsers = realtimeRoomUsers.length;
  const usersWhoVoted = realtimeRoomUsers.filter(
    (user) => user.has_voted,
  ).length;

  return (
    <p className="text-center text-sm">
      {t("users_voted", { usersWhoVoted, totalUsers })}
    </p>
  );
};
