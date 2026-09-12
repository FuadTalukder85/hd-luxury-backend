import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type PropertyDocument = Property & Document;

@Schema({
  timestamps: true,
  collection: 'property',
  strict: false,
})
export class Property {
  @Prop({ required: true, trim: true })
  propertyName: string;

  @Prop({ trim: true })
  email?: string;

  @Prop({ default: '' })
  propertyImage01?: string;

  @Prop({ default: '' })
  propertyImage02?: string;

  @Prop({ default: '' })
  propertyImage03?: string;

  @Prop({ default: '' })
  propertyImage04?: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  price?: any;

  @Prop()
  propertyFor?: string;

  @Prop()
  propertyCategory?: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  bedroom?: any;

  @Prop({ type: MongooseSchema.Types.Mixed })
  bathroom?: any;

  @Prop({ type: MongooseSchema.Types.Mixed })
  squareFoot?: any;

  @Prop({ type: MongooseSchema.Types.Mixed })
  floor?: any;

  @Prop({ type: MongooseSchema.Types.Mixed })
  buildYear?: any;

  @Prop()
  address?: string;

  @Prop()
  zipCode?: string;

  @Prop()
  city?: string;

  @Prop()
  country?: string;

  @Prop()
  description?: string;

  @Prop({ default: 'pending' })
  status?: string;

  @Prop()
  date?: string;
}

export const PropertySchema = SchemaFactory.createForClass(Property);

// Indexing for high-performance query patterns
PropertySchema.index({ status: 1, createdAt: -1 });
PropertySchema.index({ propertyFor: 1, status: 1, createdAt: -1 });
PropertySchema.index({ email: 1, status: 1, createdAt: -1 });
PropertySchema.index({ propertyCategory: 1, city: 1 });
PropertySchema.index({ propertyName: 'text', city: 'text', address: 'text', description: 'text' });

