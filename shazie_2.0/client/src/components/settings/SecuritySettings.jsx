import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Divider,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";

const SecuritySettings = ({ onUpdate }) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const validateForm = () => {
    if (!formData.currentPassword) {
      setError("Current password is required");
      return false;
    }
    if (!formData.newPassword) {
      setError("New password is required");
      return false;
    }
    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onUpdate({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      // Reset form on success
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      // Error handling is done in the parent component
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Security Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Update your password and manage account security
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Current Password"
            name="currentPassword"
            type={showCurrentPassword ? "text" : "password"}
            value={formData.currentPassword}
            onChange={handleChange}
            variant="outlined"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    edge="end"
                  >
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="New Password"
            name="newPassword"
            type={showNewPassword ? "text" : "password"}
            value={formData.newPassword}
            onChange={handleChange}
            variant="outlined"
            required
            helperText="Password must be at least 8 characters long"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Confirm New Password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            variant="outlined"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </Button>
      </Box>
    </Box>
  );
};

export default SecuritySettings;
