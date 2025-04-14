import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Avatar,
  Typography,
  Grid,
  Divider,
  IconButton,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SaveIcon from "@mui/icons-material/Save";

const ProfileSettings = ({ userData, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: userData?.name || "",
    email: userData?.email || "",
    bio: userData?.bio || "",
    profilePicture: userData?.profilePicture || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdate({
        name: formData.name,
        bio: formData.bio,
        profilePicture: formData.profilePicture,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({
        ...formData,
        profilePicture: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Profile Information
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Update your personal information and how others see you on the platform
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          sm={4}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            src={formData.profilePicture}
            alt={formData.name}
            sx={{ width: 120, height: 120, mb: 2 }}
          />
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="profile-picture-upload"
            type="file"
            onChange={handleProfilePictureChange}
          />
          <label htmlFor="profile-picture-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<PhotoCameraIcon />}
              size="small"
            >
              Change Photo
            </Button>
          </label>
        </Grid>

        <Grid item xs={12} sm={8}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                value={formData.email}
                variant="outlined"
                disabled
                helperText="Email cannot be changed"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={4}
                placeholder="Tell others a bit about yourself"
              />
            </Grid>
          </Grid>
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
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileSettings;
