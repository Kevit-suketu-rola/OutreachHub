import { Module, forwardRef } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from 'src/auth-guard/token.schema';
import { Campaign, CampaignSchema } from './campaign.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  MessageTemplate,
  MessageTemplateSchema,
} from 'src/message-template/message-template.schema';
import { UserModule } from 'src/user/user.module';
import { WorkspaceUserModule } from 'src/workspace-user/workspace-user.module';
import { ContactModule } from 'src/contact/contact.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Token.name, schema: TokenSchema },
      { name: Campaign.name, schema: CampaignSchema },
      { name: MessageTemplate.name, schema: MessageTemplateSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => UserModule),
    forwardRef(() => ContactModule),
    forwardRef(() => WorkspaceUserModule),
  ],
  providers: [CampaignService],
  controllers: [CampaignController],
})
export class CampaignModule {}
