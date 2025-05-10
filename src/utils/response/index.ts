import { HttpStatus } from '@nestjs/common';

export interface ITextResponse {
  statusCode: HttpStatus;
  message: string;
}

/**
 * Generates a standardized text response object containing a message and an HTTP status code.
 *
 * @param message - The message to include in the response.
 * @param statusCode - The HTTP status code to include in the response.
 * @returns An object containing the provided message and status code.
 *
 * @example
 * ```typescript
 * const response = textResponse("Success", 200);
 * console.log(response);
 * // Output: { message: "Success", statusCode: 200 }
 * ```
 */

export const textResponse = (
  message: string,
  statusCode: HttpStatus,
): ITextResponse => {
  return {
    message,
    statusCode,
  };
};

export interface IDataResponse extends ITextResponse {
  data: any;
  total: number;
}

/**
 * Generates a standardized data response object containing a data, total, message and an HTTP status code.
 *
 * @param data - The data to include in the response.
 * @param total - The total of array to include in the response if is an object the value will be 1.
 * @param message - The message to include in the response.
 * @param statusCode - The HTTP status code to include in the response.
 * @returns An object containing the provided data, total, message and status code.
 *
 * @example
 * ```typescript
 * const response = textResponse(data, data.length, "Success", 200);
 * console.log(response);
 * // Output: { [{name: "Jane Doe", age: 32}], total: 1, message: "Success", statusCode: 200 }
 * ```
 */
export const dataResponse = (
  data: any,
  total: number,
  message: string,
  statusCode: HttpStatus,
): IDataResponse => {
  return {
    data,
    total,
    message: message,
    statusCode,
  };
};

export interface IDataResponseWithPagination extends IDataResponse {
  page: number;
  limit: number;
}

/**
 * Generates a standardized data response object with pagination, containing data, total, page, limit, message, and an HTTP status code.
 *
 * @param data - The data to include in the response.
 * @param total - The total number of items. If the data is an object, the value will be 1.
 * @param page - The current page number.
 * @param limit - The maximum number of items per page.
 * @param message - The message to include in the response.
 * @param statusCode - The HTTP status code to include in the response.
 * @returns An object containing the provided data, total, page, limit, message, and status code.
 *
 * @example
 * ```typescript
 * const response = dataResponseWithPagination(
 *   [{ name: "Jane Doe", age: 32 }],
 *   1,
 *   1,
 *   10,
 *   "Success",
 *   200
 * );
 * console.log(response);
 * // Output: { data: [{ name: "Jane Doe", age: 32 }], total: 1, page: 1, limit: 10, message: "Success", statusCode: 200 }
 * ```
 */
export const dataResponseWithPagination = (
  data: any,
  total: number,
  page: number,
  limit: number,
  message: string,
  statusCode: HttpStatus,
): IDataResponseWithPagination => {
  return {
    data,
    total,
    page,
    limit,
    message: message,
    statusCode,
  };
};
