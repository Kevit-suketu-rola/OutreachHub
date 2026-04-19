import { forwardRef, Module } from '@nestjs/common';
import { AdminModule } from 'src/admin/admin.module';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { Token, TokenSchema } from 'src/auth-guard/token.schema';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { WorkspaceUserModule } from 'src/workspace-user/workspace-user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    forwardRef(() => AdminModule),
    forwardRef(() => UserModule),
    forwardRef(() => WorkspaceModule),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    WorkspaceUserModule,
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
