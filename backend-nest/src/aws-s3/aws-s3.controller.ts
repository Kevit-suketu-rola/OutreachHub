import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EditorGuard } from 'src/auth-guard/user/editor.guard';
import { AwsS3Service } from './aws-s3.service';

@Controller('aws-s3')
export class AwsS3Controller {
  constructor(private s3Service: AwsS3Service) {}
  @Post('image')
  @UseInterceptors(FileInterceptor('file')) // "file" is the form field name
//   @UseGuards(EditorGuard)
  async uploadImage(
    @Req() req: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // 1 MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }), // allow jpg, jpeg, png
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.s3Service.uploadFile(file, req);
  }
}
