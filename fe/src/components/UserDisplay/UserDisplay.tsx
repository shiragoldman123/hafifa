import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import { useUsers, useSearchUsers } from "../../api/users/user.hooks";
import { PopulatedUser } from "../../types/user.types";
import MenuItem from "@mui/material/MenuItem";
import AccountsSection from "./AccountsSection";
import ConnectAccountModal from "./ConnectAccountModal";
import InputAdornment from "@mui/material/InputAdornment";

export default function UserDisplay() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Search state
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState<string | null>(null);

  // Pagination query
  const apiParams = useMemo(() => ({ page, limit }), [page, limit]);
  const { data: paginatedData, isPending, isFetching, isError, error } = useUsers(apiParams);

  const { data: searchResults, isLoading: isSearchLoading } = useSearchUsers(activeSearch);

  const isSearchActive = !!activeSearch;

  let displayUsers: PopulatedUser[] = [];
  let totalPages = 1;

  if (isSearchActive) {
    displayUsers = searchResults ?? [];
    totalPages = 1; 
  } else {
    displayUsers = paginatedData?.data ?? [];
    totalPages = paginatedData?.totalPages ?? 1;
  }

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleSearch = () => {
    if (!searchInput.trim()) {
      return;
    }
    setActiveSearch(searchInput.trim());
    setExpandedId(null);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setActiveSearch(null);
    setExpandedId(null);
    setPage(1);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Search Section */}
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3 }}>
        <TextField
          label="Search Users"
          size="small"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Search by name, identifier, or source..."
          sx={{ minWidth: 350 }}
          slotProps={{
            input: {
              endAdornment: activeSearch && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleClearSearch}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={handleSearch}
          disabled={!searchInput.trim()}
        >
          Search
        </Button>

        {activeSearch && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClearSearch}
          >
            Clear
          </Button>
        )}
      </Box>

      {activeSearch && (
        <Alert severity="info" sx={{ mb: 2, width: "80%" }}>
          Showing results for: "<strong>{activeSearch}</strong>"
        </Alert>
      )}

      <Paper sx={{ width: "80%", p: 2 }}>
        {!isSearchActive && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                variant="outlined"
                disabled={page <= 1 || isFetching}
                onClick={() => {
                  setExpandedId(null);
                  setPage((p) => Math.max(1, p - 1));
                }}
              >
                Prev
              </Button>

              <Typography variant="body2">
                Page {page} / {totalPages} {isFetching ? "(Updating…)" : ""}
              </Typography>

              <Button
                variant="outlined"
                disabled={page >= totalPages || isFetching}
                onClick={() => {
                  setExpandedId(null);
                  setPage((p) => Math.min(totalPages, p + 1));
                }}
              >
                Next
              </Button>
            </Stack>

            <TextField
              select
              label="Page size"
              size="small"
              value={limit}
              onChange={(e) => {
                setExpandedId(null);
                setPage(1);
                setLimit(Number(e.target.value));
              }}
              sx={{ width: 140 }}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
            </TextField>
          </Box>
        )}

        {isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error?.message ?? "Failed to load users"}
          </Alert>
        )}

        {(isPending && !isSearchActive) || isSearchLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={2}>
            {displayUsers.map((user) => {
              const id = String(user._id);
              const isOpen = expandedId === id;

              const birth = user.birthDate
                ? new Date(user.birthDate).toLocaleDateString()
                : "-";

              return (
                <Card key={id} variant="outlined">
                  <CardHeader
                    title={`${user.firstName} ${user.lastName}`}
                    subheader={`ID: ${user.identityCard} • Birth: ${birth} • Gender: ${user.gender}`}
                    action={
                      <IconButton
                        onClick={() => toggle(id)}
                        aria-label={isOpen ? "Collapse" : "Expand"}
                      >
                        {isOpen ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    }
                  />
                  <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                        <Typography variant="subtitle2">Accounts</Typography>
                        <ConnectAccountModal
                          userId={user._id}
                          userName={`${user.firstName} ${user.lastName}`}
                        />
                      </Box>
                      <AccountsSection
                        accounts={user.accounts}
                        userId={user._id}
                      />
                    </CardContent>
                  </Collapse>
                </Card>
              );
            })}

            {displayUsers.length === 0 && !isError && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                {isSearchActive ? "No users found matching your search." : "No users found."}
              </Typography>
            )}
          </Stack>
        )}
      </Paper>
    </Box>
  );
}