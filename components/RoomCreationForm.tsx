"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRoom } from "@/lib/actions/rooms";
import { FormSubmitButton } from "@/components/forms/elements/form-submit-button";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { FormInputField } from "@/components/forms/elements/form-input-field";
import { objectToFormData } from "@/lib/utils";
import { FormValues, roomCreationSchema } from "@/lib/schemas/room-creation";

const RoomCreationForm: React.FC = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(roomCreationSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    const formData = objectToFormData(data);
    await createRoom(formData);
    toast.success(`Room was created successfully`);
  };

  return (
    <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
      <FormInputField<FormValues>
        name="name"
        control={form.control}
        placeholder="Fantastic book club voting room"
        label="Room name"
        description="This is the name of your room. It should be descriptive and easy to remember."
      />
      <FormSubmitButton type="submit" className="place-self-center">
        Create Room
      </FormSubmitButton>
    </Form>
  );
};

export default RoomCreationForm;
