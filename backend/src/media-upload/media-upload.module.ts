import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configureCloudinary } from 'src/media-upload/media-upload.provider';
import { MediaUploadService } from 'src/media-upload/media-upload.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    MediaUploadService,
    {
      provide: 'CLOUDINARY',
      useFactory: (configService: ConfigService) => {
        configureCloudinary(configService);
        return configService;
      },
      inject: [ConfigService],
    },
  ],
  exports: [MediaUploadService, 'CLOUDINARY'],
})
export class MediaUploadModule {}
