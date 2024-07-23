import { HttpStatus, Injectable, Req, Res } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Request } from 'express';
import { User } from '../schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  validateUser(profile: any): Promise<User> {
    return this.usersService.findOrCreate(profile);
  }

  logout(@Req() req: Request): Promise<any> {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject({
            message: 'Logout failed',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          });
        }

        resolve({
          message: 'Logout successful',
          statusCode: HttpStatus.OK,
        });
      });
    });
  }
}
