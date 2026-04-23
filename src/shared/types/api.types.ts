/** Standard success response wrapper from the backend. */
export interface ApiResponse<T> {
  success: true;
  data: T;
}

/** Paginated response wrapper with metadata. */
export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

/** Normalized error shape for all API errors. */
export interface AppError {
  code: string;
  message: string;
  statusCode: number;
}
