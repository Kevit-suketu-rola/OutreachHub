import { forwardRef, Module } from '@nestjs/common';
import { CampaignMessageService } from './campaign-message.service';
import { CampaignMessageController } from './campaign-message.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import {
  CampaignMessage,
  CampaignMessageSchema,
} from './campaign-message.schema';
import { Token, TokenSchema } from 'src/auth-guard/token.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactModule } from 'src/contact/contact.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Token.name, schema: TokenSchema },
      { name: CampaignMessage.name, schema: CampaignMessageSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => ContactModule),
  ],
  providers: [CampaignMessageService],
  controllers: [CampaignMessageController],
  exports: [CampaignMessageService],
})
export class CampaignMessageModule {}
