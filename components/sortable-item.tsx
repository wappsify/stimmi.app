"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Choice } from "../choice.types";

export const SortableItem: React.FC<{ id: string; choice: Choice }> = ({
  id,
  choice,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, index } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-2 my-1 border border-gray-300 rounded bg-white shadow-sm cursor-grab"
      {...attributes}
      {...listeners}
    >
      <span className="mr-2 text-gray-500 text-sm">Rank {index + 1}:</span>{" "}
      {choice.name}
    </div>
  );
};
