import { useState } from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./sortable-item";
import { Choice } from "../choice.types";

export const VotingForm: React.FC<{ choices: Choice[] }> = ({ choices }) => {
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

  return (
    <div className="grid gap-4">
      <p className="prose">
        Rank the following choices by dragging them into the order you prefer.
        The topmost choice is the one you like the most, the bottommost choice
        is the one you like the least.
      </p>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((choice) => (
            <SortableItem key={choice.id} id={choice.id} choice={choice} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};
