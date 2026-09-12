import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from '../contacts/schemas/contact.schema';
import { Property, PropertyDocument } from '../properties/schemas/property.schema';
import { Review, ReviewDocument } from '../reviews/schemas/review.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Property.name)
    private propertyModel: Model<PropertyDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async getStatsCountFromDB() {
    const [
      totalProperty,
      pendingProperty,
      totalAgent,
      totalContact,
      totalReview,
    ] = await Promise.all([
      this.propertyModel.countDocuments(),
      this.propertyModel.countDocuments({ status: 'pending' }),
      this.userModel.countDocuments({ role: 'Agent' }),
      this.contactModel.countDocuments(),
      this.reviewModel.countDocuments(),
    ]);

    return {
      totalProperty,
      pendingProperty,
      totalAgent,
      totalReview,
      totalContact,
    };
  }
}
