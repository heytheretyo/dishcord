import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOrCreate(profile: any): Promise<User> {
    const { id: discordId, username, avatar, email } = profile;
    let user = await this.userModel.findOne({ discordId: discordId }).exec();

    if (user) return user;

    const createUserDto: CreateUserDto = {
      discordId,
      username,
      avatar,
      email,
      premium: false,
      role: 'USER',
    };

    try {
      const createdUser = new this.userModel(createUserDto);
      return createdUser.save();
    } catch (e) {
      throw new BadRequestException('error creating user');
    }
  }

  async findByDiscordId(discordId: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ discordId }).exec();
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `user with discordId ${discordId} not found`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async followUser(
    userDiscordId: string,
    targetUserDiscordId: string,
  ): Promise<any> {
    const user = await this.findByDiscordId(userDiscordId);
    const targetUser = await this.findByDiscordId(targetUserDiscordId);

    if (user.following.includes(targetUser._id)) {
      throw new BadRequestException('Already following this user');
    }

    user.following.push(targetUser._id);
    targetUser.followers.push(user._id);

    await user.save();
    await targetUser.save();

    return {
      message: 'user followed successfully',
      statusCode: HttpStatus.OK,
    };
  }

  async unfollowUser(
    userDiscordId: string,
    targetUserDiscordId: string,
  ): Promise<any> {
    const user = await this.findByDiscordId(userDiscordId);
    const targetUser = await this.findByDiscordId(targetUserDiscordId);

    if (!user.following.includes(targetUser._id)) {
      throw new BadRequestException('not following this user');
    }

    user.following = user.following.filter((id) => !id.equals(targetUser._id));
    targetUser.followers = targetUser.followers.filter(
      (id) => !id.equals(user._id),
    );

    await user.save();
    await targetUser.save();

    return {
      message: 'user unfollowed successfully',
      statusCode: HttpStatus.OK,
    };
  }
}
