import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function CreateRoom(props) {
  const navigate = useNavigate();
  const [username, setUsername] = useState(props.username);

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    const team = Array.isArray(props.team) ? props.team : [];
    const allowedUser = team.map((member) => member.name);

    if (allowedUser.includes(username)) {
      if (props.roomId) {
        navigate(`/room/${props.roomId}`, { state: { username } });
      } else {
        toast.error("room id invalid")
      }
    } else {
      toast.error("User not allowed in room");
    }
  };

  // const createRoomId = async () => {
  //   setCreating(true);
  //   const newRoomId = props.roomId;

  //   try {
  //     const { data } = await axios.post("/roomcreate", {
  //       roomid: newRoomId,
  //       teamid: props.teamId,
  //       creatorId: props.creatorId,
  //     });

  //     if (data.error) {
  //       toast.error(data.error);
  //     } else {
  //       toast.success("Room created!");
  //       navigate(`/room/${newRoomId}`, { state: { username } });
  //     }
  //   } catch (error) {
  //     console.error("Error creating room:", error);
  //     toast.error("Something went wrong!");
  //   } finally {
  //     setCreating(false);
  //   }
  // };

  return (
    <button
      onClick={handleRoomSubmit}
      className="btn btn-success btn-sm md:w-4/12 mt-2 sm:w-6/12 ml-5"
    >
          <div className="inline-grid *:[grid-area:1/1]">
            <div className="status status-error animate-ping"></div>
            <div className="status status-error"></div>
          </div>
          Join RooM
    </button>
  );
}
