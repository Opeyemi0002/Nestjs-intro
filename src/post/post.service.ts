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
    //find author
    const author = await this.usersService.findById(body.authorId);
    //then create post
    if (!author) {
      return 'author not found';
    }
    let post = this.postRepository.create({ ...body, author });
    return await this.postRepository.save(post);
  }

  async findall(userId: number) {
    try {
      const user = this.usersService.findById(userId);

      let post = await this.postRepository.find({
        relations: { metaOptions: true, author: true },
      });

      return post;
    } catch (err) {}
  }

  async delete(id: number) {
    await this.postRepository.delete({ id });
  }
}
