import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";

export type FormFieldProps<TFieldValues extends FieldValues = FieldValues> = {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  description: React.ReactNode;
  placeholder?: string;
  type?: string;
};

export type HiddenFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
> = {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
};
