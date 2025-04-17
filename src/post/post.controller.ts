import { Controller, Param, Get, Post, Body } from '@nestjs/common';
import { PostService } from './post.service';
import { createPostDtO } from './DTOs/createPost.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getPosts(@Param('userId') userId: string) {
    return this.postService.getPosts(userId);
  }

  @Post()
  createPost(@Body() body: createPostDtO) {}
}
