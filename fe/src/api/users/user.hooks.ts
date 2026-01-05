import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { usersKeys } from "./users.keys";
import { getUsers} from "./users.api";

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

// export function useUser(id: string) {
//   return useQuery({
//     queryKey: usersKeys.detail(id),
//     queryFn: () => getUserById(id),
//     enabled: !!id,
//   });
// }

// export function useCreateUser() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (input: CreateUserInput) => createUser(input),
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: usersKeys.lists() });
//     },
//   });
// }

// export function useUpdateUser(id: string) {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (input: UpdateUserInput) => updateUser(id, input),
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: usersKeys.lists() });
//       qc.invalidateQueries({ queryKey: usersKeys.detail(id) });
//     },
//   });
// }

// export function useDeleteUser() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (id: string) => deleteUser(id),
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: usersKeys.lists() });
//     },
//   });
// }
