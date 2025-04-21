import { Body, Controller, Post } from '@nestjs/common';
import { MetaoptionService } from './metaoption.service';
import { CreatePostMetaOptionsDto } from './Dtos/createpost.metaoptions.dto';

@Controller('metaoption')
export class MetaoptionController {
  constructor(private readonly metaOptionsService: MetaoptionService) {}

  @Post()
  async create(@Body() body: CreatePostMetaOptionsDto) {
    return await this.metaOptionsService.create(body);
  }
}
