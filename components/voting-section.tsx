import { DoorOpen } from "lucide-react";
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

export const VotingSection: React.FC<{ room: Room; choices: Choice[] }> = ({
  room,
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="text-center">
        <CardTitle>{room.name}</CardTitle>
        {room.description && (
          <CardDescription>{room.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="grid">
        <Button className="place-self-center">
          <DoorOpen />
          Join this room and start voting!
        </Button>
      </CardContent>
    </Card>
  );
};
