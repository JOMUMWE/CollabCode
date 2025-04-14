import { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Paper,
  Alert,
  AlertTitle,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import WarningIcon from "@mui/icons-material/Warning";

const DangerZone = ({ onDeleteAccount }) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
    setPassword("");
    setConfirmText("");
    setError("");
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError("");
  };

  const handleConfirmTextChange = (e) => {
    setConfirmText(e.target.value);
    setError("");
  };

  const handleDeleteAccount = async () => {
    // Validate confirmation text
    if (confirmText !== "DELETE") {
      setError("Please type DELETE to confirm");
      return;
    }

    // Validate password
    if (!password) {
      setError("Password is required");
      return;
    }

    setLoading(true);
    try {
      await onDeleteAccount(password);
      // If successful, the parent component will handle navigation
    } catch (err) {
      // Error handling is done in the parent component
      setLoading(false);
      handleCloseDeleteDialog();
    }
  };

  return (
    <Box>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ color: "error.main", display: "flex", alignItems: "center" }}
      >
        <WarningIcon sx={{ mr: 1 }} />
        Danger Zone
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Critical actions that cannot be undone
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Alert severity="warning" sx={{ mb: 3 }}>
        <AlertTitle>Warning</AlertTitle>
        The actions in this section are irreversible and can lead to permanent
        data loss. Please proceed with caution.
      </Alert>

      <Paper
        variant="outlined"
        sx={{
          p: 3,
          mb: 3,
          borderColor: "error.light",
          backgroundColor: "error.lightest",
          "&:hover": {
            borderColor: "error.main",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              Delete Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Permanently delete your account and all associated data
            </Typography>
          </Box>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteForeverIcon />}
            onClick={handleOpenDeleteDialog}
          >
            Delete Account
          </Button>
        </Box>
      </Paper>

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-account-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          id="delete-account-dialog-title"
          sx={{ color: "error.main" }}
        >
          Delete Account Permanently
        </DialogTitle>
        <DialogContent>
          <DialogContentText paragraph>
            This action <strong>cannot be undone</strong>. This will permanently
            delete your account and remove all your data from our servers.
          </DialogContentText>
          <DialogContentText paragraph>
            All your projects, files, and personal information will be
            permanently deleted.
          </DialogContentText>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            autoFocus
            margin="dense"
            label="Your Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={handlePasswordChange}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Type DELETE to confirm"
            fullWidth
            variant="outlined"
            value={confirmText}
            onChange={handleConfirmTextChange}
            required
            helperText="Please type DELETE in all caps to confirm"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
            disabled={loading || confirmText !== "DELETE" || !password}
            startIcon={<DeleteForeverIcon />}
          >
            {loading ? "Deleting..." : "Delete Permanently"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DangerZone;
