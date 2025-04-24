import {
  Controller,
  Param,
  Get,
  Post,
  Body,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './DTOs/createPost.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/:userId')
  getPosts(@Param('userId', new ParseIntPipe()) userId: number) {
    return this.postService.findall(userId);
  }

  @Post('new')
  async createPost(@Body() body: CreatePostDto) {
    return await this.postService.create(body);
  }

  @Delete('/delete')
  async deletePost(@Query('id', new ParseIntPipe()) id: number) {
    return await this.postService.delete(id);
  }
}
