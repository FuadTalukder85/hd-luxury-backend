import { IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsOptional()
  @IsString()
  userName?: string;

  @IsOptional()
  @IsString()
  userEmail?: string;

  @IsOptional()
  @IsString()
  userImage?: string;

  @IsOptional()
  rating?: any;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsString()
  date?: string;

  [key: string]: any;
}
