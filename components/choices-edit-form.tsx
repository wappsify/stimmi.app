"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DatabaseBackup, Plus, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormInputField } from "@/components/forms/elements/form-input-field";
import { FormSubmitButton } from "@/components/forms/elements/form-submit-button";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { updateChoices } from "@/lib/actions/choices";
import type { FormValues } from "@/lib/schemas/choices-edit";
import { choicesEditSchema } from "@/lib/schemas/choices-edit";
import type { Choice } from "@/lib/supabase/choice.types";
import type { Room } from "@/lib/supabase/room.types";
import { objectToFormData } from "@/lib/utils";

const getInitialChoices = (choices: Choice[]) =>
  choices.length > 0 ? choices.map(({ name }) => ({ name })) : [{ name: "" }];

export const ChoicesEditForm: React.FC<{ room: Room; choices: Choice[] }> = ({
  room,
  choices,
}) => {
  const t = useTranslations("choices_edit");
  const form = useForm<FormValues>({
    resolver: zodResolver(choicesEditSchema),
    defaultValues: {
      roomId: room.id,
      choices: getInitialChoices(choices),
    },
  });

  const onSubmit = async (data: FormValues) => {
    const formData = objectToFormData(data);
    await updateChoices(formData);
    toast.success(t("update_success"));
  };

  const { fields, append, remove } = useFieldArray<FormValues>({
    name: "choices",
    control: form.control,
  });

  return (
    <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
      {fields.map((_, index) => (
        <div className="grid grid-cols-[1fr_min-content] gap-2" key={index}>
          <FormInputField<FormValues>
            name={`choices.${index}.name`}
            control={form.control}
            placeholder={t("choice_placeholder")}
            label={t("choice_label", { index: index + 1 })}
            description={t("choice_description", { index: index + 1 })}
          />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            title={t("remove_choice")}
            onClick={() => remove(index)}
            className="mt-8"
          >
            <Trash />
          </Button>
        </div>
      ))}
      <FormField
        name="choices"
        control={form.control}
        render={() => (
          <FormItem>{fields.length < 3 && <FormMessage />}</FormItem>
        )}
      ></FormField>

      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ name: "" })}
        >
          <Plus />
          <span className="truncate">{t("add_choice")}</span>
        </Button>
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          <DatabaseBackup />
          <span className="truncate">{t("reset_changes")}</span>
        </Button>

        <FormSubmitButton type="submit" className="col-span-2">
          <span className="truncate">{t("save_choices")}</span>
        </FormSubmitButton>
      </div>
    </Form>
  );
};
