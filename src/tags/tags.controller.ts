import { Body, Controller, Post } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './Dtos/createtag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagService: TagsService) {}

  @Post('new')
  async createTags(@Body() body: CreateTagDto) {
    return await this.tagService.create(body);
  }
}
