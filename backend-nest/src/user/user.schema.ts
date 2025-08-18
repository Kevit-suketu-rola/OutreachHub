import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { mongo } from 'mongoose';
import { ContactInfo } from 'src/common.schema';

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  contactInfo: ContactInfo;

  @Prop({ type: Date, default: Date.now })
  joinDate: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', default: null })
  currentWorkspace: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
