import { Account, CreateAccountInput } from "../../types/account.types";
import { apiRequest } from "../http";

export function createAccount(input: CreateAccountInput) {
  return apiRequest<Account>({
    method: "POST",
    url: "/api/accounts",
    data: input,
  });
}