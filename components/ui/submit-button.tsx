"use client";
import { Button, ButtonProps } from "@/components/ui/button";
import { ArrowBigRightDash, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

interface SubmitButtonProps extends ButtonProps {
  isLoading?: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isLoading,
  children,
  ...props
}) => {
  const { pending } = useFormStatus();

  const isLoadingOrPending = isLoading || pending;
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
