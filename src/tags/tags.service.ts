import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { Repository } from 'typeorm';
import { CreateTagDto } from './Dtos/createtag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) {}
  async create(body: CreateTagDto) {
    let tag = this.tagRepository.create(body);
    return await this.tagRepository.save(tag);
  }
}
