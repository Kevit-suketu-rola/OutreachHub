import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Campaign {
  @Prop({ ref: 'Workspace' })
  workspaceId: string;

  @Prop({ ref: 'User' })
  creator: string;

  @Prop({ ref: 'User' })
  lastModifiedBy: string;

  @Prop({ ref: 'MessageTemplate' })
  templateId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: Date.now })
  creationDate: Date;

  @Prop({ default: [] })
  tags: string[];

  @Prop({
    type: String,
    enum: ['Draft', 'Running', 'Completed'],
    default: 'Draft',
  })
  status: string;

  @Prop({ default: Date.now })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
