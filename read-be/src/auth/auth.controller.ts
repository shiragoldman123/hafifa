import { Controller, Get, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import config from '../config/env.config';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiResponse({
  status: HttpStatus.BAD_REQUEST,
  description: 'Bad Request',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/login')
  @ApiOperation({ summary: 'Redirect from UI to login with shraga' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Redirects to Shraga login URL' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Missing or Invalid RelayState in query' })
  shragaLogin(@Query('RelayState') relayState: string | undefined, @Res() res: Response) {
    const { url, callbackUrl, secret } = config.shraga;
    const baseRedirectUrl = `${url}/setCallback/${encodeURIComponent(callbackUrl)}?SignInSecret=${encodeURIComponent(secret)}&useEnrichId=true`;
    const redirectUrl = relayState ? baseRedirectUrl + `&RelayState=${relayState}` : baseRedirectUrl;

    res.redirect(redirectUrl);
  }

  @Post('/callback')
  @ApiOperation({ summary: 'Handle Shraga callback' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Redirects after handling Shraga callback' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Missing or Invalid JWT access token in query' })
  shragaCallback(@Query('jwt') token: string, @Res() res: Response) {
    if (!token) throw new Error('Missing JWT token in authorization header');
    const payload = this.authService.verifyShragaJwt(token);

    res.cookie('access_token', token, {
      maxAge: new Date(payload.expiration * 1000).getTime() - Date.now(),
      httpOnly: false,
    });

    const frontendUrl = config.shraga.frontendUrl || 'http://localhost:5173';
    const redirectPath = payload.relayState || '/';
    res.redirect(`${frontendUrl}${redirectPath}`);
  }
}
