// upload.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { Express } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { CloudinaryProvider } from 'src/cloudinary/cloudinary.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { Upload } from './uploads.entity';
import { Repository } from 'typeorm';
import { UploadFile } from './interfaces/upload.interface';
import { fileType } from './enum/filetype.enum';

@Injectable()
export class UploadService {
  constructor(
    private readonly cloudinaryProvider: CloudinaryProvider,
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,
  ) {}

  async uploadFile(file: Express.Multer.File): Promise<any> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate allowed file types (only images for example)
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const fileExt = extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(fileExt)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`,
      );
    }

    // Generate unique file name: username-uuid.ext
    const baseName = this.getBaseFileName(file.originalname); // e.g., 'name'
    const uniqueSuffix = uuidv4(); // unique random ID
    const finalFileName = `${baseName}-${uniqueSuffix}${fileExt}`; // e.g., name-82bf7a5d.jpeg

    const cloudinary = this.cloudinaryProvider.getCloudinary();

    const results: any = await new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: 'uploads',
          public_id: finalFileName, // set our custom name (no ext required here)
          resource_type: 'auto', // auto-detect image/video
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(new BadRequestException('Cloudinary upload failed'));
          }
          resolve(result);
        },
      );

      upload.end(file.buffer);
    });
    const uploadFile: UploadFile = {
      name: finalFileName,
      type: fileType.IMAGE,
      size: file.size,
      mime: file.mimetype,
      path: results.secure_url,
    };

    let newUploads = this.uploadRepository.create(uploadFile);
    await this.uploadRepository.save(newUploads);
    return 'saved';
  }

  // Helper to extract filename without extension
  private getBaseFileName(originalName: string): string {
    return originalName.substring(0, originalName.lastIndexOf('.')) || 'file';
  }
}
