"use client";

import { FormSubmitButton } from "@/components/forms/elements/form-submit-button";
import { Form } from "@/components/ui/form";
import { updateRoom } from "@/lib/actions/rooms";
import type { FormValues } from "@/lib/schemas/room-edit";
import { roomEditSchema } from "@/lib/schemas/room-edit";
import { objectToFormData } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { Room } from "@/lib/supabase/room.types";
import { FormInputField } from "@/components/forms/elements/form-input-field";
import { FormTextareaField } from "@/components/forms/elements/form-textarea-field";
import { useTranslations } from "next-intl";

const RoomEditForm: React.FC<{ room: Room }> = ({ room }) => {
  const t = useTranslations("room_edit");
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
    toast.success(t("update_success"));
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
        placeholder={t("name_placeholder")}
        label={t("name_label")}
        description={t("name_description")}
      />

      <FormTextareaField<FormValues>
        name="description"
        control={form.control}
        placeholder={t("description_placeholder")}
        label={t("description_label")}
        description={t("description_description")}
      />
      <FormSubmitButton type="submit" className="place-self-center">
        {t("save_changes")}
      </FormSubmitButton>
    </Form>
  );
};

export default RoomEditForm;
