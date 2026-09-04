export interface PaginatedResponse<U> {
  data: U[];
  metaData: {
    ItemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
  };
  links: {
    previous: string;
    current: string;
    next: string;
    first: string;
    last: string;
  };
}
