import { booksRepository } from "../books/books.repository";
import { readingSessionsRepository } from "./reading-sessions.repository";
import { CreateReadingSessionInput } from "./reading-sessions.types";

export class BookNotFoundError extends Error {
  constructor() {
    super("Book not found");
  }
}

export class PagesLimitExceededError extends Error {
  constructor() {
    super("Total read pages cannot exceed book total pages");
  }
}

export const readingSessionsService = {
  async create(input: CreateReadingSessionInput) {
    const book = await booksRepository.findById(input.bookId);

    if (!book) {
      throw new BookNotFoundError();
    }

    console.log("po book", book);
    const previousPages =
      await readingSessionsRepository.countPagesExcludingDate({
        bookId: input.bookId,
      });

    const totalAfterSave = previousPages + input.pagesRead;

    if (totalAfterSave > book.totalPages) {
      throw new PagesLimitExceededError();
    }

    return readingSessionsRepository.createSession(input);
  },
  findAll() {},
};
