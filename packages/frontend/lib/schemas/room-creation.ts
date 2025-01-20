import { z } from "zod";

export const roomCreationSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Room name must be at least 3 characters." })
    .max(100, { message: "Room name must be at most 100 characters." }),
});

export type FormValues = z.infer<typeof roomCreationSchema>;
