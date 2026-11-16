import { booksRepository } from "../books/books.repository";
import { UpsertReadingSessionInput } from "./reading-sessions.types";
import { readingSessionsRepository } from "./reading-sessions.repository";

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
  async upsert(input: UpsertReadingSessionInput) {
    const book = await booksRepository.findById(input.bookId);

    if (!book) {
      throw new BookNotFoundError();
    }

    const previousPages =
      await readingSessionsRepository.countPagesExcludingDate({
        bookId: input.bookId,
        readingDate: input.readingDate,
      });

    const totalAfterSave = previousPages + input.pagesRead;

    if (totalAfterSave > book.totalPages) {
      throw new PagesLimitExceededError();
    }

    return readingSessionsRepository.upsert(input);
  },
  findAll() {},
};
