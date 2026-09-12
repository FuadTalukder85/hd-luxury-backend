import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueryBuilder } from '../common/builder/query-builder';
import { ContactQueryDto } from '../common/dto/query.dto';
import { getFormattedDate } from '../common/utils/date-utils';
import { CreateContactDto } from './dto/create-contact.dto';
import { Contact, ContactDocument } from './schemas/contact.schema';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
  ) {}

  async createContactMessageIntoDB(payload: CreateContactDto) {
    const formattedDate = getFormattedDate(true);
    payload.date = formattedDate;

    return this.contactModel.create(payload);
  }

  async getAllContactMessagesFromDB(query: ContactQueryDto) {
    const searchableFields = ['name', 'email', 'phone', 'subject', 'message'];

    const modifiedQuery = {
      ...query,
      limit: query?.limit ? Number(query.limit) : 50,
      page: query?.page ? Number(query.page) : 1,
    };

    const contactQuery = new QueryBuilder(this.contactModel.find(), modifiedQuery)
      .search(searchableFields)
      .filter();

    const result = await contactQuery.execute(this.contactModel);
    return result;
  }

  async getSingleContactMessageFromDB(id: string) {
    const contact = await this.contactModel.findById(id).lean();
    if (!contact) {
      throw new NotFoundException('Contact message not found');
    }
    return contact;
  }

  async deleteContactMessageFromDB(id: string) {
    const isExist = await this.contactModel.findById(id);
    if (!isExist) {
      throw new NotFoundException('Contact message not found');
    }

    return this.contactModel.findByIdAndDelete(id);
  }
}
