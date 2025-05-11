import { Types } from 'mongoose';

export namespace TagsNamespace {
  export interface GetTagsFilter {
    name?: string;
    limit?: number;
    page?: number;
    orderBy?: 'asc' | 'desc';
    sort?: string;
  }
}
