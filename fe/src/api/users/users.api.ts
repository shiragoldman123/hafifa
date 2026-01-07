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
// export function getUserById(id: string) {
//   return apiRequest<User>({
//     method: "GET",
//     url: `/api/users/${id}`,
//   });
// }

export function createUser(input: CreateInputUser) {
  return apiRequest<User>({
    method: "POST",
    url: "users",
    data: input,
  });
}

// export function updateUser(id: string, input: UpdateUserInput) {
//   return apiRequest<User>({
//     method: "PATCH",
//     url: `/api/users/${id}`,
//     data: input,
//   });
// }

// export function deleteUser(id: string) {
//   return apiRequest<{ success: true }>({
//     method: "DELETE",
//     url: `/api/users/${id}`,
//   });
// }
