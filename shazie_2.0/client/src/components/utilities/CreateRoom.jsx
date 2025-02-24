import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4, validate } from "uuid";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useEffect } from "react";

export default function CreateRoom(props) {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState(() => false);
  const [roomId2, setRoomId2] = useState(() => false);
  const [username, setUsername] = useState(() => "");

  let allowedUser = [];

  const getroom = async () => {
    await axios.get(`/getroom/${props.teamId}`).then(({ data }) => {
      setRoomId2(data.data);
    });
  };
  useEffect(() => {
    getroom();}, []);
  async function handleRoomSubmit(e) {
    props.team.forEach((element) => {
      allowedUser.push(element.name);
    });
    e.preventDefault();
    setUsername(() => props.username);
    try {
      if(roomId2){
        if (allowedUser.includes(username)) {
          username && navigate(`/room/${roomId2}`, { state: { username } });
        } 
      }else {
      if (!validate(roomId)) {
        toast.error("Incorrect room ID");
        return;
      }
      const { data } = await axios.post("/roomcreate", {
        roomid: roomId || roomId2,
        teamid: props.teamId,
        creatorId: props.creatorId,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Room created!");
      }
      if (allowedUser.includes(username)) {
        username && navigate(`/room/${roomId}`, { state: { username } });
      } else {
        toast.error("User not allowed in room");
        return;
      }}
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } 
  }

  function createRoomId(e) {
    e.preventDefault();
    try {
      setRoomId(uuidv4());

      toast.success("Room ID created");
    } catch (exp) {
      console.error(exp);
    }
  }

  return (
    <>
      {!roomId2 ? (
        <button
          onClick={createRoomId}
          className="btn btn-sm btn-primary md:w-4/12 mt-2 sm:w-6/12"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
            />
          </svg>
          Create Room
        </button>
      ) : (
        <button
          onClick={handleRoomSubmit}
          className="btn btn-success btn-sm md:w-4/12 mt-2 sm:w-6/12 ml-5"
        >
          <div className="inline-grid *:[grid-area:1/1]">
            <div className="status status-error animate-ping"></div>
            <div className="status status-error"></div>
          </div>
          Join Room
        </button>
      )}
    </>
  );
}
