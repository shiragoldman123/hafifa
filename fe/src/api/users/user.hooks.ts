import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { usersKeys } from "./users.keys";
import {
  connect,
  createUser,
  disconnect,
  getUsers,
  searchUsers,
} from "./users.api";
import { CreateInputUser, PopulatedUser } from "../../types/user.types";
import { accountsKeys } from "../accounts/accounts.keys";

export function useUsers(params: {
  page: number;
  limit: number;
  search?: string;
}) {
  return useQuery({
    queryKey: usersKeys.list(params),
    queryFn: () => getUsers(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,

    retry: (failureCount, error: any) => {
      const status = error?.status;
      if (status === 401 || status === 403) return false;
      return failureCount < 2;
    },
  });
}

export function useConnect() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      accountId,
      userId,
    }: {
      accountId: string;
      userId: string;
    }) => connect(accountId, userId),
     onMutate: async ({ accountId, userId }) => {
      await qc.cancelQueries({ queryKey: accountsKeys.all });
      qc.setQueriesData({ queryKey: accountsKeys.all }, (old: any) => {
        if (!old) return old;
        if (Array.isArray(old)) {
          return old.map(account => 
            account._id === accountId 
              ? { ...account, user: userId }
              : account
          );
        }

        if (old.data) {
          return {
            ...old,
            data: old.data.map((account: any) => 
              account._id === accountId 
                ? { ...account, user: userId }
                : account
            )
          };
        }
        
        return old;
      });
    },
    onSuccess: async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
      qc.invalidateQueries({ queryKey: accountsKeys.all });
      qc.invalidateQueries({ queryKey: usersKeys.all });
    },
  });
}

export function useDisconnect() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      accountId,
      userId,
    }: {
      accountId: string;
      userId: string;
    }) => disconnect(accountId, userId),
    onMutate: async ({ accountId, userId }) => {
      await qc.cancelQueries({ queryKey: accountsKeys.all });
      qc.setQueriesData({ queryKey: accountsKeys.all }, (old: any) => {
        if (!old) return old;
        if (Array.isArray(old)) {
          return old.map(account => 
            account._id === accountId 
              ? { ...account, user: null }
              : account
          );
        }
        
        if (old.data) {
          return {
            ...old,
            data: old.data.map((account: any) => 
              account._id === accountId 
                ? { ...account, user: null }
                : account
            )
          };
        }
        
        return old;
      });
    },
    onSuccess: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));

      qc.invalidateQueries({ queryKey: accountsKeys.all });
      qc.invalidateQueries({ queryKey: usersKeys.all });
    },
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateInputUser) => createUser(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });
}


export function useSearchUsers(query: string | null) {
  return useQuery({
    queryKey: ['users', 'search', query],
    queryFn: () => searchUsers(query!),
    enabled: !!query,
  });
}
