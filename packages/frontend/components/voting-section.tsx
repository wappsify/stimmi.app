"use client";

import type { Choice, Room, User } from "@packages/api/src/db/schema";
import { DoorOpen, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRealtimeRoomUsers } from "@/lib/hooks/useRealtimeRoomUsers";

import { addSessionUserToRoom } from "../lib/actions/room-users";
import { Skeleton } from "./ui/skeleton";
import { VotingForm } from "./voting-form";

export const VotingSection: React.FC<{
  room: Room;
  roomUsers: { id: string; hasVoted: boolean }[];
  user: User | null;
}> = ({ room, roomUsers: serverRoomUsers, user }) => {
  const t = useTranslations("voting_section");
  const [isInRoom, setIsInRoom] = useState(false);

  const [choices, addUser, isJoining] = useActionState<Choice[]>(
    () => addSessionUserToRoom(room.id),
    [],
  );

  const handleJoinClick = () => {
    if (!user) {
      console.error("User not found");
      return;
    }
    addUser();
  };

  const roomUsers = useRealtimeRoomUsers(room.id, serverRoomUsers);

  useEffect(() => {
    if (!user || !roomUsers) {
      return;
    }
    const userInRoom = roomUsers.find((ru) => ru.user_id === user.id);
    setIsInRoom(!!userInRoom);
  }, [user, room, roomUsers]);

  return (
    <Card className="h-full">
      <CardHeader className="text-center">
        <CardTitle>{room.name}</CardTitle>
        {room.description && (
          <CardDescription>{room.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="grid">
        {!user || !choices.length ? (
          <Skeleton className="h-[40px] w-full" />
        ) : isInRoom ? (
          <VotingForm choices={choices} room={room} />
        ) : (
          <Button
            className="place-self-center"
            onClick={() => void handleJoinClick()}
            disabled={isJoining}
          >
            {isJoining ? <Loader2 className="animate-spin" /> : <DoorOpen />}
            {t("join_button")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
