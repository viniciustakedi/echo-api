import { HttpStatus } from '@nestjs/common';

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
): { statusCode: HttpStatus; message: string } => {
  return {
    message,
    statusCode,
  };
};

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
): { data: any; total: number; message: string; statusCode: HttpStatus } => {
  return {
    data,
    total,
    message: message,
    statusCode,
  };
};
