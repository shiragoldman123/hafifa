import { Account, CreateAccountInput, PopulatedAccount } from "../../types/account.types";
import { apiRequest } from "../http";

export function createAccount(input: CreateAccountInput) {
  return apiRequest<Account>({
    method: "POST",
    url: "accounts",
    data: input,
  });
}

export function getAllAccounts() {
  return apiRequest<PopulatedAccount[]>({
    method: "GET",
    url: "accounts"
  })
}

export function getAccountsFromSource(source: string) {
  return apiRequest<PopulatedAccount[]>({
    method: "GET",
    url: `accounts/source/${source}`
  })
}