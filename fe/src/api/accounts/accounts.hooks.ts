import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateAccountInput } from "../../types/account.types";
import { createAccount } from "./accounts.api";
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