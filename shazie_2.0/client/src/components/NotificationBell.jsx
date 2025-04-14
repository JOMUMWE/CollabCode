import { useState, useRef, useEffect } from "react";
import { useNotifications } from "../context/NotificationContext";
import { format } from "date-fns";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead ,
  } = useNotifications();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    // Handle navigation based on notification type
    // This can be expanded based on your app's needs
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "WELCOME":
        return (
          <div className="flex-shrink-0 rounded-full bg-blue-100 p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-600"
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
          <div className="flex-shrink-0 rounded-full bg-green-100 p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          </div>
        );
      case "TASK_ASSIGNED":
        return (
          <div className="flex-shrink-0 rounded-full bg-purple-100 p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-purple-600"
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
          <div className="flex-shrink-0 rounded-full bg-yellow-100 p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-600"
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
          <div className="flex-shrink-0 rounded-full bg-gray-100 p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
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
    return format(new Date(date), "MMM d, h:mm a");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative p-1 text-gray-600 hover:text-gray-900 focus:outline-none"
        aria-label="Notifications"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <div className="flex items-center justify-between border-b px-4 py-2">
              <h3 className="text-sm font-medium text-gray-900">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-4">
                  <svg
                    className="h-5 w-5 animate-spin text-indigo-600"
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
              ) : notifications.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-gray-500">
                  No notifications yet
                </div>
              ) : (
                notifications.data.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`cursor-pointer border-b px-4 py-3 transition hover:bg-gray-50 ${
                      !notification.isRead ? "bg-indigo-50" : ""
                    }`}
                  >
                    <div className="flex items-start">
                      {getNotificationIcon(notification.type)}
                      <div className="ml-3 flex-1">
                        <p className="text-sm text-gray-900">
                          {notification.content}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {formatNotificationTime(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <span className="ml-2 h-2 w-2 flex-shrink-0 rounded-full bg-indigo-600"></span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t px-4 py-2">
              <a
                href="/notifications"
                className="block text-center text-xs font-medium text-indigo-600 hover:text-indigo-500"
              >
                View all notifications
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
