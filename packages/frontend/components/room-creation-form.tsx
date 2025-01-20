"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormInputField } from "@/components/forms/elements/form-input-field";
import { FormSubmitButton } from "@/components/forms/elements/form-submit-button";
import { Form } from "@/components/ui/form";
import { createRoom } from "@/lib/actions/rooms";
import type { FormValues } from "@/lib/schemas/room-creation";
import { roomCreationSchema } from "@/lib/schemas/room-creation";
import { objectToFormData } from "@/lib/utils/objectToFormData";

export const RoomCreationForm: React.FC = () => {
  const t = useTranslations("room_creation");
  const form = useForm<FormValues>({
    resolver: zodResolver(roomCreationSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    const formData = objectToFormData(data);
    await createRoom(formData);
    toast.success(t("create_success"));
  };

  return (
    <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
      <FormInputField<FormValues>
        name="name"
        control={form.control}
        placeholder={t("name_placeholder")}
        label={t("name_label")}
        description={t("name_description")}
      />
      <FormSubmitButton type="submit" className="place-self-center">
        {t("create_button")}
      </FormSubmitButton>
    </Form>
  );
};
