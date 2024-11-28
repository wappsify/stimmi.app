"use server";
import { votingSchema } from "../schemas/submit-votes";
import { formDataToObject } from "../utils";

export const submitVotes = async (formData: FormData) => {
  const transformedFormData = formDataToObject(formData);
  const {
    data: values,
    success,
    error,
  } = votingSchema.safeParse({
    roomId: transformedFormData.roomId,
    choices: transformedFormData.choices,
  });

  if (!success) {
    console.error("Invalid form data:", error);
    throw new Error("Invalid form data");
  }

  console.log({ values });

  //   const { data, error } = await supabase
  //     .from("votes")
  //     .upsert({
  //       room_id: values.roomId,
  //       votes: values.votes,
  //     })
  //     .select()
  //     .single();

  //   if (error) {
  //     console.error("Error submitting votes:", error);
  //     throw new Error("Failed to submit votes");
  //   }

  //   redirect(`/rooms/${data.slug}/results`, RedirectType.replace);
};
