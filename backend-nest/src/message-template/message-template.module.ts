import { forwardRef, Module } from '@nestjs/common';
import { MessageTemplateService } from './message-template.service';
import { MessageTemplateController } from './message-template.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MessageTemplate,
  MessageTemplateSchema,
} from './message-template.schema';
import { WorkspaceUserModule } from 'src/workspace-user/workspace-user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Token, TokenSchema } from 'src/auth-guard/token.schema';
import { AdminModule } from 'src/admin/admin.module';
import { UserModule } from 'src/user/user.module';
import { WorkspaceModule } from 'src/workspace/workspace.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MessageTemplate.name, schema: MessageTemplateSchema },
      { name: Token.name, schema: TokenSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => WorkspaceUserModule),
    forwardRef(() => WorkspaceModule),
    forwardRef(() => UserModule),
    forwardRef(() => AdminModule),
  ],
  providers: [MessageTemplateService],
  controllers: [MessageTemplateController],
  exports: [MessageTemplateService],
})
export class MessageTemplateModule {}
