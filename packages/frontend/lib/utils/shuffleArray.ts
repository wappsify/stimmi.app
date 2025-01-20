import seedrandom from "seedrandom";

export const shuffleArray = <T = unknown>(array: T[], seed: string): T[] => {
  const rng = seedrandom(seed);
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};
