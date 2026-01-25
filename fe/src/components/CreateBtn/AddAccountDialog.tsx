import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import React from "react";
import { useCreateAccount } from "../../api/accounts/accounts.hooks";
import { CreateAccountInput } from "../../types/account.types";

interface AccountDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AddAccountDialog({open, onClose}: AccountDialogProps) {
const createAccount = useCreateAccount();
  const [errors, setErrors] = React.useState<{
    identifier?: string;
    general?: string;
  }>({});

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const payload: CreateAccountInput = {
      identifier: data.get("identifier") as string,
      source: data.get("source") as string,
      email: data.get("email") as string,
    };

    createAccount.mutate(payload, {
      onSuccess: () => {
        setErrors({});
        onClose();
      },
      onError: (error: any) => {
        const errorMessage = 
          error?.response?.data?.message || 
          error?.message || 
          "Failed to create account. Please try again.";
        
        if (errorMessage.toLowerCase().includes("identifier")) {
          setErrors({
            identifier: errorMessage,
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
      <DialogTitle sx={{ pb: 1 }}>Add account</DialogTitle>

      <DialogContent dividers sx={{ pt: 2 }}>
        {errors.general && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.general}
          </Alert>
        )}
        
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
            error={!!errors.identifier}
            helperText={errors.identifier || "A unique identifier for the account"}
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
        <Button 
          type="submit" 
          form="add-account-form" 
          variant="contained"
          disabled={createAccount.isPending}
        >
          {createAccount.isPending ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

