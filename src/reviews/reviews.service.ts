import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueryBuilder } from '../common/builder/query-builder';
import { ReviewQueryDto } from '../common/dto/query.dto';
import { getFormattedDate } from '../common/utils/date-utils';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review, ReviewDocument } from './schemas/review.schema';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async createReviewIntoDB(payload: CreateReviewDto) {
    const formattedDate = getFormattedDate(true);
    payload.date = formattedDate;

    return this.reviewModel.create(payload);
  }

  async getAllReviewsFromDB(query: ReviewQueryDto) {
    const searchableFields = ['userName', 'userEmail', 'comment'];
    
    const modifiedQuery = {
      ...query,
      limit: query?.limit ? Number(query.limit) : 50,
      page: query?.page ? Number(query.page) : 1,
    };

    const reviewQuery = new QueryBuilder(this.reviewModel.find(), modifiedQuery)
      .search(searchableFields)
      .filter();

    const result = await reviewQuery.execute(this.reviewModel);
    return result;
  }
}
