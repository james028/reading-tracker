import path from "node:path";
import { query } from "../../db/database";
import { readFile } from "node:fs/promises";
import {
  CreateReadingSessionInput,
  ReadingSessionDto,
  ReadingSessionRow,
} from "./reading-sessions.types";

const sqlDirectory = path.join(__dirname, "sql");

async function loadSql(fileName: string): Promise<string> {
  return readFile(path.join(sqlDirectory, fileName), "utf8");
}

function mapReadingSessionRow(row: ReadingSessionRow): ReadingSessionDto {
  return {
    id: row.id,
    bookId: row.book_id,
    readingDate: row.reading_date,
    pagesRead: row.pages_read,
    note: row.note,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const readingSessionsRepository = {
  async createSession(
    input: CreateReadingSessionInput,
  ): Promise<ReadingSessionDto> {
    const sql = `INSERT INTO reading_sessions (book_id,
                                                   reading_date,
                                                   pages_read,
                                                   note)
                     VALUES ($1,
                             $2,
                             $3,
                             $4)
                     RETURNING
                         id,
                         book_id,
                         reading_date,
                         pages_read,
                         note,
                         created_at,
                         updated_at;`;

    const rows = await query<ReadingSessionRow>(sql, [
      input.bookId,
      input.readingDate,
      input.pagesRead,
      input.note ?? null,
    ]);

    const row = rows[0];

    if (!row) {
      throw new Error("Failed to create reading session");
    }

    return mapReadingSessionRow(row);
  },
  async countPagesExcludingDate(params: { bookId: string }): Promise<number> {
    const sql = `SELECT COALESCE(SUM(pages_read), 0) AS pages_read
                     FROM reading_sessions
                     WHERE book_id = $1;`;

    const rows = await query<{ pages_read: string }>(sql, [params.bookId]);

    return Number(rows[0]?.pages_read);
  },
};
