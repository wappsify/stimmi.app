"use client";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { ArrowBigRightDash, Loader2 } from "lucide-react";
import { useFormState } from "react-hook-form";

type FormSubmitButtonProps = {
  isLoading?: boolean;
} & ButtonProps;

export const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({
  isLoading,
  children,
  ...props
}) => {
  const { isSubmitting } = useFormState();

  const isLoadingOrPending = isLoading ?? isSubmitting;
  return (
    <Button disabled={isLoadingOrPending || props.disabled} {...props}>
      {isLoadingOrPending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <ArrowBigRightDash />
      )}
      {children}
    </Button>
  );
};
