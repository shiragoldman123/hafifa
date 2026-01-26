import { Account, CreateAccountInput, PopulatedAccount } from "../../types/account.types";
import { apiRequestRead, apiRequestWrite } from "../http";

export function createAccount(input: CreateAccountInput) {
  return apiRequestWrite<Account>({
    method: "POST",
    url: "accounts",
    data: input,
  });
}

export function getAllAccounts() {
  return apiRequestRead<PopulatedAccount[]>({
    method: "GET",
    url: "accounts"
  })
}

export function getAccountsFromSource(source: string) {
  return apiRequestRead<PopulatedAccount[]>({
    method: "GET",
    url: `accounts/source/${source}`
  })
}