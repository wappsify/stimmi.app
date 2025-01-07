"use client";

import type { User } from "@supabase/supabase-js";
import { LoaderPinwheel } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Choice } from "@/lib/supabase/choice.types";
import { useRealtimeResults } from "../lib/hooks/useRealtimeResults";
import { useRealtimeRoom } from "../lib/hooks/useRealtimeRoom";
import type { Room } from "@/lib/supabase/room.types";
import type { RoomUser } from "@/lib/supabase/room_user.types";
import { ActiveUsersText } from "./active-users-text";
import { RoomStatusForm } from "./RoomStatusForm";
import { ShowResults } from "./show-results";
import { useTranslations } from "next-intl";

const MotionPinwheel = motion.create(LoaderPinwheel);
export const ResultsView: React.FC<{
  room: Room;
  roomUsers: RoomUser[];
  choices: Choice[];
  user: User;
}> = ({ room: serverRoom, roomUsers, choices, user }) => {
  const room = useRealtimeRoom(serverRoom);
  const results = useRealtimeResults(room.id);
  const t = useTranslations("results");

  return (
    <>
      {room.user_id === user.id && room.status === "open" && (
        <div className="grid gap-4 mb-6">
          <p className="text-sm text-center">{t("close_room_to_calculate")}</p>
          <RoomStatusForm room={room} choices={choices} />
        </div>
      )}
      <div className="grid gap-4">
        <AnimatePresence mode="wait">
          {room.status === "open" ? (
            <>
              <motion.div
                key="open-active-users"
                exit={{ scale: 0, opacity: 0 }}
              >
                <ActiveUsersText roomUsers={roomUsers} roomId={room.id} />
              </motion.div>
              <MotionPinwheel
                key="open-icon"
                className="size-20 animate-spinSlow text-slate-400 place-self-center"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              />
              <motion.p
                key="open"
                className="text-center text-sm"
                exit={{ scale: 0, opacity: 0 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                {t("waiting_for_owner")}
              </motion.p>
            </>
          ) : (
            <ShowResults
              results={results}
              showResultsInitially={serverRoom.status === "results"}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
