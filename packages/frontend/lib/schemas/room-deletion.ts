import { z } from "zod";

export const roomDeletionSchema = z.object({
  id: z.string(),
});

export type FormValues = z.infer<typeof roomDeletionSchema>;
