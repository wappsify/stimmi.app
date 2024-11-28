import { z } from "zod";

export const votingSchema = z.object({
  roomId: z.string(),
  choices: z.array(z.object({ id: z.string(), rank: z.number() })),
});

export type FormValues = z.infer<typeof votingSchema>;
