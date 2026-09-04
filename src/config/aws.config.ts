import { registerAs } from '@nestjs/config';

export default registerAs('aws', () => ({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  region: process.env.AWS_REGION,
  BucketName: process.env.AWS_S3_BUCKET_NAME as string,
  CloudfrontUrl: process.env.AWS_CLOUDFRONT_URL as string,
}));
