import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  use(_req: Request, _res: Response, next: NextFunction) {
    // validate the user token
    // console.log('AuthenticationMiddleware');

    next();
  }
}
