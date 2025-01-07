import { clsx, type ClassValue } from "clsx";
import seedrandom from "seedrandom";
import { twMerge } from "tailwind-merge";
import confetti from "canvas-confetti";
import { Choice } from "../choice.types";
import { Room } from "../room.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const objectToFormData = (obj: Record<string, unknown>): FormData => {
  const formData = new FormData();
  const appendFormData = (key: string, value: unknown) => {
    if (Array.isArray(value)) {
      value.forEach((item: object, index) => {
        if (typeof item === "object" && item !== null) {
          Object.entries(item).forEach(([subKey, subValue]) => {
            appendFormData(`${key}[${index}][${subKey}]`, subValue);
          });
        } else {
          formData.append(`${key}[${index}]`, item as string);
        }
      });
    } else {
      formData.append(key, value as string);
    }
  };

  Object.entries(obj).forEach(([key, value]) => appendFormData(key, value));
  return formData;
};

export const formDataToObject = (
  formData: FormData,
): Record<string, unknown> => {
  const obj: Record<string, unknown> = {};

  formData.forEach((value, key) => {
    const keys = key.split(/[[\]]/).filter(Boolean);
    keys.reduce((acc, currKey, index) => {
      if (index === keys.length - 1) {
        if (Array.isArray(acc[currKey])) {
          (acc[currKey] as unknown[]).push(value);
        } else if (acc[currKey] !== undefined) {
          acc[currKey] = [acc[currKey], value];
        } else {
          acc[currKey] = value;
        }
      } else {
        if (!acc[currKey]) {
          acc[currKey] = isNaN(Number(keys[index + 1])) ? {} : [];
        }
        return acc[currKey] as Record<string, unknown>;
      }
      return acc;
    }, obj);
  });

  return obj;
};

export const shuffleArray = <T = unknown>(array: T[], seed: string): T[] => {
  const rng = seedrandom(seed);
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const randomInRange = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};
export const shootConfetti = () => {
  const duration = 15 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    // since particles fall down, start a bit higher than random
    void confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    void confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
};

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
