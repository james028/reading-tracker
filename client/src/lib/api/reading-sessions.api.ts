import { apiRequest } from "#lib/api/http.ts";

export interface ReadingSession {
  id: string;
  bookId: string;
  readingDate: string;
  pagesRead: number;
  note?: string | null;
  createdAt: string;
}

export interface CreateReadingSessionInput {
  bookId: string;
  readingDate: string;
  pagesRead: number;
  note?: string;
}

export function createReadingSessions(
  input: CreateReadingSessionInput,
): Promise<ReadingSession> {
  return apiRequest<ReadingSession>(`/books/${input.bookId}/reading-sessions`, {
    method: "POST",
    body: JSON.stringify({
      pagesRead: input.pagesRead,
      readingDate: input.readingDate,
      ...(input.note !== undefined && { note: input.note }),
    }),
  });
}
