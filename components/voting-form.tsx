import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Choice } from "../choice.types";
import { FormValues, votingSchema } from "../lib/schemas/submit-votes";
import { Room } from "../room.types";
import { FormHiddenInputField } from "./forms/elements/form-hidden-input-field";
import { FormSubmitButton } from "./forms/elements/form-submit-button";
import { SortableItem } from "./sortable-item";
import { Form } from "./ui/form";
import { submitVotes } from "../lib/actions/votes";
import { objectToFormData } from "../lib/utils";

export const VotingForm: React.FC<{ choices: Choice[]; room: Room }> = ({
  choices,
  room,
}) => {
  const [items, setItems] = useState(choices);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(votingSchema),
    defaultValues: {
      roomId: room.id,
      choices: items.map((choice) => ({ id: choice.id })),
    },
  });

  const onSubmit = async (data: FormValues) => {
    const formData = objectToFormData(data);
    await submitVotes(formData);
    toast.success("Submitted your ranking successfully!");
  };

  return (
    <div className="grid gap-4">
      <p className="prose">
        Rank the following choices by dragging them into the order you prefer.
        The topmost choice is the one you like the most, the bottommost choice
        is the one you like the least.
      </p>
      <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((choice, index) => (
              <SortableItem key={choice.id} id={choice.id} choice={choice}>
                <FormHiddenInputField
                  name={`choices.${index}.id`}
                  control={form.control}
                />
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
        <FormSubmitButton type="submit">
          I&apos;m done ranking!
        </FormSubmitButton>
      </Form>
    </div>
  );
};