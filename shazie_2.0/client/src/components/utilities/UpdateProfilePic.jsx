import { PencilIcon } from "@heroicons/react/outline";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function UpdateProfilePic(props) {
    const [image, setImage] = useState("");
    const navigate = useNavigate();
    const id = props.id;
    const handleProfileChange = async (e) => {
      e.preventDefault();
      try {
        const { data } = await axios.post("/updateProfilePic", { image, id });
        if (data.data) {
          toast.success("Profile pic updated");
            axios.get("/logout").then(() => {
              toast.success("logged out");
              navigate("/signin");
            });
        }
      } catch (error) {
        console.log(error);
      }
    };
  return (
    <>
      <PencilIcon
        className="w-4 h-4 text-gray-900 -ml-4"
        onClick={() => document.getElementById("my_modal_6").showModal()}
      />
      <dialog id="my_modal_6" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Upload you profile picture</h3>
          <form onSubmit={handleProfileChange}>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Pick a file</legend>
              <input
                onChange={(e) => {
                  var reader = new FileReader();
                  reader.readAsDataURL(e.target.files[0]);
                  reader.onload = () => {
                    setImage(reader.result);
                  };
                }}
                type="file"
                className="file-input"
              />
            </fieldset>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Upload
              </button>
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}

                <button className="btn">Close</button>
              </form>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
