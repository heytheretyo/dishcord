import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthenticatedGuard } from 'src/auth/auth.guard';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('all')
  async getAllPosts(@Res() res: Response) {
    try {
      const posts = await this.postsService.findAll();
      return res.status(HttpStatus.OK).send(posts);
    } catch (error) {
      console.error('Error fetching posts', error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error fetching posts' });
    }
  }

  @Post()
  @UseGuards(AuthenticatedGuard)
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userObjectId = new mongoose.Types.ObjectId(req.user._id);
    const result = await this.postsService.createPost(
      createPostDto,
      userObjectId,
    );
    return res
      .status(result.statusCode)
      .json({ message: result.message, post: result.post });
  }

  @Put(':postId')
  @UseGuards(AuthenticatedGuard)
  async updatePost(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = req.user._id;
    const result = await this.postsService.updatePost(postId, updatePostDto);
    return res
      .status(result.statusCode)
      .json({ message: result.message, post: result.post });
  }

  @Delete(':postId')
  @UseGuards(AuthenticatedGuard)
  async deletePost(
    @Param('postId') postId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = req.user._id;
    const result = await this.postsService.deletePost(postId, userId);
    return res.status(result.statusCode).json({ message: result.message });
  }

  @Get(':postId')
  async getPostById(@Param('postId') postId: string, @Res() res: Response) {
    const post = await this.postsService.findPostById(postId);
    if (!post) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Post not found' });
    }
    return res.status(HttpStatus.OK).json(post);
  }

  @Post(':postId/upvote')
  @UseGuards(AuthenticatedGuard)
  async upvotePost(
    @Param('postId') postId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = req.user._id;
    const result = await this.postsService.toggleUpvote(postId, userId);
    return res.status(result.statusCode).json({ message: result.message });
  }

  @Post(':postId/downvote')
  @UseGuards(AuthenticatedGuard)
  async downvotePost(
    @Param('postId') postId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = req.user._id;
    const result = await this.postsService.toggleDownvote(postId, userId);
    return res.status(result.statusCode).json({ message: result.message });
  }

  @Get('user/:userId')
  @UseGuards(AuthenticatedGuard)
  async getUserPosts(@Param('userId') userId: string, @Res() res: Response) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const posts = await this.postsService.findByUserId(userObjectId);
    return res.status(HttpStatus.OK).json(posts);
  }
}
