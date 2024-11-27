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

export const RoomDeletionForm: React.FC<{ room: Room }> = ({ room }) => {
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

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash />
          Delete room
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              room and any choices you have added to it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, cancel</AlertDialogCancel>
            <FormSubmitButton>Yes, delete room</FormSubmitButton>
          </AlertDialogFooter>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
