import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class ContactInfo {
  @Prop()
  countryCode: string;

  @Prop()
  phoneNumber: number;

  @Prop({
    required: true,
    type: String,
    match:
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  })
  email: string;
}

@Schema({ _id: false })
export class Permissions {
  @Prop({ type: Boolean, default: false })
  write: boolean;
  @Prop({ type: Boolean, default: false })
  allowAdd: boolean;
}

export const ContactInfoSchema = SchemaFactory.createForClass(ContactInfo);
export const PermissionsSchema = SchemaFactory.createForClass(Permissions);
