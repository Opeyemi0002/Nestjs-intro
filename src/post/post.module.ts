import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { MetaOption } from 'src/metaoption/metaoption.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Post, MetaOption])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
