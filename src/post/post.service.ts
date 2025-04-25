import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreatePostDto } from './DTOs/createPost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/metaoption/metaoption.entity';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { TagsService } from 'src/tags/tags.service';
import { PatchPostDto } from './DTOs/patchpost.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly usersService: UsersService,
    private readonly TagService: TagsService,
  ) {}

  async create(body: CreatePostDto) {
    //find author
    const author = await this.usersService.findById(body.authorId);
    //then create post
    if (!body.tags) {
      return 'tags not found';
    }
    const tags = await this.TagService.findMultipleTags(body.tags);

    if (!author) {
      return 'author not found';
    }
    let post = this.postRepository.create({ ...body, author, tags });
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

  async update(body: PatchPostDto) {
    if (!body.tags) {
      return 'Tags cannot be found';
    }
    let tags = await this.TagService.findMultipleTags(body.tags);

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
