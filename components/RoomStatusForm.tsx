"use client";
import { DoorOpen, Trash } from "lucide-react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Room } from "../room.types";
import { objectToFormData } from "@/lib/utils";
import { changeRoomStatus } from "@/lib/actions/rooms";
import { toast } from "sonner";
import { useState } from "react";
import { FormValues, roomStatusSchema } from "@/lib/schemas/room-status";

export const RoomStatusForm: React.FC<{ room: Room; className?: string }> = ({
  className,
  room,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(roomStatusSchema),
    defaultValues: {
      id: room.id,
      status: room.status === "private" ? "open" : "results",
    },
  });

  const onSubmit = async (data: FormValues) => {
    const formData = objectToFormData(data);
    await changeRoomStatus(formData);
    setIsOpen(false);
    toast.success(`Room was deleted successfully`);
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button size="lg" className={className}>
          <DoorOpen />
          Change room status
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {room.status === "private" && (
                <>Are you sure you want to open the room?</>
              )}
              {room.status === "open" && (
                <>Are you sure you want to show the results?</>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {room.status === "private" && (
                <>
                  This action will make the room public and allow anyone to vote
                  on it. It cannot be undone. You will not be able to change the
                  room's details or choices after this action.
                </>
              )}
              {room.status === "open" && (
                <>
                  This action will show the results of the room to all voters.
                  It cannot be undone. Anybody that voted in the room will be
                  able to see the results.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>No, cancel</AlertDialogCancel>
            <FormSubmitButton>
              {room.status === "private"
                ? "Yes, open room"
                : "Yes, show results"}
            </FormSubmitButton>
          </AlertDialogFooter>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
