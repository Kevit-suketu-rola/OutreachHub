import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from './auth-guard/token.schema';
import { JwtModule } from '@nestjs/jwt';
import { AdminModule } from './admin/admin.module';
import { Admin, AdminSchema } from './admin/admin.schema';
import { WorkspaceModule } from './workspace/workspace.module';
import { CampaignModule } from './campaign/campaign.module';
import { WorkspaceUserModule } from './workspace-user/workspace-user.module';
import { UserModule } from './user/user.module';
import { MessageTemplateModule } from './message-template/message-template.module';
import { ContactModule } from './contact/contact.module';
import { CampaignMessageModule } from './campaign-message/campaign-message.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
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
    AdminModule,
    WorkspaceUserModule,
    UserModule,
    WorkspaceModule,
    CampaignModule,
    MessageTemplateModule,
    ContactModule,
    CampaignMessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
