import { HttpStatus, Injectable, Req, Res } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Request } from 'express';
import { User } from '../schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  validateUser(profile: any): Promise<User> {
    return this.userService.findOrCreate(profile);
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
