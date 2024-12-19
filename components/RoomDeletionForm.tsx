"use client";
import { Trash } from "lucide-react";
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTrigger,
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { FormSubmitButton } from "@/components/forms/elements/form-submit-button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { FormValues, roomDeletionSchema } from "@/lib/schemas/room-deletion";
import { zodResolver } from "@hookform/resolvers/zod";
import { Room } from "../room.types";
import { objectToFormData } from "@/lib/utils";
import { deleteRoom } from "@/lib/actions/rooms";
import { toast } from "sonner";
import { useState } from "react";
import { useTranslations } from "next-intl";

export const RoomDeletionForm: React.FC<{ room: Room; className?: string }> = ({
  className,
  room,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(roomDeletionSchema),
    defaultValues: {
      id: room.id,
    },
  });

  const onSubmit = async (data: FormValues) => {
    const formData = objectToFormData(data);
    await deleteRoom(formData);
    setIsOpen(false);
    toast.success(`Room was deleted successfully`);
  };

  const [isOpen, setIsOpen] = useState(false);

  const t = useTranslations("room_deletion_form");

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive" className={className}>
          <Trash />
          {t("delete_room")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmation_title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("confirmation_description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <FormSubmitButton variant="destructive">
              {t("confirm_button")}
            </FormSubmitButton>
          </AlertDialogFooter>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
