import { HttpStatus, Injectable, Req } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  validateUser(profile: any): Promise<any> {
    return this.userService.findOrCreate(profile);
  }

  async logout(@Req() request: Request): Promise<any> {
    request.session.destroy(() => {
      return {
        message: 'Logout successful',
        statusCode: HttpStatus.OK,
      };
    });
  }
}
