import { UnauthorizedException } from "@nestjs/common";
import * as jwt from 'jsonwebtoken';

export const verifyJWT = (token: string, secret: string) => {
  try {
    return jwt.verify(token, Buffer.from(secret, 'base64'));
  } catch (err) {
    console.log(err);
    throw new UnauthorizedException('Invalid JWT payload');
  }
};
