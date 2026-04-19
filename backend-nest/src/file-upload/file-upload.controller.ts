import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';

@Controller('aws-s3')
export class FileUploadController {
  constructor(private fileUploadService: FileUploadService) {}
  @Post('image')
  @UseInterceptors(FileInterceptor('file')) // "file" is the form field name
  async uploadImage(
    @Req() req: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // 2 MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }), // allow jpg, jpeg, png
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.fileUploadService.uploadFile(file, req);
  }
}
