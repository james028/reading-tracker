export interface Book {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  pagesRead: number;
  pagesLeft: number;
  progressPercent: number;
  createdAt: string;
  updatedAt: string;
}

export interface BooksMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface BooksResponse {
  items: Book[];
  meta: BooksMeta;
}

export interface CreateBookInput {
  title: string;
  author: string;
  totalPages: number;
  currentPage?: number;
}
