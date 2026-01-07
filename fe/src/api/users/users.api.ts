import { CreateInputUser, Paginated, PopulatedUser, User } from "../../types/user.types";
import { apiRequest } from "../http";

export function getUsers(params: { page: number; limit: number; search?: string }) {
  return apiRequest<Paginated<PopulatedUser>>({
    method: "GET",
    url: "users",
    params: {
      page: params.page,
      limit: params.limit,
      ...(params.search ? { search: params.search } : {}),
    },
  });
}

export function disconnect(accountId: string, userId: string) {
  return apiRequest<void>({
    method: "DELETE",
    url: `users/disconnect/account/${accountId}/user/${userId}`
  })
}

export function connect(accountId: string, userId: string) {
  return apiRequest<void>({
    method: "PATCH",
    url: `users/connect/account/${accountId}/user/${userId}`
  })
}

export function createUser(input: CreateInputUser) {
  return apiRequest<User>({
    method: "POST",
    url: "users",
    data: input,
  });
}

export function findUserByFullName(fullName: string) {
  return apiRequest<PopulatedUser[]>({
    method:"GET",
    url: `users/fullName/${fullName}`
  });
}

export function findUserByAccountIdentifier(identifier: string) {
  return apiRequest<PopulatedUser>({
    method:"GET",
    url: `users/account/identifier/${identifier}`
  });
}

export function findUsersWithSource(source: string) {
  return apiRequest<PopulatedUser[]>({
    method: "GET",
    url: `users/accounts/source/${source}`
  });
}
