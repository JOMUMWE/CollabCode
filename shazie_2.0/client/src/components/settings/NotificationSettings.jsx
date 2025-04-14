import React, { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  FormControlLabel,
  Switch,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import EmailIcon from "@mui/icons-material/Email";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const NotificationSettings = ({ preferences, onUpdate }) => {
  const [settings, setSettings] = useState({
    emailNotifications: preferences.emailNotifications !== false,
    pushNotifications: preferences.pushNotifications !== false,
    taskReminders: preferences.taskReminders !== false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setSettings({
      ...settings,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdate(settings);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Notification Preferences
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Manage how and when you receive notifications
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <List disablePadding>
          <ListItem>
            <ListItemIcon>
              <EmailIcon />
            </ListItemIcon>
            <ListItemText
              primary="Email Notifications"
              secondary="Receive notifications via email"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailNotifications}
                  onChange={handleChange}
                  name="emailNotifications"
                  color="primary"
                />
              }
              label=""
            />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText
              primary="Push Notifications"
              secondary="Receive notifications in your browser"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.pushNotifications}
                  onChange={handleChange}
                  name="pushNotifications"
                  color="primary"
                />
              }
              label=""
            />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemIcon>
              <AccessTimeIcon />
            </ListItemIcon>
            <ListItemText
              primary="Task Reminders"
              secondary="Receive reminders for upcoming tasks and deadlines"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.taskReminders}
                  onChange={handleChange}
                  name="taskReminders"
                  color="primary"
                />
              }
              label=""
            />
          </ListItem>
        </List>
      </Paper>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Preferences"}
        </Button>
      </Box>
    </Box>
  );
};

export default NotificationSettings;
