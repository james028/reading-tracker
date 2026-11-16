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
    const sql = await loadSql("create-reading-sessions.sql");

    console.log(input, "input");
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
    const sql = await loadSql("count-pages-excluding-date.sql");

    const rows = await query<{ pages_read: string }>(sql, [params.bookId]);

    return Number(rows[0]?.pages_read);
  },
};
