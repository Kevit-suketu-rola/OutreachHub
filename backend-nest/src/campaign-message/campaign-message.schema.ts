import { Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class CampaignMessage {}
export const CampaignMessageSchema =
  SchemaFactory.createForClass(CampaignMessage);
