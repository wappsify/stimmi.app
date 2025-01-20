import type { Choice } from "@/lib/supabase/choice.types";
import type { Room } from "@/lib/supabase/room.types";

export const roomChecks = [
  {
    name: "details_are_filled" as const,
    check: (room: Room) => !!room.name,
  },
  {
    name: "choices_are_filled" as const,
    check: (_: Room, choices: Choice[]) => choices.length >= 3,
  },
];

export const validateRoom = (room: Room, choices: Choice[]) => {
  return roomChecks.every(({ check }) => check(room, choices));
};
