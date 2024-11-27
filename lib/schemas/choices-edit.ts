import { z } from "zod";

const choice = z.object({
  name: z.string().min(5, "Choice must be at least 5 characters"),
});

export const choicesEditSchema = z.object({
  roomId: z.string(),
  choices: z.array(choice).min(3, "You must have at least 3 choices"),
});

export type FormValues = z.infer<typeof choicesEditSchema>;
