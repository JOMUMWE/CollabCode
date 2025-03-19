import { useState, useEffect } from "react";
import axios from "axios";
import EditProfBtn from "./utilities/EditProfBtn";
import UpdateProfilePic from "./utilities/UpdateProfilePic";

export default function Dash() {
  const [profilePic, setProfilePic] = useState(false);
  const [user, setUser] = useState("");
  useEffect(() => {
    if (!user) {
      axios.get("/profile").then(({ data }) => {
        setUser(data);
      });
    }
  }, []);
  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const { data } = await axios.get(`/getProfilePic/${user.id}`);
        if (data.profilePic) {
          setProfilePic(data.profilePic);
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };

    fetchProfilePic();
  }, [user.id]);
  // const handleProfileUpload = async () => {
  //   try {
  //     await axios.post("/uploadProfilePic",{ });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  return (
    <div>
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Profile
          </h1>
        </div>
      </header>
      <main>
        <div className=" mx-auto max-w-7xl flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between py-8 px-6">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="flex flex-row-reverse items-end">
              <a className="hover:cursor-pointer">
                <UpdateProfilePic id={user.id} />
              </a>
              <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full">
                <img
                  src={profilePic}
                  alt="user"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-bold text-center text-gray-800 xl:text-left">
                {user.name}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 ">{user.role}</p>
              </div>
            </div>
          </div>
          <EditProfBtn user={user} />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-800  lg:mb-6">
                Personal Information
              </h4>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-600 ">
                    Names
                  </p>
                  <p className="text-sm font-bold text-gray-800 ">
                    {user.name}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 ">
                    Email address
                  </p>
                  <p className="text-sm font-bold text-gray-800 ">
                    {user.email}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500">
                    Phone
                  </p>
                  <p className="text-sm font-bold text-gray-800 ">
                    +{user.phone}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 ">
                    Role
                  </p>
                  <p className="text-sm font-bold text-gray-800 ">
                    {user.role}
                  </p>
                </div>
              </div>
            </div>

            <EditProfBtn user={user} />
          </div>
        </div>
      </main>
    </div>
  );
}
