import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { UsersService } from '../users/users.service';
@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: User, done: (err: Error, user: User) => void) {
    done(null, user);
  }

  async deserializeUser(user: User, done: (err: Error, user: User) => void) {
    try {
      const userData = await this.usersService.findByDiscordId(user.discordId);
      done(null, userData);
    } catch (e) {
      done(e, null);
    }
  }
}
