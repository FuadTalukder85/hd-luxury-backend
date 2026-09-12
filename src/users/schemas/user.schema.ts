import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  collection: 'users',
  toJSON: {
    transform(_doc, ret: any) {
      delete ret.password;
      return ret;
    },
  },
})
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, select: false })
  password?: string;

  @Prop({ default: '' })
  image?: string;

  @Prop({ default: '' })
  number?: string;

  @Prop({ default: '' })
  address?: string;

  @Prop({
    type: String,
    enum: ['Admin', 'Agent', 'User'],
    default: 'User',
  })
  role?: string;

  @Prop()
  date?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ role: 1, createdAt: -1 });
UserSchema.index({ name: 'text', email: 'text' });

