import { IsOptional, IsString } from 'class-validator';

export class UpdatePropertyDto {
  @IsOptional()
  @IsString()
  propertyName?: string;

  [key: string]: any;
}


