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
import { useTranslations } from "next-intl";

const RoomCreationForm: React.FC = () => {
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
    toast.success(t("room_creation"));
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

export default RoomCreationForm;
