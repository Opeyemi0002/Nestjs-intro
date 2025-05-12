import { Inject, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigType } from '@nestjs/config';
import cloudinaryConfig from './config/cloudinary.config';

@Injectable()
export class CloudinaryProvider {
  constructor(
    @Inject(cloudinaryConfig.KEY)
    private readonly cloudinaryConfiguration: ConfigType<
      typeof cloudinaryConfig
    >,
  ) {
    cloudinary.config({
      cloud_name: this.cloudinaryConfiguration.name,
      api_key: this.cloudinaryConfiguration.key,
      api_secret: this.cloudinaryConfiguration.secret,
    });
  }
  turn;

  getCloudinary() {
    return cloudinary;
  }
}
