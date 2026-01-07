export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
    list: (params: { page: number; limit: number; search?: string }) =>
    [...usersKeys.lists(), params] as const,
  detail: (id: string) => [...usersKeys.all, 'detail', id] as const,
  byFullName: (fullName: string | null) => [...usersKeys.all, 'fullName', fullName] as const,
  bySource: (source: string | null) => [...usersKeys.all, 'source', source] as const,
  byAccountId: (accountId: string | undefined) => [...usersKeys.all, 'accountId', accountId] as const,
  byAccountIdentifier: (identifier: string | null) => [...usersKeys.all, 'accountIdentifier', identifier] as const,
};