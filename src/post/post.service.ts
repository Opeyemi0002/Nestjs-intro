import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreatePostDto } from './DTOs/createPost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/metaoption/metaoption.entity';
import { Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly usersService: UsersService,
  ) {}

  async create(body: CreatePostDto) {
    // let metaOption = body.metaOptions
    //   ? this.metaOptionsRepository.create(body.metaOptions)
    //   : null;

    // if (metaOption) {
    //   await this.metaOptionsRepository.save(metaOption);
    // }

    let post = this.postRepository.create(body);

    // if (metaOption) {
    //   post.metaOptions = metaOption;
    // }
    return await this.postRepository.save(post);
  }

  getPosts(userId: string) {
    try {
      const user = this.usersService.findById(userId);

      return user;
    } catch (err) {}
  }
}
