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
    let post = this.postRepository.create(body);

    return await this.postRepository.save(post);
  }

  async findall(userId: string) {
    try {
      const user = this.usersService.findById(userId);

      let post = await this.postRepository.find();

      return post;
    } catch (err) {}
  }

  async delete(id: number) {
    let post = await this.postRepository.findOneBy({ id });

    if (post && post.metaOptions) {
      let inversePost = await this.metaOptionsRepository.findOne({
        where: { id: post.metaOptions.id },
        relations: { post: true },
      });
      console.log(inversePost);
    }

    // if (post) {
    //   await this.postRepository.delete({ id });
    // } else {
    //   return 'Post is not availble';
    // }
    // if (post?.metaOptions) {
    //   await this.metaOptionsRepository.delete(post.metaOptions.id);
    //   return { status: 'Deleted' };
    //}
  }
}
