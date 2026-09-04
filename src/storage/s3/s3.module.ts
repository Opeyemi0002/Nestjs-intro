import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { ConfigModule } from '@nestjs/config';
import awsConfig from 'src/config/aws.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from '../uploads.entity';
import { S3Controller } from './s3.controller';

@Module({
  providers: [S3Service],
  imports: [ConfigModule.forFeature(awsConfig), TypeOrmModule.forFeature([Upload])],
  exports: [S3Service],
  controllers: [S3Controller],
})
export class S3Module {}
