import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ContactQueryDto } from '../common/dto/query.dto';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller()
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get(['contact', 'contactMsg'])
  async getAllContacts(@Query() query: ContactQueryDto) {
    return this.contactsService.getAllContactMessagesFromDB(query);
  }

  @Post(['contact', 'contactMsg'])
  @HttpCode(HttpStatus.CREATED)
  async createContact(@Body() createContactDto: CreateContactDto) {
    const result = await this.contactsService.createContactMessageIntoDB(createContactDto);
    return {
      success: true,
      data: result,
    };
  }

  @Get(['contact/:id', 'contactMsg/:id'])
  async getSingleContact(@Param('id') id: string) {
    const result = await this.contactsService.getSingleContactMessageFromDB(id);
    return {
      success: true,
      data: result,
    };
  }

  @Delete(['contact/:id', 'contactMsg/:id'])
  async deleteContact(@Param('id') id: string) {
    const result = await this.contactsService.deleteContactMessageFromDB(id);
    return {
      success: true,
      data: result,
    };
  }
}
