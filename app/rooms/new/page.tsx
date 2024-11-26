import RoomCreationForm from "@/components/RoomCreationForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create a new room | stimmi.app",
};

const NewRoomPage: React.FC = () => {
  return (
    <section className="max-w-md mx-auto grid gap-4">
      <h1 className="text-3xl font-bold text-center">Create a new room</h1>
      <h2 className="text-2xl font-semibold">
        What do you want to call your room?
      </h2>
      <RoomCreationForm />
    </section>
  );
};

export default NewRoomPage;
