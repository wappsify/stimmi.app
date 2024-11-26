import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FieldValues } from "react-hook-form";
import { FormFieldProps } from "./types";

export const FormTextareaField = <
  TFieldValues extends FieldValues = FieldValues,
>({
  control,
  name,
  label,
  description,
  placeholder,
}: FormFieldProps<TFieldValues>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea placeholder={placeholder} {...field} />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
