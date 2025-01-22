"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Room } from "@packages/api/src/db/schema";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormSubmitButton } from "@/components/forms/elements/form-submit-button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { deleteRoom } from "@/lib/actions/rooms";
import type { FormValues } from "@/lib/schemas/room-deletion";
import { roomDeletionSchema } from "@/lib/schemas/room-deletion";
import { objectToFormData } from "@/lib/utils/objectToFormData";

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
          <span className="truncate">{t("delete_room")}</span>
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
            <AlertDialogCancel>
              <span className="truncate">{t("cancel")}</span>
            </AlertDialogCancel>
            <FormSubmitButton variant="destructive">
              <span className="truncate">{t("confirm_button")}</span>
            </FormSubmitButton>
          </AlertDialogFooter>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
