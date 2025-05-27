import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class MediaUploadService {
  async uploadImage(image: string, folder?: string) {
    try {
      const result = await cloudinary.uploader.upload(image, {
        folder: folder ? `noticall-app/${folder}` : 'uploads',
      });
      return result.secure_url;
    } catch (error) {
      console.error(error);
    }
  }
}
