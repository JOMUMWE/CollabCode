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
        {team.length > 0 ? (
          team.map((teamItem) => (
            <>
              <ul className="md:w-2/6 sm:w-4/6 list bg-base-100 rounded-box shadow-md ml-7 mr-7 mt-5 dropdown md:dropdown-right dropdown-bottom">
                <li
                  key={teamItem._id || teamItem.teamName}
                  className="list-row"
                >
                  <div>
                    <Avatar length={teamItem.members.length} />
                  </div>
                  <div>
                    <div>{teamItem.teamName}</div>
                    <div className="text-xs uppercase font-semibold opacity-60">
                      {teamItem.createdBy.name || "Unknown Creator"}
                    </div>
                  </div>
                  <div tabIndex={0} role="button" className="btn m-1">
                    details
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box z-[1] md:w-[35vw] sm:w-[80vw] p-2 shadow md:ml-5 mt-2"
                  >
                    <div className="flex justify-between">
                      <div className="badge badge-accent ml-2 badge-sm">
                        Members
                      </div>
                      <div className="badge badge-primary mr-2 badge-sm">
                        {teamItem.teamName}
                      </div>
                    </div>
                    {/* <MemberTable members={team.members} /> */}
                    <div className="overflow-x-auto">
                      <table className="table table-zebra text-xs">
                        {/* head */}
                        <thead>
                          <tr>
                            <th></th>
                            <th>Name</th>
                            <th>email</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {teamItem.members.length > 0 ? (
                            teamItem.members.map((member) => (
                              <>
                                <tr>
                                  <th></th>
                                  <td>{member.name}</td>
                                  <td>{member.email}</td>
                                  <td>
                                    <button className="btn btn-sm hover:text-red-400">
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
                              </>
                            ))
                          ) : (
                            <></>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex flex-row justify-end">
                      <CreateRoom username={username} team={teamItem.members} />
                    </div>
                  </ul>
                </li>
              </ul>
            </>
          ))
        ) : (
          <p className="text-center text-gray-500">No teams available</p>
        )}
      </main>
      <div className="bg-white mx-auto md:py-10 sm:py-16 max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
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
