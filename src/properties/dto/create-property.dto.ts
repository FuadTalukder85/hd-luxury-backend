import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePropertyDto {
  @IsNotEmpty()
  @IsString()
  propertyName: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  propertyImage01?: string;

  @IsOptional()
  @IsString()
  propertyImage02?: string;

  @IsOptional()
  @IsString()
  propertyImage03?: string;

  @IsOptional()
  @IsString()
  propertyImage04?: string;

  @IsOptional()
  price?: any;

  @IsOptional()
  @IsString()
  propertyFor?: string;

  @IsOptional()
  @IsString()
  propertyCategory?: string;

  @IsOptional()
  bedroom?: any;

  @IsOptional()
  bathroom?: any;

  @IsOptional()
  squareFoot?: any;

  @IsOptional()
  floor?: any;

  @IsOptional()
  buildYear?: any;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  date?: string;

  [key: string]: any;
}
