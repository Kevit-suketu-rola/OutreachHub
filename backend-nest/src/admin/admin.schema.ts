import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ContactInfo, ContactInfoSchema } from 'src/common.schema';

@Schema()
export class Admin {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
    unique: true,
  })
  @Prop({ required: true, type: ContactInfoSchema })
  contactInfo: ContactInfo;

  @Prop({ default: Date.now })
  joinDate: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
