import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { QueryBuilder } from '../common/builder/query-builder';
import { UserQueryDto } from '../common/dto/query.dto';
import { getFormattedDate } from '../common/utils/date-utils';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {}

  async createUserIntoDB(payload: CreateUserDto) {
    const existingUser = await this.userModel.findOne({ email: payload.email }).lean();
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const saltRounds =
      Number(this.configService.get<string>('BCRYPT_SALT_ROUNDS')) || 10;
    const hashedPassword = await bcrypt.hash(payload.password, saltRounds);
    const formattedDate = getFormattedDate(false);

    const userData = {
      ...payload,
      password: hashedPassword,
      date: formattedDate,
    };

    const newUser = await this.userModel.create(userData);
    const userObj = newUser.toObject();
    delete userObj.password;
    return userObj;
  }

  async getAllUsersFromDB(query: UserQueryDto) {
    const searchableFields = ['name', 'email', 'address', 'number'];
    
    const modifiedQuery = {
      ...query,
      limit: query?.limit ? Number(query.limit) : 50,
      page: query?.page ? Number(query.page) : 1,
    };

    const userQuery = new QueryBuilder(this.userModel.find().select('-password'), modifiedQuery)
      .search(searchableFields)
      .filter();

    const result = await userQuery.execute(this.userModel);
    return result;
  }

  async getSingleUserFromDB(id: string) {
    const user = await this.userModel.findById(id).select('-password').lean();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUserInDB(id: string, payload: UpdateUserDto) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            name: payload.name,
            image: payload.image,
            number: payload.number,
            address: payload.address,
          },
        },
        { new: true, runValidators: true },
      )
      .select('-password')
      .lean();

    return updatedUser;
  }

  async updateUserRoleInDB(id: string, rolePayload: UpdateUserRoleDto) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        { role: rolePayload.role },
        { new: true, runValidators: true },
      )
      .select('-password')
      .lean();

    return updatedUser;
  }

  async deleteUserFromDB(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userModel.findByIdAndDelete(id);
  }
}
