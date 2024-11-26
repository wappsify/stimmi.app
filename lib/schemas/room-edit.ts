import { z } from "zod";

export const roomEditSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(3, { message: "Room name must be at least 3 characters." })
    .max(100, { message: "Room name must be at most 100 characters." }),
  description: z
    .string()
    .max(500, { message: "Description must be at most 500 characters." }),
});

export type FormValues = z.infer<typeof roomEditSchema>;
