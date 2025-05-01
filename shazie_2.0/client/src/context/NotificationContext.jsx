import { createContext, useState, useContext, useEffect,useCallback } from "react";
import axios from "axios";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  return context;
};


export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState({ data: [] });
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(false);

  useEffect(() => {
    if (!user) {
      axios.get("/profile").then(({ data }) => {
        setUser(data);
      });
    }
  }, [user]);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await axios.get(`/notifications/user/${user.id}`);
      // Store response with data property
      setNotifications({ data: response.data });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setLoading(false);
    }
  }, [user]);

  const fetchUnreadCount = useCallback(async () => {
    if (!user || !user.id) return;

    try {
      const response = await axios.get(
        `/notifications/unread-count/${user.id}`
      );
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.id) {
      fetchNotifications();
      fetchUnreadCount();

      // Set up polling for new notifications
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 30000); // Check every 30 seconds

      return () => clearInterval(interval);
    }
  }, [user, fetchNotifications, fetchUnreadCount]);

   // Mark single notification as read
  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/notifications/read/${notificationId}`);
      
      // Update local state maintaining the data structure
      setNotifications(prevNotifications => ({
        ...prevNotifications,
        data: prevNotifications.data.map(notification => 
          notification._id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        )
      }));
      
      fetchUnreadCount();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    if (!user?.id) return;

    try {
      await axios.put(`/notifications/read-all/${user.id}`);

      // Update local state ensuring we maintain the data structure
      setNotifications((prevNotifications) => ({
        ...prevNotifications,
        data: prevNotifications.data.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      }));

      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const value = {
    notifications: notifications,
    unreadCount: unreadCount,
    loading: loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
