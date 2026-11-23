import { apiRequest } from "./http.ts";
import type { BooksResponse } from "#lib";

export function getBooks(): Promise<BooksResponse> {
  return apiRequest<BooksResponse>("/books");
}
