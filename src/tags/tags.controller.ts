import {
  Body,
  Controller,
  Delete,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './Dtos/createtag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagService: TagsService) {}

  @Post('new')
  async createTags(@Body() body: CreateTagDto) {
    return await this.tagService.create(body);
  }

  @Delete()
  async deleteTag(@Query('id', ParseIntPipe) id: number) {
    return await this.tagService.delete(id);
  }
}
