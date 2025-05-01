import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  Box, 
  Container, 
  Typography, 
  Tabs, 
  Tab, 
  Paper, 
  CircularProgress,
  Alert,
  styled,
  useTheme
} from '@mui/material';
import SecuritySettings from '../components/settings/SecuritySettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import DangerZone from '../components/settings/DangerZone';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WarningIcon from '@mui/icons-material/Warning';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Custom styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(8),
  fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
}));

const PageTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  fontWeight: 600,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(1),
}));

const PageSubtitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(3),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-2px)',
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  '& .MuiTab-root': {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 500,
    textTransform: 'none',
    minHeight: 64,
    padding: theme.spacing(0, 3),
  },
  '& .MuiTabs-indicator': {
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1),
    marginBottom: 0,
  },
}));

const TabContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '50vh',
}));

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        setLoading(true);

        // Get user data from the profile endpoint which uses the JWT token from cookies
        const response = await axios.get("/profile");

        if (!response.data) {
          navigate("/signin");
          return;
        }

        setUserData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching settings:", err);
        setError(err.response?.data?.error || "Failed to load settings");
        toast.error("Failed to load settings");

        // If unauthorized, redirect to login
        if (err.response?.status === 401) {
          navigate("/signin");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserSettings();
  }, [navigate]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleProfileUpdate = async (profileData) => {
    try {
      // The JWT token is automatically included in cookies
      const response = await axios.put("/settings/profile", profileData);

      setUserData(response.data.user);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error(err.response?.data?.error || "Failed to update profile");
    }
  };

  const handlePasswordUpdate = async (passwordData) => {
    try {
      // The JWT token is automatically included in cookies
      await axios.put("/settings/password", passwordData);

      toast.success("Password updated successfully");
    } catch (err) {
      console.error("Error updating password:", err);
      toast.error(err.response?.data?.error || "Failed to update password");
    }
  };

  const handleNotificationUpdate = async (notificationData) => {
    try {
      // The JWT token is automatically included in cookies
      const response = await axios.put(
        "/settings/notifications",
        notificationData
      );

      setUserData({
        ...userData,
        preferences: response.data.preferences,
      });
      toast.success("Notification preferences updated");
    } catch (err) {
      console.error("Error updating notifications:", err);
      toast.error(
        err.response?.data?.error || "Failed to update notification preferences"
      );
    }
  };

  const handleDeleteAccount = async (password) => {
    try {
      // The JWT token is automatically included in cookies
      await axios.delete("/settings/account", {
        data: { password },
      });

      toast.success("Account deleted successfully");
      navigate("/signin");
    } catch (err) {
      console.error("Error deleting account:", err);
      toast.error(err.response?.data?.error || "Failed to delete account");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <LoadingContainer>
          <CircularProgress size={60} thickness={4} />
        </LoadingContainer>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <StyledContainer maxWidth="md">
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: 2, 
              fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
              fontSize: '1rem'
            }}
          >
            {error}
          </Alert>
        </StyledContainer>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <StyledContainer maxWidth="md">
        <PageTitle variant="h4" component="h1">
          Account Settings
        </PageTitle>
        <PageSubtitle variant="body1">
          Manage your account settings and preferences
        </PageSubtitle>

        <StyledPaper elevation={0}>
          <StyledTabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="settings tabs"
          >
            <StyledTab 
              icon={<SecurityIcon />} 
              label="Security" 
              id="settings-tab-0"
              aria-controls="settings-tabpanel-0"
            />
            <StyledTab 
              icon={<NotificationsIcon />} 
              label="Notifications" 
              id="settings-tab-1"
              aria-controls="settings-tabpanel-1"
            />
            <StyledTab 
              icon={<WarningIcon />} 
              label="Danger Zone" 
              id="settings-tab-2"
              aria-controls="settings-tabpanel-2"
            />
          </StyledTabs>

          <TabContent
            role="tabpanel"
            hidden={activeTab !== 0}
            id="settings-tabpanel-0"
            aria-labelledby="settings-tab-0"
          >
            {activeTab === 0 && (
              <SecuritySettings onUpdate={handlePasswordUpdate} />
            )}
          </TabContent>

          <TabContent
            role="tabpanel"
            hidden={activeTab !== 1}
            id="settings-tabpanel-1"
            aria-labelledby="settings-tab-1"
          >
            {activeTab === 1 && (
              <NotificationSettings
                preferences={userData?.preferences || {}}
                onUpdate={handleNotificationUpdate}
              />
            )}
          </TabContent>

          <TabContent
            role="tabpanel"
            hidden={activeTab !== 2}
            id="settings-tabpanel-2"
            aria-labelledby="settings-tab-2"
          >
            {activeTab === 2 && (
              <DangerZone onDeleteAccount={handleDeleteAccount} />
            )}
          </TabContent>
        </StyledPaper>
      </StyledContainer>
      <Footer />
    </>
  );
};

export default Settings;