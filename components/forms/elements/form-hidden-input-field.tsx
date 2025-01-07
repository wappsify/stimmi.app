import { FormField } from "@/components/ui/form";
import type { FieldValues } from "react-hook-form";
import type { HiddenFormFieldProps } from "./types";

export const FormHiddenInputField = <
  TFieldValues extends FieldValues = FieldValues,
>({
  control,
  name,
}: HiddenFormFieldProps<TFieldValues>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => <input type="hidden" {...field} />}
    />
  );
};
