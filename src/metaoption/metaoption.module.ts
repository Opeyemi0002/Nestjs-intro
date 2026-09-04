import { Module } from '@nestjs/common';
import { MetaoptionService } from './provider/metaoption.service';
import { MetaoptionController } from './metaoption.controller';

@Module({
  providers: [MetaoptionService],
  controllers: [MetaoptionController]
})
export class MetaoptionModule {}
