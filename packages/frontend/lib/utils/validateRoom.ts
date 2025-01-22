import type { Choice, Room } from "@packages/api/src/db/schema";

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
