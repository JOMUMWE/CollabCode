import { ChevronDownIcon } from "@heroicons/react/solid";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function EditProfBtn(props) {
  const navigate = useNavigate();
  const name = props.user.name;
  const email = props.user.email;
  const phone = props.user.phone;
  const role = props.user.role;
  const [formData, setFormData] = useState({
    name: name,
    email: email,
    phone: phone,
    role: role,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    
    e.preventDefault();
    const { name, email, phone, role} = formData;

    try {
      const { data } = await axios.post("/updateUser", {
        id : props.user.id,
        name: name,
        email: email,
        phone : phone,
        role : role,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        setFormData({});
        toast.success(data.data);
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
      <button
        onClick={() => document.getElementById("my_modal_5").showModal()}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800  lg:inline-flex lg:w-auto"
      >
        <svg
          className="fill-current"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
            fill=""
          />
        </svg>
        Edit
      </button>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box w-[70vw]">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col w-full">
            <div className="custom-scrollbar h-[40vh] overflow-y-auto px-2 pb-3">
              <div></div>
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <label htmlFor="name">Names</label>
                    <input
                      id="name"
                      name="name"
                      placeholder="your name"
                      className="input input-bordered w-full max-w-xs"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      name="email"
                      placeholder="your email"
                      className="input input-bordered w-full max-w-xs"
                      type="text"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      id="phone"
                      name="phone"
                      placeholder="Type here"
                      className="input input-bordered w-full max-w-xs"
                      value={formData.phone}
                      type="tel"
                      pattern="[0-9]{10}"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <label htmlFor="role">Role</label>
                    <div className="mt-2 grid grid-cols-1">
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        autoComplete="country-name"
                        className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 outline"
                      >
                        <option value="Team Manager">Team Manager</option>
                        <option value="Junior Developer">
                          Junior Developer
                        </option>
                        <option value="Senior Developer">Senior Develop</option>
                      </select>
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <form method="dialog">
                {/* if there is a button, it will close the modal */}
                <button className="btn btn-warning">Close</button>
              </form>
              <button type="submit" className="btn btn-success" size="sm">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
