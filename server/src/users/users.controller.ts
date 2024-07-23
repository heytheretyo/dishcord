import {
  Controller,
  Delete,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(':userDiscordId/follow/:targetUserDiscordId')
  @HttpCode(HttpStatus.OK)
  async followUser(
    @Param('userDiscordId') userDiscordId: string,
    @Param('targetUserDiscordId') targetUserDiscordId: string,
  ): Promise<void> {
    try {
      await this.usersService.followUser(userDiscordId, targetUserDiscordId);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':userDiscordId/unfollow/:targetUserDiscordId')
  @HttpCode(HttpStatus.OK)
  async unfollowUser(
    @Param('userDiscordId') userDiscordId: string,
    @Param('targetUserDiscordId') targetUserDiscordId: string,
  ): Promise<void> {
    try {
      await this.usersService.unfollowUser(userDiscordId, targetUserDiscordId);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
