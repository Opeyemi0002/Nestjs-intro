import { Controller, Param, Get } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getPosts(@Param('userId') userId: string) {
    return this.postService.getPosts(userId);
  }
}
