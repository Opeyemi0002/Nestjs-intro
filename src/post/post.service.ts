import {
  Body,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreatePostDto } from './DTOs/createPost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/metaoption/metaoption.entity';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { TagsService } from 'src/tags/tags.service';
import { PatchPostDto } from './DTOs/patchpost.dto';
import { getPostsDto } from './DTOs/getPost.dto';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { PaginationQueryDto } from 'src/common/pagination/Dtos/pagintion-query.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { ActiveUserData } from 'src/auth/interfaces/activeuserdata.interface';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly usersService: UsersService,
    private readonly tagService: TagsService,
    private readonly paginatedProvider: PaginationProvider,
  ) {}

  // async create(body: CreatePostDto, user: ActiveUserData) {
  //   //find author
  //   try {
  //     const author = await this.usersService.findById(user.sub);
  //     if (!body.tags) {
  //       throw new NotFoundException();
  //     }
  //     const tags = await this.tagService.findMultipleTags(body.tags);
  //     //then create post
  //     if (body.tags.length !== tags.length) {
  //       throw new ConflictException();
  //     }

  //     if (!author) {
  //       throw new NotFoundException('Author not found');
  //     }
  //     let post = this.postRepository.create({ ...body, author, tags });
  //     return await this.postRepository.save(post);
  //   } catch (err) {
  //     if (err instanceof NotFoundException) {
  //       throw new HttpException(
  //         {
  //           statusCode: HttpStatus.NOT_FOUND,
  //           message: 'Not Found',
  //           err: err,
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }
  //     if (err instanceof ConflictException) {
  //       if (err instanceof ConflictException) {
  //         throw new HttpException(
  //           {
  //             statusCode: HttpStatus.CONFLICT,
  //             message: 'Error loading tags',
  //             err: err,
  //           },
  //           HttpStatus.CONFLICT,
  //         );
  //       }
  //     }
  //     if (err instanceof NotFoundException) {
  //       throw new HttpException(
  //         {
  //           statusCode: HttpStatus.NOT_FOUND,
  //           message: 'Not Found',
  //           err: err,
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }

  //     throw new HttpException(
  //       {
  //         statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //         message: 'Internal_Server_Error',
  //         err: err,
  //       },
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  async create(body: CreatePostDto, user: ActiveUserData) {
    try {
      const author = await this.usersService.findById(user.sub);

      if (!body.tags) {
        throw new NotFoundException('Tags not provided');
      }

      const tags = await this.tagService.findMultipleTags(body.tags);

      if (body.tags.length !== tags.length) {
        throw new ConflictException('Some tags not found');
      }

      if (!author) {
        throw new NotFoundException('Author not found');
      }

      const post = this.postRepository.create({ ...body, author, tags });
      return await this.postRepository.save(post);
    } catch (err) {
      if (
        err instanceof NotFoundException ||
        err instanceof ConflictException
      ) {
        // Just rethrow — NestJS will handle it properly
        throw err;
      }

      // For unexpected errors, throw Internal Server Error
      console.log(err);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
          error: err.message || err,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findall(
    userId: number,
    postquery: getPostsDto,
  ): Promise<Paginated<Post>> {
    try {
      let posts = await this.paginatedProvider.paginateQuery(
        {
          limit: postquery.limit,
          page: postquery.page,
        },
        this.postRepository,
      );
      //const user = this.usersService.findById(userId);

      // let post = await this.postRepository.find({
      //   relations: {
      //     metaOptions: true,
      //     author: true,
      //     tags: true,
      //   },
      //   take: postquery.limit,
      //   skip: (postquery.page - 1) * postquery.limit,
      // });

      return posts;
    } catch (err) {
      throw err;
    }
  }

  async delete(id: number) {
    await this.postRepository.delete({ id });
  }

  async update(body: PatchPostDto) {
    if (!body.tags) {
      return 'Tags cannot be found';
    }
    let tags = await this.tagService.findMultipleTags(body.tags);

    let post = await this.postRepository.findOneBy({ id: body.id });

    if (!post) {
      return 'Post not found';
    }
    post.title = body.title ?? post.title;
    post.slug = body.slug ?? post.slug;
    post.status = body.status ?? post.status;
    post.content = body.content ?? post.content;
    post.schema = body.schema ?? post.schema;
    post.postType = body.postType ?? post.postType;
    post.featuredImageUrl = body.featuredImageUrl ?? post.featuredImageUrl;
    post.publishedOn = body.publishedOn ?? post.publishedOn;
    post.tags = tags;

    return await this.postRepository.save(post);
  }
}
