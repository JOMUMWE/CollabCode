import React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/outline';
import { Outlet } from 'react-router-dom';


const people = [
  {
    name: 'Leslie Alexander',
    role: 'Co-Founder / CEO',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  // More people...
]
const teamlist = (
  <div className="mx-auto grid max-w-7xl gap-20 px-6 lg:px-8 xl:grid-cols-3">
    <ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
      {people.map((person) => (
        <li key={person.name}>
          <div className="flex items-center gap-x-6">
            <img alt="" src={person.imageUrl} className="size-12 rounded-full" />
            <div>
              <h3 className="text-sm/7 font-semibold tracking-tight text-gray-900">{person.name}</h3>
              <p className="text-xs/6 font-semibold text-indigo-600">{person.role}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
)
export default function Teams() {
  const [active, setActive] = useState()
  return (
    <>
      <header className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Teams</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">content</div>
      </main>
      <div className="bg-white px-10 py-12 sm:py-16">
        <button className={"bg-indigo-600 flex w-32 justify-center items-center rounded-md px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600"}><PlusIcon className='w-4 h-4 mr-1' />Create Team</button>
      </div>
      <Outlet />
    </>
  )
}
