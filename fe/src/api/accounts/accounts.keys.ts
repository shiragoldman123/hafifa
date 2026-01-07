export const accountsKeys = {
  all: ['accounts'] as const,
  lists: () => [...accountsKeys.all, 'list'] as const,
  detail: (id: string) => [...accountsKeys.all, 'detail', id] as const,
  bySource: (source: string | null) => [...accountsKeys.all, 'source', source] as const,
  byIdentifier: (identifier: string | null) => [...accountsKeys.all, 'identifier', identifier] as const,
};