export const accountsKeys = {
  all: ["accounts"] as const,

  lists: () => [...accountsKeys.all, "list"] as const,
  list: (params: { page: number; limit: number; search?: string }) =>
    [...accountsKeys.lists(), params] as const,

  details: () => [...accountsKeys.all, "detail"] as const,
  detail: (id: string) => [...accountsKeys.details(), id] as const,
};
