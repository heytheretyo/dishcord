import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOrCreate(profile: any): Promise<User> {
    const { id: discordId, username, avatar, email } = profile;
    let user = await this.userModel.findOne({ discordId }).exec();

    if (user) return user;

    const createUserDto: CreateUserDto = {
      discordId,
      username,
      avatar,
      email,
      premium: false,
      role: 'USER',
    };

    const createdUser = new this.userModel(createUserDto);
    await createdUser.save();
    return createdUser;
  }

  async findById(id: string) {}
}
