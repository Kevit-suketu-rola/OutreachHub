import { Injectable } from '@nestjs/common';

@Injectable()
export class FileUploadService {
  constructor() {}

  async uploadFile(file: Express.Multer.File, req: any) {
    if (!file) {
      throw new Error('No file provided');
    }

    const base64 = file.buffer.toString('base64');
    const dataUri = `data:${file.mimetype};base64,${base64}`;

    return {
      url: dataUri,
    };
  }
}
