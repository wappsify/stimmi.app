"use client";
import { FormSubmitButton } from "@/components/forms/elements/form-submit-button";
import { Form } from "@/components/ui/form";
import { updateRoom } from "@/lib/actions/rooms";
import { FormValues, roomEditSchema } from "@/lib/schemas/room-edit";
import { objectToFormData } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Room } from "../room.types";
import { FormInputField } from "@/components/forms/elements/form-input-field";
import { FormTextareaField } from "@/components/forms/elements/form-textarea-field";

const RoomEditForm: React.FC<{ room: Room }> = ({ room }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(roomEditSchema),
    defaultValues: {
      id: room.id,
      name: room.name,
      description: room.description,
    },
  });

  const onSubmit = async (data: FormValues) => {
    const formData = objectToFormData(data);
    await updateRoom(formData);
    toast.success(`Room was updated successfully`);
  };

  return (
    <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
      <FormInputField<FormValues>
        type="hidden"
        name="id"
        control={form.control}
        placeholder=""
        label=""
        description=""
      />
      <FormInputField<FormValues>
        name="name"
        control={form.control}
        placeholder="Fantastic book club voting room"
        label="Room name"
        description="This is the name of your room. It should be descriptive and easy to remember. Choose it wisely as the URL of your room depends on it."
      />

      <FormTextareaField<FormValues>
        name="description"
        control={form.control}
        placeholder={
          "A longer description of the room. It may contain line breaks."
        }
        label="Room description"
        description="This is the description of your room. It should be a bit longer and give more context about what the room is for. All voters will see it displayed before voting."
      />
      <FormSubmitButton type="submit" className="place-self-center">
        Save Changes
      </FormSubmitButton>
    </Form>
  );
};

export default RoomEditForm;
