import { useEffect, useState } from "react";

import type { Choice } from "../supabase/choice.types";
import { createClient } from "../supabase/client";
import type { Results } from "../supabase/results.types";

export type ResultWithChoice = Results & { choice: Choice };

export const useRealtimeResults = (roomId: string) => {
  const [results, setResults] = useState<ResultWithChoice[]>([]);
  useEffect(() => {
    const supabase = createClient();

    const fetchResults = async () => {
      const { data, error } = await supabase
        .from("results")
        .select("*")
        .eq("room_id", roomId);
      if (error) {
        console.error("Error fetching results", error);
        return;
      }

      const { data: choices, error: choicesError } = await supabase
        .from("choices")
        .select("*")
        .eq("room_id", roomId);

      if (choicesError) {
        console.error("Error fetching choices", choicesError);
        return;
      }

      const resultsWithChoices = data.map((result) => ({
        ...result,
        choice: choices.find((c) => c.id === result.choice_id) as Choice,
      }));

      const sorted = [...resultsWithChoices].sort(
        (a, b) => b.points - a.points,
      );
      setResults(sorted);
    };

    const changes = supabase
      .channel("messages-results")
      .on<Results>(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "results",
          filter: `room_id=eq.${roomId}`,
        },
        () => void fetchResults(),
      )
      .subscribe();

    void fetchResults();

    return () => {
      void supabase.removeChannel(changes);
    };
  }, [roomId]);

  return results;
};
