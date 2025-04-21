import { Injectable } from '@nestjs/common';
import { CreatePostMetaOptionsDto } from './Dtos/createpost.metaoptions.dto';
import { Repository } from 'typeorm';
import { MetaOption } from './metaoption.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MetaoptionService {
  constructor(
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}
  public async create(createPostMetaOptionsDto: CreatePostMetaOptionsDto) {
    let metaOption = this.metaOptionsRepository.create(
      createPostMetaOptionsDto,
    );

    return await this.metaOptionsRepository.save(metaOption);
  }
}
