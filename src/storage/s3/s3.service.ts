import { ConflictException, Inject, Injectable } from '@nestjs/common';
import awsConfig from 'src/config/aws.config';
import { UploadType } from './enum/upload.enum';
import { Upload } from '../uploads.entity';
import type { ConfigType } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import * as path from 'path';
import { S3 } from 'aws-sdk';
import 'multer';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { UploadFileData } from './interfaces/upload-file.interface';

@Injectable()
export class S3Service {
  private readonly s3: S3;
  constructor(
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,
    @Inject(awsConfig.KEY)
    private readonly s3Configuration: ConfigType<typeof awsConfig>,
  ) {
    this.s3 = new S3({
      region: this.s3Configuration.region,
      accessKeyId: this.s3Configuration.accessKeyId,
      secretAccessKey: this.s3Configuration.secretAccessKey,
    });
  }

  async uploadFile(file: Express.Multer.File) {
    try {
      const fileExtension = path.extname(file.originalname);
      const acceptedExtension = ['.jpeg', '.jpg', '.png'];
      if (!acceptedExtension.includes(fileExtension)) {
        throw new ConflictException('Invalid file format');
      }
      const fileType = UploadType.IMAGE;
      const uploadFile = await this.s3
        .upload({
          Bucket: this.s3Configuration.BucketName,
          Key: this.generateKeyName(file),
          Body: file.buffer,
          ContentType: file.mimetype,
        })
        .promise();

      const uploadData: UploadFileData = {
        key: uploadFile.Key,
        fileType,
        mimeType: file.mimetype,
        fileSize: file.size,
        path: `https://${this.s3Configuration.CloudfrontUrl}/${uploadFile.Key}`,
      };
      const fileUpload = this.uploadRepository.create(uploadData);
      return await this.uploadRepository.save(fileUpload);
    } catch (error) {
      throw error;
    }
  }

  private generateKeyName(file: Express.Multer.File) {
    //extract file name
    const name = path.basename(
      file.originalname,
      path.extname(file.originalname),
    );
    //extract extension
    const extName = path.extname(file.originalname);
    //stringify the timeof creation
    const time = new Date().getTime().toString();
    //generate uuid
    const randomUuid = uuid();
    //add all  together

    return `${name}-${time}-${randomUuid}${extName}`;
  }
}
