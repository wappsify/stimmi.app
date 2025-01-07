"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { DoorOpen } from "lucide-react";
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
import { changeRoomStatus } from "@/lib/actions/rooms";
import type { FormValues } from "@/lib/schemas/room-status";
import { roomStatusSchema } from "@/lib/schemas/room-status";
import type { Choice } from "@/lib/supabase/choice.types";
import type { Room } from "@/lib/supabase/room.types";
import { objectToFormData, validateRoom } from "@/lib/utils";

import { RoomCheck } from "./room-check";

export const RoomStatusForm: React.FC<{
  room: Room;
  choices: Choice[];
  className?: string;
}> = ({ className, room, choices }) => {
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
    toast.success(`Room status was updated successfully`);
  };

  const [isOpen, setIsOpen] = useState(false);

  const t = useTranslations("room_status_form");

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button size="lg" className={className}>
          <DoorOpen />
          <span className="truncate">{t("change_room_status")}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {room.status === "private" && <>{t("open_room_confirmation")}</>}
              {room.status === "open" && (
                <>{t("calculate_results_confirmation")}</>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {room.status === "private" && <>{t("open_room_description")}</>}
              {room.status === "open" && (
                <>{t("calculate_results_description")}</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {room.status === "private" && (
            <RoomCheck room={room} choices={choices} />
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>

            <FormSubmitButton disabled={!validateRoom(room, choices)}>
              {room.status === "private"
                ? t("open_room_button")
                : t("calculate_results_button")}
            </FormSubmitButton>
          </AlertDialogFooter>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
