export interface Pagination {
  next_key: string;
  total: string;
 }

 export interface PaginatedResponse {
  pagination: Pagination
 }
