import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { S3Service } from './s3.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post('file/upload')
  async fileUpload(@UploadedFile() file: Express.Multer.File) {
    return await this.s3Service.uploadFile(file);
  }
}
