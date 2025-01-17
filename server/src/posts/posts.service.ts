import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from '../schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '../schemas/user.schema';

type PostResponse = Promise<{
  message: string;
  statusCode: number;
  post?: Post;
}>;

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async findAll() {
    try {
      return await this.postModel.find({}).exec();
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new BadRequestException('error fetching post');
    }
  }

  async findByUserId(userId: Types.ObjectId) {
    return this.postModel.find({ author: userId }).exec();
  }

  async createPost(
    createPostDto: CreatePostDto,
    authorId: Types.ObjectId,
  ): PostResponse {
    try {
      const newPost = new this.postModel({
        text: createPostDto.text,
        author: authorId,
      });
      const savedPost = await newPost.save();

      await this.userModel.findByIdAndUpdate(
        authorId,
        { $push: { posts: savedPost._id } },
        { new: true },
      );

      return {
        message: 'post created successfully',
        statusCode: HttpStatus.CREATED,
        post: savedPost,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('error creating post');
    }
  }

  async updatePost(postId: string, updatePostDto: UpdatePostDto): PostResponse {
    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      return { message: 'post not found', statusCode: HttpStatus.NOT_FOUND };
    }

    const now = new Date();
    const postCreationTime = post['createdAt'];
    const timeDiff = now.getTime() - postCreationTime.getTime();
    const thirtyMinutesInMs = 30 * 60 * 1000;

    if (timeDiff > thirtyMinutesInMs) {
      return {
        message: 'cannot update post after 30 minutes',
        statusCode: HttpStatus.FORBIDDEN,
      };
    }

    post.text = updatePostDto.text || post.text;

    const updatedPost = await post.save();
    return {
      message: 'post updated successfully',
      statusCode: HttpStatus.OK,
      post: updatedPost,
    };
  }

  async deletePost(postId: string, userId: Types.ObjectId): PostResponse {
    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      return { message: 'post not found', statusCode: HttpStatus.NOT_FOUND };
    }

    if (!post.author.equals(userId)) {
      return {
        message: 'unauthorized to delete this post',
        statusCode: HttpStatus.FORBIDDEN,
      };
    }

    await this.postModel.findByIdAndDelete(postId).exec();
    return {
      message: 'post deleted successfully',
      statusCode: HttpStatus.NO_CONTENT,
    };
  }

  async addUpvote(postId: string, userId: Types.ObjectId): PostResponse {
    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      return { message: 'post not found', statusCode: HttpStatus.NOT_FOUND };
    }
    if (!post.upvotes.includes(userId)) {
      post.upvotes.push(userId);
      await post.save();
    }
    return { message: 'upvote added', statusCode: HttpStatus.OK };
  }

  async addDownvote(postId: string, userId: Types.ObjectId): PostResponse {
    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      return { message: 'post not found', statusCode: HttpStatus.NOT_FOUND };
    }
    if (!post.downvotes.includes(userId)) {
      post.downvotes.push(userId);
      await post.save();
    }
    return { message: 'downvote added', statusCode: HttpStatus.OK };
  }

  async removeUpvote(postId: string, userId: Types.ObjectId): PostResponse {
    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      return { message: 'post not found', statusCode: HttpStatus.NOT_FOUND };
    }
    post.upvotes = post.upvotes.filter((id) => !id.equals(userId));
    await post.save();
    return { message: 'upvote removed', statusCode: HttpStatus.OK };
  }

  async removeDownvote(postId: string, userId: Types.ObjectId): PostResponse {
    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      return { message: 'post not found', statusCode: HttpStatus.NOT_FOUND };
    }
    post.downvotes = post.downvotes.filter((id) => !id.equals(userId));
    await post.save();
    return { message: 'downvote removed', statusCode: HttpStatus.OK };
  }

  async findPostById(postId: string) {
    const post = await this.postModel.findById(postId).exec();
    return post;
  }

  async toggleUpvote(postId: string, userId: Types.ObjectId): PostResponse {
    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      return { message: 'post not found', statusCode: HttpStatus.NOT_FOUND };
    }
    if (post.upvotes.includes(userId)) {
      post.upvotes = post.upvotes.filter((id) => !id.equals(userId));
      await post.save();
      return { message: 'upvote removed', statusCode: HttpStatus.OK };
    } else {
      post.upvotes.push(userId);
      post.downvotes = post.downvotes.filter((id) => !id.equals(userId)); // Remove downvote if exists
      await post.save();
      return { message: 'upvote added', statusCode: HttpStatus.OK };
    }
  }

  async toggleDownvote(postId: string, userId: Types.ObjectId): PostResponse {
    const post = await this.postModel.findById(postId).exec();
    if (!post) {
      return { message: 'post not found', statusCode: HttpStatus.NOT_FOUND };
    }
    if (post.downvotes.includes(userId)) {
      post.downvotes = post.downvotes.filter((id) => !id.equals(userId));
      await post.save();
      return { message: 'downvote removed', statusCode: HttpStatus.OK };
    } else {
      post.downvotes.push(userId);
      post.upvotes = post.upvotes.filter((id) => !id.equals(userId)); // Remove upvote if exists
      await post.save();
      return { message: 'downvote added', statusCode: HttpStatus.OK };
    }
  }
}
