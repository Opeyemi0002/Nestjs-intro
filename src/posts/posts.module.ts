import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostService } from './services/posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { UserModule } from 'src/users/users.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';

@Module({
  controllers: [PostsController],
  providers: [PostService],
  imports: [TypeOrmModule.forFeature([Post]), UserModule, PaginationModule],
})
export class PostModule {}
