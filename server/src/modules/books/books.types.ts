export interface BookRow {
  id: string;
  title: string;
  author: string | null;
  total_pages: number;
  created_at: string;
  updated_at: string;
}

export interface Book {
  id: string;
  title: string;
  author: string | null;
  totalPages: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookListItemDto extends Book {
  //totalPages: number;
  pagesRead: number;
  pagesLeft: number;
  progressPercent: number;
}

export interface BookDto {
  id: string;
  title: string;
  author: string | null;
  totalPages: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetBooksQuery {
  search?: string | undefined;
  page: number;
  limit: number;
}

export interface CreateBookInput {
  title: string;
  author?: string | undefined;
  totalPages: number;
}

export interface PaginatedBooksDto {
  items: BookDto[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
