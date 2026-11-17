import { apiRequest } from "./http";
import type { BooksResponse } from "#lib/types/book.ts";

export function getBooks(): Promise<BooksResponse> {
  return apiRequest<BooksResponse>("/books");
}
