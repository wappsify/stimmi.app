import { createRoom } from "../lib/actions/rooms";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";

const RoomCreationForm: React.FC = () => {
  return (
    <form action={createRoom}>
      <Input type="text" name="roomName" placeholder="Room Name" />
      <SubmitButton type="submit">Create Room</SubmitButton>
    </form>
  );
};

export default RoomCreationForm;
