"use client";

import { FormInputField } from "@/components/forms/elements/form-input-field";
import { FormSubmitButton } from "@/components/forms/elements/form-submit-button";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { updateChoices } from "@/lib/actions/choices";
import { choicesEditSchema, FormValues } from "@/lib/schemas/choices-edit";
import { objectToFormData } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatabaseBackup, Plus, Trash } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Choice } from "../choice.types";
import { Room } from "../room.types";

const getInitialChoices = (choices: Choice[]) =>
  choices.length > 0 ? choices.map(({ name }) => ({ name })) : [{ name: "" }];

const ChoicesEditForm: React.FC<{ room: Room; choices: Choice[] }> = ({
  room,
  choices,
}) => {
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
    toast.success(`Choices were updated successfully`);
  };

  const { fields, append, remove } = useFieldArray<FormValues>({
    name: "choices",
    control: form.control,
  });

  return (
    <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
      {fields.map((_, index) => (
        <div
          className="grid grid-cols-[1fr_min-content] gap-2 items-center"
          key={index}
        >
          <FormInputField<FormValues>
            name={`choices.${index}.name`}
            control={form.control}
            placeholder="My new choice"
            label={`Choice ${index + 1}`}
            description={`Enter the title of choice #${index + 1}. Keep it short and descriptive.`}
          />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            title="Remove this choice"
            onClick={() => remove(index)}
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
          Add another choice
        </Button>
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          <DatabaseBackup />
          Reset changes
        </Button>

        <FormSubmitButton type="submit" className="col-span-2">
          Save choices
        </FormSubmitButton>
      </div>
    </Form>
  );
};

export default ChoicesEditForm;
