import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserQueryDto } from '../common/dto/query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(['users', 'user'])
  async getAllUsers(@Query() query: UserQueryDto) {
    return this.usersService.getAllUsersFromDB(query);
  }

  @Post(['users', 'user'])
  async createUser(@Body() createUserDto: CreateUserDto) {
    const result = await this.usersService.createUserIntoDB(createUserDto);
    return {
      success: true,
      data: result,
    };
  }

  @Get(['users/:id', 'user/:id'])
  async getSingleUser(@Param('id') id: string) {
    const result = await this.usersService.getSingleUserFromDB(id);
    return {
      success: true,
      data: result,
    };
  }

  @Patch(['users/:id', 'user/:id'])
  async updateUserPatch(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const result = await this.usersService.updateUserInDB(id, updateUserDto);
    return {
      success: true,
      data: result,
    };
  }

  @Put(['users/:id', 'user/:id'])
  async updateUserPut(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const result = await this.usersService.updateUserInDB(id, updateUserDto);
    return {
      success: true,
      data: result,
    };
  }

  @Delete(['users/:id', 'user/:id'])
  async deleteUser(@Param('id') id: string) {
    const result = await this.usersService.deleteUserFromDB(id);
    return {
      success: true,
      data: result,
    };
  }

  @Patch(['user/role/:id', 'users/role/:id'])
  async updateUserRole(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    const result = await this.usersService.updateUserRoleInDB(id, updateUserRoleDto);
    return {
      success: true,
      data: result,
    };
  }
}
