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
import AddAccountDialog from "./AddAccountDialog";
import AddUserDialog from "./AddUserDialog";

type CreateAction = "addAccount" | "addUser";

export interface CreateBtnProps {
  onSelect?: (value: CreateAction) => void;
}

export default function CreateEntityBtn({ onSelect }: CreateBtnProps) {
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