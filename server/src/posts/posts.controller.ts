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

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthenticatedGuard)
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = req.user._id;
    const result = await this.postsService.createPost(createPostDto, userId);
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
    const result = await this.postsService.updatePost(
      postId,
      updatePostDto,
      userId,
    );
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
    const result = await this.postsService.addUpvote(postId, userId);
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
    const result = await this.postsService.addDownvote(postId, userId);
    return res.status(result.statusCode).json({ message: result.message });
  }

  @Post(':postId/remove-upvote')
  @UseGuards(AuthenticatedGuard)
  async removeUpvote(
    @Param('postId') postId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = req.user._id;
    const result = await this.postsService.removeUpvote(postId, userId);
    return res.status(result.statusCode).json({ message: result.message });
  }

  @Post(':postId/remove-downvote')
  @UseGuards(AuthenticatedGuard)
  async removeDownvote(
    @Param('postId') postId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = req.user._id;
    const result = await this.postsService.removeDownvote(postId, userId);
    return res.status(result.statusCode).json({ message: result.message });
  }
}
