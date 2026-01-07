export const accountsKeys = {
  all: ["accounts"] as const,

  lists: () => [...accountsKeys.all, "list"] as const,
  bySource: (source: string | null) =>
    [...accountsKeys.all, "source", source] as const,
  details: () => [...accountsKeys.all, "detail"] as const,
  detail: (id: string) => [...accountsKeys.details(), id] as const,
};
