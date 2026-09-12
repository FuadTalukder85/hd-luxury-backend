import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({
  timestamps: true,
  collection: 'reviews',
  strict: false,
})
export class Review {
  @Prop()
  userName?: string;

  @Prop()
  userEmail?: string;

  @Prop()
  userImage?: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  rating?: any;

  @Prop()
  comment?: string;

  @Prop()
  date?: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.index({ userEmail: 1, createdAt: -1 });

