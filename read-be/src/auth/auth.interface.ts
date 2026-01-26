export interface IShragaUser {
  id: string;
  adfsId: string;
  genesisId: string;
  name: { firstName: string; lastName: string };
  email: string;
  displayName: string;
  upn: string;
  provider: string;
  entityType: string;
  job: string;
  phoneNumbers: string[];
  clearance: string;
  photo: string;
  RelayState: string;
  jti: string;
  iat: number;
  exp: number;
}

export interface IUser {
  [x: string]: any;
  id: string;
  adfsId: string;
  expiration: number;
  issuedAt: number;
  relayState: string;
}
