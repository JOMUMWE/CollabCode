import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/outline";
import { Outlet } from "react-router-dom";
import Avatar from "./utilities/Avatar";
import TeamsForm from "./TeamsForm";

export default function Teams() {
  const [teamData, setTeamData] = useState("");
  const [user, setUser] = useState(false);
  useEffect(() => {
    if (!user) {
      axios.get("/profile").then(({ data }) => {
        setUser(data);
      });
    }
  }, []);
  const [active, setActive] = useState(true);
  const people = [
    {
      name: "Leslie Alexander",
      role: "Co-Founder / CEO",
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    // More people...
  ];
  const teamlist = (
    <div className="mx-auto grid max-w-7xl gap-20 px-6 lg:px-8 xl:grid-cols-3">
      <ul
        role="list"
        className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2"
      >
        {people.map((person) => (
          <li key={person.name}>
            <div className="flex items-center gap-x-6">
              <img
                alt=""
                src={person.imageUrl}
                className="size-12 rounded-full"
              />
              <div>
                <h3 className="text-sm/7 font-semibold tracking-tight text-gray-900">
                  {person.name}
                </h3>
                <p className="text-xs/6 font-semibold text-indigo-600">
                  {person.role}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
  useEffect(() => {
    axios
      .get(`/teams/${user.id}`)
      .then((response) => {
        console.log(response);
        setTeamData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
      });
  }, []);
  return (
    <>
      <header className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Teams
          </h1>
        </div>
      </header>
      <main className="bg-white ">
        {teamData.length > 0 ? (
          teamData.map((team) => (
            <>
              <ul className="md:w-2/6 sm:w-4/6 list bg-base-100 rounded-box shadow-md ml-7 mr-7">
                <li className="list-row">
                  <div>
                    <Avatar />
                  </div>
                  <div>
                    <div>{team.name}</div>
                    <div className="text-xs uppercase font-semibold opacity-60">
                      {team.createdBy}
                    </div>
                  </div>
                </li>
              </ul>
            </>
          ))
        ) : (
          <li className="p-3 text-center text-gray-500">No teams found</li>
        )}
      </main>
      <div className="bg-white px-10 py-6 sm:py-16">
        <button
          onClick={() => {
            setActive(!active);
          }}
          className={
            active
              ? "bg-indigo-600 flex w-32 justify-center items-center rounded-md px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600"
              : "bg-indigo-400 flex w-40 justify-center items-center rounded-md px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600"
          }
        >
          {active ? (
            <PlusIcon className="w-4 h-4 mr-1" />
          ) : (
            <span className="loading loading-infinity loading-xs mr-2"></span>
          )}
          {active ? "Create Team" : "Creating a team"}
        </button>
      </div>
      {active ? "" : <TeamsForm fun={setActive} act={active} />}
      <Outlet />
    </>
  );
}
