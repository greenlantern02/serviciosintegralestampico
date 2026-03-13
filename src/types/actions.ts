export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type PaginatedResult<T> = {
  docs: T[];
  totalDocs: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};
