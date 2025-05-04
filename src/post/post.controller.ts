import {
  Controller,
  Param,
  Get,
  Post,
  Body,
  Delete,
  Query,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './DTOs/createPost.dto';
import { PatchPostDto } from './DTOs/patchpost.dto';
import { getPostsDto } from './DTOs/getPost.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/:userId')
  getPosts(
    @Param('userId', new ParseIntPipe()) userId: number,
    @Query() postquery: getPostsDto,
  ) {
    return this.postService.findall(userId, postquery);
  }

  @Post('new')
  async createPost(@Body() body: CreatePostDto) {
    return await this.postService.create(body);
  }

  @Patch('update')
  async updatePost(@Body() body: PatchPostDto) {
    return await this.postService.update(body);
  }

  @Delete('/delete')
  async deletePost(@Query('id', new ParseIntPipe()) id: number) {
    return await this.postService.delete(id);
  }
}
