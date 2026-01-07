import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import { useDisconnect } from "../../api/users/user.hooks";

interface Account {
  _id: string;
  source: string;
  identifier: string;
  email?: string;
}

interface AccountsSectionProps {
  accounts: Account[];
  userId: string;
}

export default function AccountsSection({ accounts, userId }: AccountsSectionProps) {
  const disconnectAccount = useDisconnect();

  if (!accounts || accounts.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ pt: 1 }}>
        No accounts
      </Typography>
    );
  }

  const handleDisconnect = (accountId: string) => {
    disconnectAccount.mutate({ accountId, userId });
  };

  return (
    <Stack spacing={1} sx={{ pt: 1 }}>
      {accounts.map((acc, idx) => (
        <Box key={acc._id ?? idx}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2">
                <b>Source:</b> {acc.source ?? "-"}{" "}
                <b style={{ marginLeft: 8 }}>Identifier:</b> {acc.identifier ?? "-"}
              </Typography>
              {acc.email && (
                <Typography variant="body2">
                  <b>Email:</b> {acc.email}
                </Typography>
              )}
            </Box>
            
            <Button
              size="small"
              color="error"
              variant="outlined"
              onClick={() => handleDisconnect(acc._id)}
              disabled={disconnectAccount.isPending}
              sx={{ ml: 2, minWidth: 100 }}
            >
              Disconnect
            </Button>
          </Box>
          
          {idx < accounts.length - 1 && <Divider sx={{ mt: 1 }} />}
        </Box>
      ))}
    </Stack>
  );
}