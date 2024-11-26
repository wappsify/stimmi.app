import { createRoom } from "@/lib/actions/rooms";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const RoomCreationForm: React.FC = () => {
  const handleSubmit = async (formData: FormData) => {
    await createRoom(formData);
    toast.success("Room was created successfully");
  };

  return (
    <form action={handleSubmit}>
      <Input type="text" name="name" placeholder="Room Name" />
      <SubmitButton type="submit">Create Room</SubmitButton>
    </form>
  );
};

export default RoomCreationForm;
