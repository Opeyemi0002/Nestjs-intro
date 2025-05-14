import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from './uploads.entity';

@Module({
  imports: [CloudinaryModule, TypeOrmModule.forFeature([Upload])],
  providers: [UploadService],
  controllers: [UploadController],
})
export class UploadModule {}
