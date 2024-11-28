"use client";

import { DoorOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Room } from "../room.types";
import { Choice } from "../choice.types";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRealtimeRoomUsers } from "../lib/hooks/useRealtimeRoomUsers";
import { RoomUser } from "../room_user.types";
import { useUser } from "../lib/hooks/useUser";
import { Skeleton } from "./ui/skeleton";
import { VotingForm } from "./voting-form";

export const VotingSection: React.FC<{
  room: Room;
  roomUsers: RoomUser[];
}> = ({ room, roomUsers: serverRoomUsers }) => {
  const [isJoining, setIsJoining] = useState(false);
  const [isInRoom, setIsInRoom] = useState(false);

  const user = useUser();

  const supabase = createClient();

  const handleJoinClick = async () => {
    if (!user) {
      console.error("User not found");
      return;
    }

    setIsJoining(true);

    const { error: roomUsersError } = await supabase
      .from("room_users")
      .insert([{ room_id: room.id, user_id: user.id, has_voted: false }]);

    if (roomUsersError) {
      console.error("Error adding room user", roomUsersError);
      setIsJoining(false);
      throw new Error("Error fetching choices");
    }

    setIsJoining(false);
  };

  const roomUsers = useRealtimeRoomUsers(room.id, serverRoomUsers);

  const [choices, setChoices] = useState<Choice[]>([]);

  useEffect(() => {
    const fetchChoices = async () => {
      if (!room || !user || choices.length > 0) {
        return;
      }

      const { data: fetchedChoices, error } = await supabase
        .from("choices")
        .select("*")
        .eq("room_id", room.id);

      if (error) {
        console.error("Error fetching choices", error);
        throw new Error("Error fetching choices");
      }

      setChoices(fetchedChoices);
    };

    fetchChoices();
  }, [room, user, choices]);

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
            onClick={handleJoinClick}
            disabled={isJoining}
          >
            {isJoining ? <Loader2 /> : <DoorOpen />}
            Join this room and start voting!
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
