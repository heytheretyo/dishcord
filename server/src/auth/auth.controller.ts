import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('login')
  @UseGuards(AuthGuard('discord'))
  async login(@Req() req: Request) {}

  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  async redirect(@Req() req: Request) {
    const user = req.user;
    return this.authService.validateUser(user);
  }

  @Get('logout')
  @UseGuards(AuthGuard('discord'))
  logout(@Req() request: Request): Promise<any> {
    return this.authService.logout(request);
  }
}
