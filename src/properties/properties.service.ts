import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueryBuilder } from '../common/builder/query-builder';
import { PropertyQueryDto } from '../common/dto/query.dto';
import { getFormattedDate } from '../common/utils/date-utils';
import { User, UserDocument } from '../users/schemas/user.schema';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property, PropertyDocument } from './schemas/property.schema';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(Property.name)
    private propertyModel: Model<PropertyDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createPropertyIntoDB(payload: CreatePropertyDto) {
    if (payload.email) {
      const userInfo = await this.userModel.findOne({ email: payload.email }).lean();
      if (!userInfo) {
        throw new BadRequestException('User not found');
      }

      if (userInfo.role === 'Agent') {
        payload.status = 'pending';
      } else if (userInfo.role === 'Admin') {
        payload.status = 'approved';
      }
    }

    const formattedDate = getFormattedDate(false);
    payload.date = formattedDate;

    const newProperty = await this.propertyModel.create(payload);
    return newProperty;
  }

  async getAllPropertiesFromDB(query: PropertyQueryDto) {
    const searchableFields = ['propertyName', 'city', 'address', 'description', 'propertyCategory'];
    
    // Default limit to 50 if not specified to avoid unbounded fetch, while supporting pagination
    const modifiedQuery = {
      ...query,
      limit: query?.limit ? Number(query.limit) : 50,
      page: query?.page ? Number(query.page) : 1,
    };

    const propertyQuery = new QueryBuilder(this.propertyModel.find(), modifiedQuery)
      .search(searchableFields)
      .filter();

    const result = await propertyQuery.execute(this.propertyModel);

    // Efficiently attach user information for the current paginated properties (Resolves N+1 problem)
    const emails = [...new Set(result.data.map((p: any) => p.email).filter(Boolean))];
    if (emails.length > 0) {
      const users = await this.userModel
        .find({ email: { $in: emails } })
        .select('name email image role')
        .lean();

      const userMap = new Map(users.map((u) => [u.email, u]));

      result.data = result.data.map((p: any) => {
        const user = userMap.get(p.email);
        return {
          ...p,
          userName: user?.name || 'Unknown Agent',
          userImage: user?.image || '',
          userRole: user?.role || 'Agent',
        };
      });
    }

    return result;
  }

  async getSinglePropertyFromDB(id: string) {
    const property = await this.propertyModel.findById(id).lean();
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.email) {
      const user = await this.userModel
        .findOne({ email: property.email })
        .select('name email image role number address')
        .lean();
      if (user) {
        (property as any).userName = user.name;
        (property as any).userImage = user.image;
        (property as any).userRole = user.role;
        (property as any).userNumber = user.number;
      }
    }

    return property;
  }

  async updatePropertyStatusInDB(id: string, status: string) {
    const property = await this.propertyModel.findById(id);
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const result = await this.propertyModel.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    ).lean();
    return result;
  }

  async updatePropertyInDB(id: string, payload: UpdatePropertyDto) {
    const property = await this.propertyModel.findById(id);
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const result = await this.propertyModel.findByIdAndUpdate(
      id,
      { $set: payload },
      { new: true, upsert: true, runValidators: true },
    ).lean();
    return result;
  }

  async deletePropertyFromDB(id: string) {
    const property = await this.propertyModel.findById(id);
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return this.propertyModel.findByIdAndDelete(id);
  }
}
