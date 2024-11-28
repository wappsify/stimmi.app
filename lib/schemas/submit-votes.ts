import { z } from "zod";

export const votingSchema = z.object({
  roomId: z.string(),
  choices: z.array(z.object({ id: z.string() })),
});

export type FormValues = z.infer<typeof votingSchema>;
