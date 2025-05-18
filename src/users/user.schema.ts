import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({
    type: String,
    isRequired: true,
  })
  firstName: string;

  @Prop({
    type: String,
    isRequired: true,
  })
  lastName: string;

  @Prop({
    type: String,
    isRequired: true,
  })
  email: string;

  @Prop({
    type: String,
    isRequired: true,
  })
  password: string;

  @Prop({
    type: String,
    isRequired: true,
  })
  phoneNumber: string;
}

export const userSchema = SchemaFactory.createForClass(User);
