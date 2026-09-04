import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../DTOs/post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { getPostsDto } from '../DTOs/getposts.dto';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { Request } from 'express';

@Injectable()
export class PostService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly paginationService: PaginationService,
  ) {}

  async createPost(data: CreatePostDto, userId: number) {
    try {
      const postAuthor = await this.userService.getUser(userId);
      if (!postAuthor) {
        throw new NotFoundException('kindly login or register');
      }
      let createPost = this.postRepository.create({
        ...data,
        author: postAuthor,
      });
      createPost = await this.postRepository.save(createPost);

      return { message: 'post created succesfully', ...createPost };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException(err);
    }
  }
  async getPost(postQuery: getPostsDto, userId: number) {
    this.paginationService.paginateQuery(
      {
        page: postQuery.page,
        limit: postQuery.limit,
      },
      this.postRepository,
    );
  }
}
