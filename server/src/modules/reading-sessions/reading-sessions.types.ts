export interface CreateReadingSessionInput {
  bookId: string;
  readingDate: string;
  pagesRead: number;
  note?: string;
}

export interface ReadingSessionRow {
  id: string;
  book_id: string;
  reading_date: string;
  pages_read: number;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpsertReadingSessionInput {
  bookId: string;
  readingDate: string;
  pagesRead: number;
  note?: string;
}

export interface ReadingSessionDto {
  id: string;
  bookId: string;
  readingDate: string;
  pagesRead: number;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}
