import { Response } from 'express';
import { ApiResponse, PaginationResult } from '../types';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
  pagination?: PaginationResult,
): void => {
  const response: ApiResponse<T> = { success: true, message, data };
  if (pagination) response.pagination = pagination;
  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message = 'Something went wrong',
  statusCode = 500,
  errors?: string[],
): void => {
  const response: ApiResponse = { success: false, message };
  if (errors?.length) response.errors = errors;
  res.status(statusCode).json(response);
};

export const paginate = (page: number, limit: number, total: number): PaginationResult => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});

export const parsePagination = (
  pageStr?: string,
  limitStr?: string,
): { page: number; limit: number; skip: number } => {
  const page = Math.max(1, parseInt(pageStr || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(limitStr || '12', 10)));
  return { page, limit, skip: (page - 1) * limit };
};
