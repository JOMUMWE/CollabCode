import { createContext, useState, useContext, useEffect,useCallback } from "react";
import axios from "axios";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  return context;
};


export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(false);

  useEffect(() => {
      if (!user) {
        axios.get("/profile").then(({ data }) => {
          setUser(data);
        });
      }
      
    },[user]);

    
    const fetchNotifications = useCallback(async () => {
      
      try {
        setLoading(true);
        console.log("Fetching notifications for user:", user.id);
        const response = await axios.get(`/notifications/user/${user.id}`);
        setNotifications(response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      }
    },[user]);
    
    
    const fetchUnreadCount = useCallback(async () => {
      if (!user || !user.id) return;
      
      try {
        const response = await axios.get(`/notifications/unread-count/${user.id}`);
        setUnreadCount(response.data.count);
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    },[user])
    
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
    },[user,fetchNotifications,fetchUnreadCount]);

    const markAsRead = async (notificationId) => {
      try {
        await axios.put(`/notifications/read/${notificationId}`);
        
        // Update local state
        setNotifications(prevNotifications => 
        prevNotifications.data.map(notification => 
          notification._id === notificationId 
            ? { ...notification, isRead: true } 
            : notification
        )
      );
      
      fetchUnreadCount();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!user || !user.id) return;
    
    try {
      await axios.put(`/notifications/read-all/${user.id}`);
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.data.map(notification => ({ ...notification, isRead: true }))
      );
      
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
    markAllAsRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
