import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOrCreate(profile: any): Promise<User> {
    console.log(profile);
    const { id: discordId, username, avatar, email } = profile;
    let user = await this.userModel.findOne({ discordId: discordId }).exec();

    if (user) return user;

    console.log(profile);
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
      await createdUser.save();
      return createdUser;
    } catch (e) {
      console.log(e);
    }
  }

  async findByDiscordId(discordId: string) {
    return this.userModel.findOne({ discordId }).exec();
  }
}
