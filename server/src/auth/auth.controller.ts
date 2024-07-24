import { Controller, Get, Req, Res, Session, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthenticatedGuard, DiscordAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('login')
  @UseGuards(DiscordAuthGuard)
  async login() {}

  @Get('discord/callback')
  @UseGuards(DiscordAuthGuard)
  async redirect(@Res() res: Response) {
    return res.redirect('http://localhost:4200');
  }

  @Get('me')
  @UseGuards(AuthenticatedGuard)
  status(@Req() req: Request) {
    return req.user;
  }

  @Get('logout')
  logout(@Req() req: Request) {
    return this.authService.logout(req);
  }

  @Get('check-session')
  checkSession(@Session() session: any) {
    // console.log(session);
    if (session.passport != null) {
      return { isAuthenticated: true };
    } else {
      return { isAuthenticated: false };
    }
  }
}
