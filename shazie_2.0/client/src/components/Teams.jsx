import { useState } from "react";
import { PlusIcon } from "@heroicons/react/outline";
import { Outlet } from "react-router-dom";
import Avatar from "./utilities/Avatar";
import TeamsForm from "./TeamsForm";
import CreateRoom from "./utilities/CreateRoom";

export default function Teams(props) {
  const [active, setActive] = useState(true);
  const team = Array.isArray(props.team) ? props.team : [];
  const username = props.user;
  return (
    <>
      <header className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Teams
          </h1>
        </div>
      </header>
      <main className="bg-white mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.length > 0 ? (
            team.map((teamItem) => (
              <div key={teamItem._id || teamItem.teamName} className="w-full">
                <ul className="list bg-base-100 rounded-box shadow-md hover:shadow-lg transition-shadow duration-200">
                  <li className="list-row p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="flex-shrink-0">
                        <Avatar
                          members={teamItem.members}
                          length={teamItem.members.length}
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="text-sm font-medium truncate">
                          {teamItem.teamName}
                        </div>
                        <div className="text-xs uppercase font-semibold text-gray-500 truncate">
                          {teamItem.createdBy.name || "Unknown Creator"}
                        </div>
                      </div>
                    </div>
                    
                    <div className="dropdown dropdown-center w-full sm:w-auto">
                      <button tabIndex={0} className="btn btn-sm w-full sm:w-auto">
                        details
                      </button>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-[90vw] md:w-[40vw] sm:w-[60vw] p-4 shadow mt-2"
                      >
                        <div className="flex justify-between mb-4">
                          <div className="badge badge-accent badge-sm">
                            Members
                          </div>
                          
                        </div>
                        
                        <div className="overflow-x-auto">
                          <table className="table table-zebra text-xs w-full">
                            <thead>
                              <tr>
                                <th className="w-1/12"></th>
                                <th className="w-4/12">Name</th>
                                <th className="w-5/12">Email</th>
                                <th className="w-2/12"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {teamItem.members.length > 0 ? (
                                teamItem.members.map((member, index) => (
                                  <tr key={member.email || index}>
                                    <th></th>
                                    <td className="truncate max-w-[150px]">
                                      {member.name}
                                    </td>
                                    <td className="truncate max-w-[200px]">
                                      {member.email}
                                    </td>
                                    <td>
                                      <button className="btn btn-sm btn-ghost hover:text-red-400">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth={1.5}
                                          stroke="currentColor"
                                          className="size-4"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                          />
                                        </svg>
                                      </button>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="4" className="text-center">
                                    No members
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                        
                        <div className="flex justify-center mt-4">
                          <CreateRoom
                            username={username}
                            team={teamItem.members}
                            teamId={teamItem._id}
                            creatorId={teamItem.createdBy._id}
                            roomId={teamItem.roomId}
                          />
                        </div>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <p className="text-center text-gray-500">No teams available</p>
            </div>
          )}
        </div>
      </main>

      <div className="bg-white mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {active ? "" : <TeamsForm fun={setActive} act={active} />}
        <button
          onClick={() => {
            setActive(!active);
          }}
          className={`flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-200 ${
            active
              ? "bg-indigo-600 hover:bg-indigo-500"
              : "bg-indigo-400 cursor-wait"
          }`}
        >
          {active ? (
            <PlusIcon className="w-4 h-4 mr-2" />
          ) : (
            <span className="loading loading-infinity loading-xs mr-2"></span>
          )}
          {active ? "Create Team" : "Creating a team"}
        </button>
      </div>

      <Outlet />
    </>
  );
}
