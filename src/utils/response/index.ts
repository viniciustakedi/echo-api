export const textResponse = (
  message: string,
  statusCode: number,
): { statusCode: number; message: string } => {
  return {
    message,
    statusCode,
  };
};

export const dataResponse = (
  data: any,
  total: number,
  message: string,
  statusCode: number,
): { data: any; total: number; message: string; statusCode: number } => {
  return {
    data,
    total,
    message: message,
    statusCode,
  };
};
