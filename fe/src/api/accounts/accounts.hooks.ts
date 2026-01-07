import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateAccountInput } from "../../types/account.types";
import { createAccount, getAccountsFromSource, getAllAccounts } from "./accounts.api";
import { accountsKeys } from "./accounts.keys";

export function useCreateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAccountInput) => createAccount(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: accountsKeys.lists() });
    },
  });
}

export function useGetAllAccounts() {
  return useQuery({
    queryKey: accountsKeys.lists(),
    queryFn: () => getAllAccounts()
  });
}

export function useGetAccountsBySource(source: string | null) {
  return useQuery({
        queryKey: accountsKeys.bySource(source),
        queryFn: () => getAccountsFromSource(source!),
        enabled: !!source
  })
}