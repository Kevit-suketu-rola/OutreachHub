import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Token {
  @Prop({ required: true })
  token: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId})
  userId: mongoose.Types.ObjectId;
}
export const TokenSchema = SchemaFactory.createForClass(Token);
