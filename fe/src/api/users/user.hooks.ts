import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { usersKeys } from "./users.keys";
import { connect, createUser, disconnect, findUserByAccountIdentifier, findUserByFullName, findUsersWithSource, getUsers} from "./users.api";
import { CreateInputUser } from "../../types/user.types";
import { accountsKeys } from "../accounts/accounts.keys";

export function useUsers(params: { page: number; limit: number; search?: string }) {
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
    mutationFn: ({ accountId, userId }: { accountId: string; userId: string }) => 
      connect(accountId, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: accountsKeys.all });
      qc.invalidateQueries({ queryKey: usersKeys.all });
    },
  });
}

export function useDisconnect() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ accountId, userId }: { accountId: string; userId: string }) => 
      disconnect(accountId, userId),
    onSuccess: () => {
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

export function useFindUsersByFullName(fullName: string | null) {
  return useQuery({
    queryKey: usersKeys.byFullName(fullName),
    queryFn: () => {
      if (!fullName) {
        throw new Error('Full name is required');
      }
      return findUserByFullName(fullName);
    },
    enabled: !!fullName
  });
}

export function useFindUserByAccountIdentifier(accountIdentifier: string | null) {
  return useQuery({
    queryKey: usersKeys.byAccountIdentifier(accountIdentifier),
    queryFn: () => {
      if (!accountIdentifier) {
        throw new Error('Account identifier is required');
      }
      return findUserByAccountIdentifier(accountIdentifier);
    },
    enabled: !!accountIdentifier
  });
}

export function useFindUserWithSource(source: string | null) {
  return useQuery({
    queryKey: usersKeys.bySource(source),
    queryFn: () => {
      if (!source) {
        throw new Error('Source is required');
      }
      return findUsersWithSource(source);
    },
    enabled: !!source
  });
}
