import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { In, Repository } from 'typeorm';
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

  async findMultipleTags(tags: number[]) {
    let results = await this.tagRepository.find({
      where: { id: In(tags) },
    });
    return results;
  }

  async delete(id: number) {
    await this.tagRepository.delete(id);

    return { status: 'Deleted', id };
  }

  async softRemove(id: number) {
    await this.tagRepository.softDelete(id);

    return { status: 'Deleted', id };
  }
}
