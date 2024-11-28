"use client";
import React from "react";
import { RoomUser } from "@/room_user.types";
import { useRealtimeRoomUsers } from "@/lib/hooks/useRealtimeRoomUsers";

export const ActiveUsersText: React.FC<{
  roomUsers: RoomUser[];
  roomId: string;
}> = ({ roomUsers, roomId }) => {
  const realtimeRoomUsers = useRealtimeRoomUsers(roomId, roomUsers);
  const totalUsers = realtimeRoomUsers.length;
  const usersWhoVoted = realtimeRoomUsers.filter(
    (user) => user.has_voted
  ).length;

  return (
    <p className="text-center text-sm">
      {usersWhoVoted} out of {totalUsers} users have voted.
    </p>
  );
};
