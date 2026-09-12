import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserRoleDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['Admin', 'Agent', 'User'])
  role: string;
}
