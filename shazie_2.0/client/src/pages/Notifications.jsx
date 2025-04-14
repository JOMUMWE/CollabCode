import { useState, useEffect } from "react";
import { useNotifications } from "../context/NotificationContext";
import { format } from "date-fns";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Notifications() {
  const { notifications, loading, markAsRead, markAllAsRead } =
    useNotifications();
  const [filter, setFilter] = useState("all"); // "all", "unread", "read"
  // Check if notifications exist and has data array
  const notificationsList = notifications?.data || [];

  const filteredNotifications = notificationsList.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.isRead;
    if (filter === "read") return notification.isRead;
    return true;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case "WELCOME":
        return (
          <div className="flex-shrink-0 rounded-full bg-blue-100 p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case "TEAM_ADDED":
        return (
          <div className="flex-shrink-0 rounded-full bg-green-100 p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          </div>
        );
      case "TASK_ASSIGNED":
        return (
          <div className="flex-shrink-0 rounded-full bg-purple-100 p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-purple-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case "PROJECT_CREATED":
        return (
          <div className="flex-shrink-0 rounded-full bg-yellow-100 p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
                clipRule="evenodd"
              />
              <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 rounded-full bg-gray-100 p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </div>
        );
    }
  };

  const formatNotificationTime = (date) => {
    return format(new Date(date), "MMMM d, yyyy 'at' h:mm a");
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">
                Notifications
              </h1>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <label htmlFor="filter" className="sr-only">
                    Filter notifications
                  </label>
                  <select
                    id="filter"
                    name="filter"
                    className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                  </select>
                </div>
                <button
                  onClick={markAllAsRead}
                  className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Mark all as read
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {loading ? (
                <div className="flex justify-center py-12">
                  <svg
                    className="animate-spin h-8 w-8 text-indigo-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="py-12 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No notifications
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {filter === "all"
                      ? "You don't have any notifications yet."
                      : filter === "unread"
                      ? "You don't have any unread notifications."
                      : "You don't have any read notifications."}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`px-6 py-4 ${
                      !notification.isRead ? "bg-indigo-50" : ""
                    }`}
                  >
                    <div className="flex items-start">
                      {getNotificationIcon(notification.type)}
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.type.replace(/_/g, " ")}
                          </p>
                          <div className="flex items-center">
                            <p className="text-sm text-gray-500">
                              {formatNotificationTime(notification.createdAt)}
                            </p>
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead(notification._id)}
                                className="ml-4 text-xs font-medium text-indigo-600 hover:text-indigo-500"
                              >
                                Mark as read
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          {notification.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {filteredNotifications.length > 0 && (
              <div className="border-t border-gray-200 px-6 py-4 text-center text-sm text-gray-500">
                Showing {filteredNotifications.length} of {notifications.length}{" "}
                notifications
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
