import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { UserService } from '../user/user.service';
@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  serializeUser(user: User, done: (err: Error, user: User) => void) {
    done(null, user);
  }

  async deserializeUser(user: User, done: (err: Error, user: User) => void) {
    try {
      const userData = await this.userService.findByDiscordId(user.discordId);
      done(null, userData);
    } catch (e) {
      done(e, null);
    }
  }
}
