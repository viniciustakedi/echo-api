import { Types } from 'mongoose';

export namespace MapMarkersNamespace {
  export interface FindOneDBResponse {
    _id: Types.ObjectId;
    thumbnail: string;
    headline: string;
    friendlyUrl: string;
    content: string;
    claps: number;
    createdAt: Date;
    updatedAt?: Date;
  }

  export interface GetMapMarkersFilters {
    rating?: number;
    tags?: string[];
    limit?: number;
    page?: number;
    sort?: string;
  }
}
