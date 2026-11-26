import { apiRequest } from "./http";
import type { BooksResponse } from "../types/book.js";

export function getBooks(): Promise<BooksResponse> {
  return apiRequest<BooksResponse>("/books");
}
