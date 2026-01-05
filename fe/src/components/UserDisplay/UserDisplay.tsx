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
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { useUsers } from "../../api/users/user.hooks";
import { PopulatedUser } from "../../types/user.types";
import MenuItem from "@mui/material/MenuItem";

function AccountsSection({ accounts }: { accounts: any[] }) {
  if (!accounts || accounts.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ pt: 1 }}>
        No accounts
      </Typography>
    );
  }

  return (
    <Stack spacing={1} sx={{ pt: 1 }}>
      {accounts.map((acc, idx) => (
        <Box key={acc._id ?? idx}>
          <Typography variant="body2">
            <b>Source:</b> {acc.source ?? "-"}{" "}
            <b style={{ marginLeft: 8 }}>Identifier:</b> {acc.identifier ?? "-"}
          </Typography>
          {acc.email && (
            <Typography variant="body2">
              <b>Email:</b> {acc.email}
            </Typography>
          )}
          {idx < accounts.length - 1 && <Divider sx={{ mt: 1 }} />}
        </Box>
      ))}
    </Stack>
  );
}

export default function UserDisplay() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const apiParams = useMemo(() => ({ page, limit }), [page, limit]);
  const { data, isPending, isFetching, isError, error } = useUsers(apiParams);

  const users: PopulatedUser[] = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
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
      <Box sx={{ display: "flex", gap: 15, alignItems: "center", mb: 3 }}>
        <TextField
          select
          label="Search By"
          size="small"
          defaultValue=""
          sx={{ minWidth: 180 }}
        />
        <TextField label="Input" size="small" sx={{ minWidth: 160 }} />
      </Box>

      <Paper sx={{ width: "80%", p: 2 }}>
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

        {isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error?.message ?? "Failed to load users"}
          </Alert>
        )}

        {isPending ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={2}>
            {users.map((u) => {
              const id = String(u._id);
              const isOpen = expandedId === id;

              const birth = u.birthDate
                ? new Date(u.birthDate).toLocaleDateString()
                : "-";

              return (
                <Card key={id} variant="outlined">
                  <CardHeader
                    title={`${u.firstName} ${u.lastName}`}
                    subheader={`ID: ${u.identityCard} • Birth: ${birth} • Gender: ${u.gender}`}
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
                      <Typography variant="subtitle2">Accounts</Typography>
                      <AccountsSection accounts={(u as any).accounts ?? []} />
                    </CardContent>
                  </Collapse>
                </Card>
              );
            })}

            {users.length === 0 && !isError && (
              <Typography variant="body2" color="text.secondary">
                No users found.
              </Typography>
            )}
          </Stack>
        )}
      </Paper>
    </Box>
  );
}
