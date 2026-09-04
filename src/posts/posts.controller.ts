import {
  Controller,
  Post,
  Body,
  Patch,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Req,
} from '@nestjs/common';
import { PostService } from './services/posts.service';
import { CreatePostDto } from './DTOs/post.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdatePostDto } from './DTOs/updatepost.dto';
import { getPostsDto } from './DTOs/getposts.dto';
import type { Request } from 'express';
import { REQUEST_KEY } from 'src/auth/guards/constant.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostService) {}
  @Post()
  @ApiOperation({
    summary: 'this api is used to create a new post',
  })
  @ApiResponse({
    status: 201,
    description: 'you get a 201 response if your post is created successfully',
  })
  createPost(@Req() request: Request, @Body() createPostDto: CreatePostDto) {
    const userId = request[REQUEST_KEY].sub;
    return this.postService.createPost(createPostDto, userId);
  }

  @Patch()
  updatePost(@Body() updatePostDto: UpdatePostDto) {}

  @Get()
  getPost(@Query() postQuery: getPostsDto) {
    console.log(postQuery);
  }
}
