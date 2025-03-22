"use client";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


import { useState, useEffect } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
// import { Bars3Icon, XIcon } from '@heroicons/react/outline'
import png from "../assets/codecollab-high-resolution-logo-grayscale-transparent.png";
import axios from "axios";


export default function NAV() {
    const navigation = [
      { name: "Product", href: "#" },
      { name: "Features", href: "#features" },
      { name: "Marketplace", href: "#" },
      { name: "Company", href: "#" },
    ];
    const [profilePic, setProfilePic] = useState(false);
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
    });
    const navigate = useNavigate();
    const [user, setUser] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const getprofile = () => {
      try {
        if (!user) {
          axios.get("/profile").then(({ data }) => {
            setUser(data);
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    getprofile();
    const logoutUser = () => {
      try {
        axios.get("/logout").then(() => {
          toast.success("logged out");
          navigate("/signin");
        });
      } catch (error) {
        console.log(error);
      }
    };
  return (
    <header className="absolute inset-x-0 top-0 z-50">
              <nav
                aria-label="Global"
                className="flex items-center justify-between p-6 lg:px-8"
              >
                <div className="flex lg:flex-1">
                  <a href="/" className="-m-1.5 p-1.5">
                    <span className="sr-only">CollabCode</span>
                    <img alt="" src={png} className="h-8 w-auto" />
                  </a>
                </div>
                <div className="flex lg:hidden">
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(true)}
                    className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                  >
                    <span className="sr-only">Open main menu</span>
                    {/* <Bars3Icon aria-hidden="true" className="size-6" /> */}
                  </button>
                </div>
                {/* <div className="hidden lg:flex lg:gap-x-12">
                  {navigation.map((item) => (
                    <a key={item.name} href={item.href} className="text-sm/6 font-semibold text-gray-900">
                      {item.name}
                    </a>
                  ))}
                </div> */}
                {user ? (
                  <div>
                    <Menu as="div" className="relative ml-3">
                      <div className="flex justify-between items-center">
                        <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden hover:cursor-pointer">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          <img
                            alt=""
                            src={profilePic}
                            className="size-8 rounded-full object-cover "
                          />
                        </MenuButton>
                        <p className=" text-xs text-black ml-2">{user.name}</p>
                      </div>
                      <MenuItems
                        transition
                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                      >
                        <MenuItem>
                          <a
                            href="/dashboard/dash"
                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                          >
                            Dashboard
                          </a>
                        </MenuItem>
                        <MenuItem>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                          >
                            Settings
                          </a>
                        </MenuItem>
                        <MenuItem>
                          <a
                            onClick={logoutUser}
                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                          >
                            Sign out
                          </a>
                        </MenuItem>
                      </MenuItems>
                    </Menu>
                  </div>
                ) : (
                  <div className=" lg:flex lg:flex-1 lg:justify-end">
                    <a
                      href="/signin"
                      className="text-sm/6 font-semibold text-gray-900"
                    >
                      Log in <span aria-hidden="true">&rarr;</span>
                    </a>
                  </div>
                )}
              </nav>
              <Dialog
                open={mobileMenuOpen}
                onClose={setMobileMenuOpen}
                className="lg:hidden"
              >
                <div className="fixed inset-0 z-50" />
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                  <div className="flex items-center justify-between">
                    <a href="/" className="-m-1.5 p-1.5">
                      <span className="sr-only">Your Company</span>
                      <img alt="" src={png} className="h-8 w-auto" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setMobileMenuOpen(false)}
                      className="-m-2.5 rounded-md p-2.5 text-gray-700"
                    >
                      <span className="sr-only">Close menu</span>
                      {/* <XIcon aria-hidden="true" className="size-6" /> */}
                    </button>
                  </div>
                  <div className="mt-6 flow-root">
                    <div className="-my-6 divide-y divide-gray-500/10">
                      <div className="space-y-2 py-6">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                      <div className="py-6">
                        <a
                          href="/signin"
                          className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                        >
                          Log in
                        </a>
                      </div>
                    </div>
                  </div>
                </DialogPanel>
              </Dialog>
            </header>
  )
}
