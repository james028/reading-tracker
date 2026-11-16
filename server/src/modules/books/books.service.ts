import { booksRepository } from "./books.repository";
import type {
  BookDto,
  CreateBookInput,
  GetBooksQuery,
  PaginatedBooksDto,
} from "./books.types";

export const booksService = {
  async getBooks(params: GetBooksQuery): Promise<PaginatedBooksDto> {
    const { items, total } = await booksRepository.findAll(params);

    return {
      items,
      meta: {
        page: params.page,
        limit: params.limit,
        totalItems: total,
        totalPages: Math.ceil(total / params.limit),
      },
    };
  },

  async createBook(input: CreateBookInput): Promise<BookDto> {
    return booksRepository.create(input);
  },
};
