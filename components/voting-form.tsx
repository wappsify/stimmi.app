import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Choice } from "../choice.types";
import { submitVotes } from "../lib/actions/votes";
import { FormValues, votingSchema } from "../lib/schemas/submit-votes";
import { objectToFormData } from "../lib/utils";
import { Room } from "../room.types";
import { FormHiddenInputField } from "./forms/elements/form-hidden-input-field";
import { FormSubmitButton } from "./forms/elements/form-submit-button";
import { SortableItem } from "./sortable-item";
import { Form } from "./ui/form";
import { Separator } from "./ui/separator";

export const VotingForm: React.FC<{ choices: Choice[]; room: Room }> = ({
  choices,
  room,
}) => {
  const t = useTranslations("voting_section");
  const [items, setItems] = useState(choices);

  const form = useForm<FormValues>({
    resolver: zodResolver(votingSchema),
    defaultValues: {
      roomId: room.id,
      choices: items.map((choice, index) => ({ id: choice.id, rank: index })),
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over?.id);
      const newOrder = arrayMove(items, oldIndex, newIndex);

      setItems(newOrder);

      form.setValue(
        "choices",
        newOrder.map((choice, index) => ({ id: choice.id, rank: index })),
        { shouldDirty: true, shouldTouch: true }
      );
    }
  };

  const onSubmit = async (data: FormValues) => {
    const formData = objectToFormData(data);
    await submitVotes(formData);
    toast.success(t("submit_success"));
  };

  return (
    <div className="grid gap-4">
      <p className="prose">{t("rank_instructions")}</p>
      <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToWindowEdges]}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((choice, index) => (
              <SortableItem key={choice.id} id={choice.id} choice={choice}>
                <FormHiddenInputField
                  name={`choices.${index}.id`}
                  control={form.control}
                />
                <FormHiddenInputField
                  name={`choices.${index}.rank`}
                  control={form.control}
                />
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
        <Separator className="my-4" />
        <FormSubmitButton type="submit">{t("submit_ranking")}</FormSubmitButton>
      </Form>
    </div>
  );
};
