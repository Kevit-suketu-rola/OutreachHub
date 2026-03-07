import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class MessageTemplate {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  workspaceId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, enum: ['text', 'text-image'] })
  type: 'text' | 'text-image';

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: false })
  templateImage?: string;

  @Prop({ type: String, required: true })
  template: string;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export const MessageTemplateSchema =
  SchemaFactory.createForClass(MessageTemplate);
