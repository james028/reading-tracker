import { readFile } from "node:fs/promises";
import path from "node:path";
import { query } from "../../db/database";
import type {
  BookDto,
  BookRow,
  CreateBookInput,
  GetBooksQuery,
} from "./books.types";
import { BookNotFoundError } from "../reading-sessions/reading-sessions.service";

const sqlDirectory = path.join(__dirname, "sql");

async function loadSql(fileName: string): Promise<string> {
  return readFile(path.join(sqlDirectory, fileName), "utf8");
}

function mapBookRow(row: BookRow): BookDto {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    totalPages: row.total_pages,
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
      query<BookRow>(selectSql, [search, params.limit, offset]),
      query<{ total: string }>(countSql, [search]),
    ]);

    if (!countRows) {
      throw new BookNotFoundError();
    }
    return {
      items: rows.map(mapBookRow),
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

    //return mapBookRow(row);

    console.log(row, "row po create");
    // return {
    //   id: row.id,
    //   title: row.title,
    //   author: row.author,
    //   totalPages: row.total_pages,
    //   createdAt: row.created_at,
    //   updatedAt: row.updated_at,
    // }
  },

  async findById(id: string): Promise<BookDto | null> {
    const sql = await loadSql("select-book-by-id.sql");
    const rows = await query<any>(sql, [id]);

    console.log(rows, " find id ");
    return rows[0] ? mapBookRow(rows[0]) : null;
  },
};
