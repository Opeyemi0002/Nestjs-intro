import { Module } from '@nestjs/common';
import { MetaoptionController } from './metaoption.controller';
import { MetaoptionService } from './metaoption.service';

@Module({
  controllers: [MetaoptionController],
  providers: [MetaoptionService]
})
export class MetaoptionModule {}
