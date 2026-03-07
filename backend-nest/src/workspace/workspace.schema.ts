import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Workspace {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' })
  creator: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);
