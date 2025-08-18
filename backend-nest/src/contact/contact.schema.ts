import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ContactInfo } from 'src/common.schema';

@Schema()
export class Contact {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Workspace',
  })
  workspaceId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  creator: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({
    required: false,
    default: 'https://www.w3schools.com/howto/img_avatar.png',
  })
  profilePicture: string;

  @Prop()
  contactInfo: ContactInfo;

  @Prop()
  company: string;

  @Prop()
  jobTitle: string;

  @Prop()
  tags: string[];

  @Prop({ default: false })
  isDeleted: boolean;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
