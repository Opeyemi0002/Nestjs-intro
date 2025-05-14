import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiHeaders, ApiOperation } from '@nestjs/swagger';
import { Express } from 'express';
import { UploadService } from './upload.service';
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService:UploadService) {}

  @Post('file')
  @ApiHeaders([
    { name: 'Content-Type', description: 'multipart/form-data' },
    { name: 'Authorization', description: 'Bearer Tken' },
  ])
  @ApiOperation({
    summary: 'upload new image to the server',
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadedFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadFile(file);
  }
}
