"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { Choice } from "@/lib/supabase/choice.types";

export const SortableItem: React.FC<{
  id: string;
  choice: Choice;
  children: React.ReactNode;
}> = ({ id, choice, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    index,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : "grab",
    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-3 border border-gray-300 rounded bg-muted shadow-sm text-sm cursor-grab focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      {...attributes}
      {...listeners}
    >
      {children}
      <span className="mr-2 text-gray-500 text-xs">Rank {index + 1}:</span>{" "}
      {choice.name}
    </div>
  );
};
