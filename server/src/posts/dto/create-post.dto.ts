import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  // @IsArray()
  // @IsOptional()
  // upvotes?: Types.ObjectId[];

  // @IsArray()
  // @IsOptional()
  // downvotes?: Types.ObjectId[];

  // @IsString()
  // @IsOptional()
  // author?: Types.ObjectId;

  // @IsOptional()
  // @IsString()
  // createdAt?: string;
}
