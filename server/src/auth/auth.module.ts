import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { DiscordStrategy } from './strategies/discord.strategy';
import { UsersModule } from '../users/users.module';
import { SessionSerializer } from './session.serializer';

@Module({
  imports: [PassportModule.register({ session: true }), UsersModule],
  controllers: [AuthController],
  providers: [AuthService, DiscordStrategy, SessionSerializer],
})
export class AuthModule {}
