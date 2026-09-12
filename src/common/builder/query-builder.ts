import { FilterQuery, Model } from 'mongoose';

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IPaginatedResult<T> {
  success: boolean;
  data: T[];
  meta: IPaginationMeta;
}

export class QueryBuilder<T = any> {
  public modelQuery: any;
  public query: Record<string, any>;
  private filterConditions: FilterQuery<any> = {};

  constructor(modelQuery: any, query: Record<string, any>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const search = this.query?.search;
    if (search && searchableFields.length > 0) {
      const searchRegex = new RegExp(search, 'i');
      const searchConditions = searchableFields.map((field) => ({
        [field]: { $regex: searchRegex },
      }));

      this.filterConditions = {
        ...this.filterConditions,
        $or: searchConditions,
      };
    }
    return this;
  }

  filter(excludeFields: string[] = ['search', 'page', 'limit', 'sortBy', 'sortOrder']) {
    const queryObj = { ...this.query };
    excludeFields.forEach((el) => delete queryObj[el]);

    const exactFilters: Record<string, any> = {};

    for (const [key, value] of Object.entries(queryObj)) {
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'minPrice' || key === 'maxPrice') {
          continue;
        }
        if (key === 'bedroom' || key === 'bathroom') {
          exactFilters[key] = Number(value);
        } else if (typeof value === 'string') {
          exactFilters[key] = { $regex: new RegExp(`^${value.trim()}$`, 'i') };
        } else {
          exactFilters[key] = value;
        }
      }
    }

    if (this.query.minPrice !== undefined || this.query.maxPrice !== undefined) {
      const priceCondition: Record<string, any> = {};
      if (this.query.minPrice !== undefined) {
        priceCondition.$gte = Number(this.query.minPrice);
      }
      if (this.query.maxPrice !== undefined) {
        priceCondition.$lte = Number(this.query.maxPrice);
      }
      exactFilters.price = priceCondition;
    }

    this.filterConditions = {
      ...this.filterConditions,
      ...exactFilters,
    };

    return this;
  }

  sort() {
    const sortBy = this.query?.sortBy || 'createdAt';
    const sortOrder = (this.query?.sortOrder || 'desc').toLowerCase() === 'asc' ? 1 : -1;
    this.modelQuery = this.modelQuery.sort({ [sortBy]: sortOrder });
    return this;
  }

  paginate() {
    const page = Math.max(1, Number(this.query?.page) || 1);
    const limit = Math.max(1, Number(this.query?.limit) || 10);
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  fields() {
    if (this.query?.fields) {
      const fields = (this.query.fields as string).split(',').join(' ');
      this.modelQuery = this.modelQuery.select(fields);
    }
    return this;
  }

  async execute(model: Model<any>): Promise<IPaginatedResult<T>> {
    this.modelQuery = this.modelQuery.find(this.filterConditions);

    this.sort().paginate().fields();

    const page = Math.max(1, Number(this.query?.page) || 1);
    const limit = Math.max(1, Number(this.query?.limit) || 10);

    const [data, total] = await Promise.all([
      this.modelQuery.lean().exec(),
      model.countDocuments(this.filterConditions),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      success: true,
      data: data as T[],
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }
}
