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
import { AuthType } from 'src/auth/enum/auth-type.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('file')
  @ApiHeaders([
    { name: 'Content-Type', description: 'multipart/form-data' },
    { name: 'Authorization', description: 'Bearer Tken' },
  ])
  @ApiOperation({
    summary: 'upload new image to the server',
  })
  @UseInterceptors(FileInterceptor('file'))
  @Auth(AuthType.None)
  async uploadedFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadFile(file);
  }
}
