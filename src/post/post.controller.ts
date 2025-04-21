import { Controller, Param, Get, Post, Body } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './DTOs/createPost.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getPosts(@Param('userId') userId: string) {
    return this.postService.getPosts(userId);
  }

  @Post('new')
  async createPost(@Body() body: CreatePostDto) {
    return await this.postService.create(body);
  }
}
