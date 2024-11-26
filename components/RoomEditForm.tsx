"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/ui/submit-button";
import { toast } from "sonner";
import { updateRoom } from "@/lib/actions/rooms";
import { Room } from "../room.types";

const RoomEditForm: React.FC<{ room: Room }> = ({ room }) => {
  const handleSubmit = async (formData: FormData) => {
    await updateRoom(formData);
    toast.success("Room was updated successfully");
  };

  return (
    <form action={handleSubmit}>
      <input type="hidden" name="id" value={room.id} />
      <div>
        <Input
          type="text"
          id="name"
          name="name"
          defaultValue={room.name}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <Textarea
          id="description"
          name="description"
          defaultValue={room.description}
          required
        />
      </div>
      <SubmitButton type="submit">Save Changes</SubmitButton>
    </form>
  );
};

export default RoomEditForm;
