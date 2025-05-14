import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
  imports: [],
  providers: [CloudinaryProvider],
  controllers: [],
  exports: [CloudinaryProvider],
})
export class CloudinaryModule {}
