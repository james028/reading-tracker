import { query } from "../../db/database";
import {
  BookDto,
  BookListItemDto,
  BookRow,
  CreateBookInput,
  GetBooksQuery,
} from "./books.types";
import { BookNotFoundError } from "../reading-sessions/reading-sessions.service";

// function mapBookRow(row: BookRow[]): BookDto {
//   return {
//     id: row.id,
//     title: row.title,
//     author: row.author,
//     totalPages: row.total_pages,
//     createdAt: row.created_at,
//     updatedAt: row.updated_at,
//   };
// }

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

    const selectBooksSqlRaw = `SELECT b.id,
                                          b.title,
                                          b.author,
                                          b.total_pages,
                                          b.created_at,
                                          b.updated_at,
                                          COALESCE(SUM(rs.pages_read), 0) AS pages_read
                                   FROM books b
                                            LEFT JOIN reading_sessions rs
                                                      ON rs.book_id = b.id
                                   WHERE ($1::text IS NULL OR b.title ILIKE '%' || $1 || '%')
                                   GROUP BY b.id,
                                            b.title,
                                            b.author,
                                            b.total_pages,
                                            b.created_at,
                                            b.updated_at
                                   ORDER BY b.created_at DESC
                                   LIMIT $2 OFFSET $3;`;
    const countBooksSqlRaw = `SELECT COUNT(*) AS total
                                  FROM books
                                  WHERE ($1::text IS NULL OR title ILIKE '%' || $1 || '%');`;

    const [selectSql, countSql] = await Promise.all([
      selectBooksSqlRaw,
      countBooksSqlRaw,
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

    return {
      items: rows.map(mapBookListItem),
      total: Number(countRows[0]?.total),
    };
  },

  async create(input: CreateBookInput): Promise<any> {
    const sql = `INSERT INTO books (title,
                                        author,
                                        total_pages)
                     VALUES ($1,
                             $2,
                             $3)
                     RETURNING
                         id,
                         title,
                         author,
                         total_pages,
                         created_at,
                         updated_at;`;

    const row = await query<BookRow>(sql, [
      input.title,
      input.author ?? null,
      input.totalPages,
    ]);

    if (!row) {
      throw new Error("Book not found");
    }

    return row[0];
  },

  async findById(id: string): Promise<BookDto | null> {
    const sql = `SELECT id,
                            title,
                            author,
                            total_pages,
                            created_at,
                            updated_at
                     FROM books
                     WHERE id = $1;`;
    const rows = await query<any>(sql, [id]);

    return rows[0] ?? null;
  },
};
