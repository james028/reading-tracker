import path from "node:path";
import { query } from "../../db/database";
import { readFile } from "node:fs/promises";
import {
  ReadingSessionDto,
  ReadingSessionRow,
  UpsertReadingSessionInput,
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
  async upsert(input: UpsertReadingSessionInput): Promise<ReadingSessionDto> {
    const sql = await loadSql("upsert-reading-session.sql");

    const rows = await query<ReadingSessionRow>(sql, [
      input.bookId,
      input.readingDate,
      input.pagesRead,
      input.note ?? null,
    ]);

    // @ts-ignore
    return mapReadingSessionRow(rows[0]);
  },
  async countPagesExcludingDate(params: {
    bookId: string;
    readingDate: string;
  }): Promise<number> {
    const sql = await loadSql("count-pages-excluding-date.sql");

    const rows = await query<{ pages_read: string }>(sql, [
      params.bookId,
      params.readingDate,
    ]);

    return Number(rows[0]?.pages_read);
  },
};
