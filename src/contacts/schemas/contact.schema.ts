import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContactDocument = Contact & Document;

@Schema({
  timestamps: true,
  collection: 'contactMsg',
  strict: false,
})
export class Contact {
  @Prop()
  name?: string;

  @Prop()
  email?: string;

  @Prop()
  phone?: string;

  @Prop()
  subject?: string;

  @Prop()
  message?: string;

  @Prop()
  date?: string;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);

ContactSchema.index({ email: 1, createdAt: -1 });

