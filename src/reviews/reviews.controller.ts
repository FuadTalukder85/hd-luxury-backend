import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ReviewQueryDto } from '../common/dto/query.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';

@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get(['reviews', 'review'])
  async getAllReviews(@Query() query: ReviewQueryDto) {
    return this.reviewsService.getAllReviewsFromDB(query);
  }

  @Post(['reviews', 'review'])
  @HttpCode(HttpStatus.CREATED)
  async createReview(@Body() createReviewDto: CreateReviewDto) {
    const result = await this.reviewsService.createReviewIntoDB(createReviewDto);
    return {
      success: true,
      data: result,
    };
  }
}
