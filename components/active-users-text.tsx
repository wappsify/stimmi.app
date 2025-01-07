"use client";
import React from "react";
import type { RoomUser } from "@/lib/supabase/room_user.types";
import { useRealtimeRoomUsers } from "@/lib/hooks/useRealtimeRoomUsers";
import { useTranslations } from "next-intl";

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
