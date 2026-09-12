import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PropertyQueryDto } from '../common/dto/query.dto';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertiesService } from './properties.service';

@Controller()
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get(['properties', 'property'])
  async getAllProperties(@Query() query: PropertyQueryDto) {
    return this.propertiesService.getAllPropertiesFromDB(query);
  }

  @Post(['properties', 'property'])
  @HttpCode(HttpStatus.CREATED)
  async createProperty(@Body() createPropertyDto: CreatePropertyDto) {
    const result =
      await this.propertiesService.createPropertyIntoDB(createPropertyDto);
    return {
      success: true,
      data: result,
    };
  }

  @Get(['properties/:id', 'property/:id'])
  async getSingleProperty(@Param('id') id: string) {
    const data = await this.propertiesService.getSinglePropertyFromDB(id);
    return {
      success: true,
      data,
    };
  }

  @Patch(['properties/:id', 'property/:id'])
  async updatePropertyPatch(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    if (body && body.status && Object.keys(body).length === 1) {
      const result = await this.propertiesService.updatePropertyStatusInDB(id, body.status);
      return {
        success: true,
        message: `Status updated to ${body.status}`,
        data: result,
      };
    }
    const result = await this.propertiesService.updatePropertyInDB(id, body);
    return {
      success: true,
      data: result,
    };
  }

  @Put(['properties/:id', 'property/:id'])
  async updatePropertyPut(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    const result = await this.propertiesService.updatePropertyInDB(id, updatePropertyDto);
    return {
      success: true,
      data: result,
    };
  }

  @Delete(['properties/:id', 'property/:id'])
  async deleteProperty(@Param('id') id: string) {
    const result = await this.propertiesService.deletePropertyFromDB(id);
    return {
      success: true,
      data: result,
    };
  }
}
