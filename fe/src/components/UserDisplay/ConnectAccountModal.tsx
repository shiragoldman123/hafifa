import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import LinkIcon from "@mui/icons-material/Link";
import { useConnect } from "../../api/users/user.hooks";
import { Account } from "../../types/account.types";
import { useGetAccounts } from "../../api/accounts/accounts.hooks";

interface ConnectAccountModalProps {
  userId: string;
  userName: string; 
}

export default function ConnectAccountModal({ userId, userName }: ConnectAccountModalProps) {
  const [open, setOpen] = React.useState(false);
  const [searchSource, setSearchSource] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState<string | null>(null);

  const connect = useConnect();

  const { data: accounts, isLoading: accountsLoading} = useGetAccounts(activeFilter)

  const uniqueSources = React.useMemo(() => {
    if (!accounts) return [];
    const sources = new Set(accounts.map((acc: Account) => acc.source));
    return Array.from(sources);
  }, [accounts]);

  const handleOpen = () => setOpen(true);
  
  const handleClose = () => {
    setOpen(false);
    setActiveFilter(null);
    setSearchSource("");
  };

  const handleConnect = (accountId: string) => {
    connect.mutate(
      { accountId, userId },
      {
        onSuccess: () => {
        },
      }
    );
  };

  const handleSearch = () => {
    if (searchSource.trim()) {
      setActiveFilter(searchSource.trim());
    }
  };

  const handleClearFilter = () => {
    setActiveFilter(null);
    setSearchSource("");
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleChipClick = (source: string) => {
    setSearchSource(source);
    setActiveFilter(source);
  };

  return (
    <>
      <Button
        size="small"
        variant="outlined"
        startIcon={<LinkIcon />}
        onClick={handleOpen}
      >
        Connect Account
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { height: '80vh' }
        }}
      >
        <DialogTitle>
          Connect Account to {userName}
        </DialogTitle>

        <DialogContent>
          <Box sx={{ mb: 3, mt: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by source (e.g., Gmail, Facebook, Apple...)"
              value={searchSource}
              onChange={(e) => setSearchSource(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: activeFilter && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleClearFilter}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ alignSelf: "center", mr: 1 }}>
                Quick filters:
              </Typography>
              {uniqueSources.map((source) => (
                <Chip
                  key={source}
                  label={source}
                  size="small"
                  onClick={() => handleChipClick(source)}
                  color={activeFilter === source ? "primary" : "default"}
                  variant={activeFilter === source ? "filled" : "outlined"}
                />
              ))}
              {activeFilter && (
                <Chip
                  label="Show All"
                  size="small"
                  onClick={handleClearFilter}
                  color="secondary"
                  variant="outlined"
                />
              )}
            </Box>

            {activeFilter && (
              <Typography variant="body2" color="text.secondary">
                Showing accounts from: <strong>{activeFilter}</strong>
              </Typography>
            )}
          </Box>

          {accountsLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : !accounts || accounts.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="body1" color="text.secondary">
                {activeFilter
                  ? `No accounts found for source: ${activeFilter}`
                  : "No accounts found"}
              </Typography>
            </Paper>
          ) : (
            <Box sx={{ maxHeight: '50vh', overflowY: 'auto' }}>
              {accounts.map((account: Account) => {
                const isConnected = !!account.user;
                const isConnectedToThisUser = account.user === userId;
                
                return (
                  <Paper
                    key={account._id}
                    elevation={1}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 2,
                      mb: 2,
                      bgcolor: isConnectedToThisUser ? "action.selected" : "background.paper",
                      border: isConnectedToThisUser ? "2px solid" : "none",
                      borderColor: isConnectedToThisUser ? "primary.main" : "transparent",
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" fontWeight={600}>
                        {account.source}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Identifier:</strong> {account.identifier}
                      </Typography>
                      {account.email && (
                        <Typography variant="body2" color="text.secondary">
                          <strong>Email:</strong> {account.email}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ ml: 2 }}>
                      {isConnectedToThisUser ? (
                        <Chip
                          label="Connected to this user"
                          color="primary"
                          size="small"
                        />
                      ) : isConnected ? (
                        <Chip
                          label="Connected to another user"
                          color="default"
                          size="small"
                          variant="outlined"
                        />
                      ) : (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleConnect(account._id)}
                          disabled={connect.isPending}
                        >
                          Connect
                        </Button>
                      )}
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} variant="contained">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}