import { CheckCircle, XCircle } from "lucide-react";
import { Choice } from "../choice.types";
import { Room } from "../room.types";

const checks = [
  {
    name: "Room details are filled.",
    check: (room: Room) => !!room.name,
  },
  {
    name: "At least three choices have been added.",
    check: (_: Room, choices: Choice[]) => choices.length >= 3,
  },
];

export const validateRoom = (room: Room, choices: Choice[]) => {
  return checks.every(({ check }) => check(room, choices));
};

export const RoomCheck: React.FC<{ room: Room; choices: Choice[] }> = ({
  room,
  choices,
}) => {
  return (
    <>
      <h3 className="text-primary text-md font-bold mb-0">Room check:</h3>
      <ul className="grid text-primary text-sm gap-2">
        {checks.map(({ name, check }) => (
          <li
            key={name}
            className={`flex gap-2 ${check(room, choices) ? "text-green-500" : "text-red-500"} font-semibold`}
          >
            {check(room, choices) ? <CheckCircle /> : <XCircle />}
            {name}
          </li>
        ))}
      </ul>
    </>
  );
};
