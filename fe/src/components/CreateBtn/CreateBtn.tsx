import * as React from "react";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { CreateInputUser, Gender } from "../../types/user.types";
import { useCreateUser } from "../../api/users/user.hooks";

type CreateAction = "addAccount" | "addUser";

function AddAccountDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    console.log("AddAccount payload:", payload);
    // TODO: api call
    onClose();
  };

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
      <DialogTitle sx={{ pb: 1 }}>Add account</DialogTitle>

      <DialogContent dividers sx={{ pt: 2 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          id="add-account-form"
          sx={{ display: "grid", gap: 2 }}
        >
          <TextField
            autoFocus
            required
            id="email"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            placeholder="name@example.com"
          />

          <TextField
            required
            id="identifier"
            name="identifier"
            label="Identifier"
            type="text"
            fullWidth
            variant="standard"
            helperText="A unique identifier for the account"
          />

          <TextField
            required
            id="source"
            name="source"
            label="Source"
            type="text"
            fullWidth
            variant="standard"
            placeholder="Gmail / Facebook / Apple..."
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" form="add-account-form" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function AddUserDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const createUser = useCreateUser(); 
  const [errors, setErrors] = React.useState<{
    identityCard?: string;
    birthDate?: string;
  }>({});

  const validateForm = (data: FormData): boolean => {
    const newErrors: { identityCard?: string; birthDate?: string } = {};
    
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

    createUser.mutate(payload); 
    onClose();
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
        <Button type="submit" form="add-user-form" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export interface CreateBtnProps {
  onSelect?: (value: CreateAction) => void;
}

export default function CreateBtn({ onSelect }: CreateBtnProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [modal, setModal] = React.useState<CreateAction | null>(null);

  const open = Boolean(anchorEl);
  const id = open ? "create-actions-popover" : undefined;

  const handleFabClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => setAnchorEl(null);

  const openModal = (action: CreateAction) => {
    onSelect?.(action);
    handleClosePopover();
    setModal(action);
  };

  const closeModal = () => setModal(null);

  return (
    <>
      <Fab
        color="primary"
        aria-label="create"
        onClick={handleFabClick}
        sx={{
          mr: 1.5,
          boxShadow: 4,
        }}
      >
        <AddIcon />
      </Fab>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: "center", horizontal: "left" }}
        transformOrigin={{ vertical: "center", horizontal: "right" }}
        disableAutoFocus
        disableEnforceFocus
        slotProps={{
          paper: {
            sx: {
              width: 260,
              borderRadius: 3,
              overflow: "hidden",
              backgroundColor: "rgba(25, 118, 210, 0.22)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.18)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
              color: "#fff",
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
            Create
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.75 }}>
            Choose what you want to add
          </Typography>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.18)" }} />

        <List sx={{ py: 0 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => openModal("addAccount")}
              sx={{
                py: 1.25,
                "&:hover": { backgroundColor: "rgba(255,255,255,0.12)" },
              }}
            >
              <ListItemText
                primary="Add account"
                secondary="Email + identifier + source"
                slots={{
                  primary: Typography,
                  secondary: Typography,
                }}
                slotProps={{
                  primary: { fontWeight: 700 },
                  secondary: {
                    sx: { color: "rgba(255,255,255,0.75)" },
                  },
                }}
              />
            </ListItemButton>
          </ListItem>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => openModal("addUser")}
              sx={{
                py: 1.25,
                "&:hover": { backgroundColor: "rgba(255,255,255,0.12)" },
              }}
            >
              <ListItemText
                primary="Add user"
                secondary="Personal details"
                slots={{
                  primary: Typography,
                  secondary: Typography,
                }}
                slotProps={{
                  primary: { fontWeight: 700 },
                  secondary: {
                    sx: { color: "rgba(255,255,255,0.75)" },
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Popover>

      <AddAccountDialog open={modal === "addAccount"} onClose={closeModal} />
      <AddUserDialog open={modal === "addUser"} onClose={closeModal} />
    </>
  );
}