import { Controller, Get, Req, UseGuards } from '@nestjs/common';
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
  async redirect(@Req() req: Request) {
    return req.user;
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
}
