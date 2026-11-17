import { readFile } from "node:fs/promises";
import path from "node:path";
import { query } from "../../db/database";
import {
  BookDto,
  BookListItemDto,
  BookRow,
  CreateBookInput,
  GetBooksQuery,
} from "./books.types";
import { BookNotFoundError } from "../reading-sessions/reading-sessions.service";

const sqlDirectory = path.join(__dirname, "sql");

async function loadSql(fileName: string): Promise<string> {
  return readFile(path.join(sqlDirectory, fileName), "utf8");
}

function mapBookRow(row: BookRow[]): BookDto {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    totalPages: row.total_pages,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapBookListItem(row: any): BookListItemDto {
  const pagesRead = Number(row.pages_read);

  return {
    id: row.id,
    title: row.title,
    author: row.author,
    totalPages: row.total_pages,
    pagesRead,
    pagesLeft: Math.max(row.total_pages - pagesRead, 0),
    progressPercent:
      row.total_pages === 0
        ? 0
        : Number(((pagesRead / row.total_pages) * 100).toFixed(2)),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const booksRepository = {
  async findAll(params: GetBooksQuery): Promise<{
    items: BookDto[];
    total: number;
  }> {
    const search = params.search || null;
    const offset = (params.page - 1) * params.limit;

    const [selectSql, countSql] = await Promise.all([
      loadSql("select-books.sql"),
      loadSql("count-books.sql"),
    ]);

    const [rows, countRows] = await Promise.all([
      query<BookListItemDto>(selectSql, [search, params.limit, offset]),
      query<{
        total: string;
      }>(countSql, [search]),
    ]);

    if (!countRows) {
      throw new BookNotFoundError();
    }

    console.log(rows, "rows");
    return {
      items: rows.map(mapBookListItem),
      total: Number(countRows[0]?.total),
    };
  },

  async create(input: CreateBookInput): Promise<any> {
    const sql = await loadSql("insert-book.sql");

    const row = await query<BookRow>(sql, [
      input.title,
      input.author ?? null,
      input.totalPages,
    ]);

    if (!row) {
      throw new Error("Book not found");
    }

    //console.log(mapBookRow(row), "row", row);
    //return mapBookRow(row);
    return row[0];
  },

  async findById(id: string): Promise<BookDto | null> {
    const sql = await loadSql("select-book-by-id.sql");
    const rows = await query<any>(sql, [id]);

    //OK
    console.log(rows, " find id ");
    return rows[0] ? mapBookRow(rows[0]) : null;
  },
};
