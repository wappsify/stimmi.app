import { z } from "zod";

export const roomStatusSchema = z.object({
  id: z.string(),
  status: z.enum(["open", "results"]),
});

export type FormValues = z.infer<typeof roomStatusSchema>;
