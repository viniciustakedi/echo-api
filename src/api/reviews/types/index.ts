import { Types } from 'mongoose';

export namespace ReviewsNamespace {
  export enum EReviewKeyTypes {
    id = '_id',
    friendlyUrl = 'friendlyUrl',
  }

  export interface FindOneDBResponse {
    _id: Types.ObjectId;
    thumbnail: string;
    headline: string;
    friendlyUrl: string;
    content: string;
    claps: number;
    createdAt: Date;
    updatedAt?: Date;
    keyType?: EReviewKeyTypes;
    keyUsed?: string | Types.ObjectId;
  }

  export interface GetReviewsFilters {
    rating?: number;
    tags?: string[];
    limit?: number;
    page?: number;
    sort?: string;
  }
}
