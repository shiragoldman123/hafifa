export const userMapping = {
  properties: {
    firstName: { type: 'text' },
    lastName: { type: 'text' },
    fulleName: { type: 'text' },
    identityCard: { type: 'keyword' },
    birthDate: { type: 'date' },
    gender: { type: 'text' },
    accounts: {
      type: 'nested',
      properties: {
        id: { type: 'keyword' },
        email: { type: 'keyword' },
        identifier: { type: 'keyword' },
        source: { type: 'text' },
      },
    },
  },
};
