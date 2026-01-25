import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import React from "react";
import { useCreateUser } from "../../api/users/user.hooks";
import { CreateInputUser, Gender } from "../../types/user.types";

interface UserDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AddUserDialog ({open, onClose}: UserDialogProps) {
    const createUser = useCreateUser();
  const [errors, setErrors] = React.useState<{
    identityCard?: string;
    birthDate?: string;
    general?: string;
  }>({});

  const validateForm = (data: FormData): boolean => {
    const newErrors: { 
      identityCard?: string; 
      birthDate?: string;
      general?: string;
    } = {};

    const identityCard = data.get("identityCard") as string;
    if (identityCard.length !== 9) {
      newErrors.identityCard = "Identity card must be exactly 9 characters";
    }

    const birthDate = data.get("birthDate") as string;
    const selectedDate = new Date(birthDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      newErrors.birthDate = "Birth date cannot be in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (!validateForm(data)) {
      return;
    }

    const payload: CreateInputUser = {
      firstName: data.get("firstName") as string,
      lastName: data.get("lastName") as string,
      identityCard: data.get("identityCard") as string,
      birthDate: new Date(data.get("birthDate") as string),
      gender: data.get("gender") as Gender,
    };

    createUser.mutate(payload, {
      onSuccess: () => {
        setErrors({});
        onClose();
      },
      onError: (error: any) => {
        const errorMessage = 
          error?.response?.data?.message || 
          error?.message || 
          "Failed to create user. Please try again.";
        
        if (
          errorMessage.toLowerCase().includes("identity card") ||
          errorMessage.toLowerCase().includes("identitycard")
        ) {
          setErrors({
            identityCard: errorMessage,
          });
        } else {
          setErrors({
            general: errorMessage,
          });
        }
      },
    });
  };

  React.useEffect(() => {
    if (!open) {
      setErrors({});
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: { borderRadius: 3 },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>Add user</DialogTitle>

      <DialogContent dividers sx={{ pt: 2 }}>
        {errors.general && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.general}
          </Alert>
        )}
        
        <Box
          component="form"
          onSubmit={handleSubmit}
          id="add-user-form"
          sx={{ display: "grid", gap: 2 }}
        >
          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "1fr 1fr" }}>
            <TextField
              autoFocus
              required
              id="firstName"
              name="firstName"
              label="First name"
              type="text"
              variant="standard"
            />
            <TextField
              required
              id="lastName"
              name="lastName"
              label="Last name"
              type="text"
              variant="standard"
            />
          </Box>

          <TextField
            required
            id="identityCard"
            name="identityCard"
            label="Identity number"
            type="text"
            fullWidth
            variant="standard"
            error={!!errors.identityCard}
            helperText={errors.identityCard || "Must be exactly 9 characters"}
            inputProps={{
              maxLength: 9,
            }}
          />

          <TextField
            required
            id="birthDate"
            name="birthDate"
            label="Birth date"
            type="date"
            fullWidth
            variant="standard"
            error={!!errors.birthDate}
            helperText={errors.birthDate}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: {
                max: new Date().toISOString().split("T")[0],
              },
            }}
          />
          <FormControl fullWidth variant="standard" required>
            <InputLabel id="gender-label" shrink>
              Gender
            </InputLabel>

            <Select
              labelId="gender-label"
              id="gender"
              name="gender"
              defaultValue=""
              displayEmpty
            >
              <MenuItem value="">
                <em>Select...</em>
              </MenuItem>
              <MenuItem value={Gender.FEMALE}>Female</MenuItem>
              <MenuItem value={Gender.MALE}>Male</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          type="submit" 
          form="add-user-form" 
          variant="contained"
          disabled={createUser.isPending}
        >
          {createUser.isPending ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
)}