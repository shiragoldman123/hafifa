import { Injectable } from '@nestjs/common';
import config from '../config/env.config';                                                                                                                                                                                                                         import { IShragaUser, IUser } from './auth.interface';
import { verifyJWT } from 'src/common/utils/utils';

const formatShragaUser = (payload: IShragaUser): IUser => ({
  id: payload.genesisId,
  adfsId: payload.adfsId,
  expiration: payload.exp,
  issuedAt: payload.iat,
  relayState: payload.RelayState,
});

@Injectable()
export class AuthService {
  constructor() {}

  verifyShragaJwt(token: string) {
    const payload = verifyJWT(token, config.shraga.secret);
    return formatShragaUser(payload as IShragaUser);
  }

}
