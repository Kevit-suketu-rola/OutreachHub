import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from './auth-guard/token.schema';
import { JwtModule } from '@nestjs/jwt';
import { AdminModule } from './admin/admin.module';
import { Admin, AdminSchema } from './admin/admin.schema';
import { UserModule } from './user/user.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { CampaignModule } from './campaign/campaign.module';
import { ContactModule } from './contact/contact.module';
import { MessageTemplateModule } from './message-template/message-template.module';
import { WorkspaceUserModule } from './workspace-user/workspace-user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { FileUploadModule } from './file-upload/file-upload.module';
import { CampaignMessageModule } from './campaign-message/campaign-message.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: Token.name,
        schema: TokenSchema,
      },
      {
        name: Admin.name,
        schema: AdminSchema,
      },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    AdminModule,
    UserModule,
    WorkspaceModule,
    CampaignModule,
    CampaignMessageModule,
    ContactModule,
    MessageTemplateModule,
    WorkspaceUserModule,
    FileUploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
