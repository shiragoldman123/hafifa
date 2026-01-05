export const usersKeys = {
  all: ["users"] as const,

  lists: () => [...usersKeys.all, "list"] as const,
  list: (params: { page: number; limit: number; search?: string }) =>
    [...usersKeys.lists(), params] as const,

  details: () => [...usersKeys.all, "detail"] as const,
  detail: (id: string) => [...usersKeys.details(), id] as const,
};
