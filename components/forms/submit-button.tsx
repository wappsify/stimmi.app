"use client";
import { Button, ButtonProps } from "@/components/ui/button";
import { ArrowBigRightDash, Loader2 } from "lucide-react";
import { useFormState } from "react-hook-form";

interface FormSubmitButtonProps extends ButtonProps {
  isLoading?: boolean;
}

export const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({
  isLoading,
  children,
  ...props
}) => {
  const { isSubmitting } = useFormState();

  const isLoadingOrPending = isLoading || isSubmitting;
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
