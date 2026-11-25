import {
  booksRepository,
  BookTitleAlreadyExistsError,
} from "./books.repository";
import type {
  BookRow,
  CreateBookInput,
  GetBooksQuery,
  PaginatedBooksDto,
} from "./books.types";

export class ConflictError extends Error {
  statusCode = 409;

  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

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

  async createBook(input: CreateBookInput): Promise<BookRow> {
    try {
      return await booksRepository.create(input);
    } catch (error) {
      if (error instanceof BookTitleAlreadyExistsError) {
        throw new ConflictError("Book with this title already exists");
      }
      throw error;
    }
  },
};
