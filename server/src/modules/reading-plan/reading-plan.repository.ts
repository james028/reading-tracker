import { query } from "../../db/database";
import { ReadingPlanRow } from "./reding-plan.types";

export class ReadPagesTodayError extends Error {
  constructor() {
    super("Data of pages reading not found.");
  }
}

export const readingPlanRepository = {
  async getTotals(): Promise<{
    totalPages: number;
    pagesRead: number;
  }> {
    const sql = `SELECT COALESCE(SUM(b.total_pages), 0)                    AS total_pages,
                            COALESCE(SUM(COALESCE(progress.pages_read, 0)), 0) AS pages_read
                     FROM books b
                              LEFT JOIN (SELECT book_id,
                                                SUM(pages_read) AS pages_read
                                         FROM reading_sessions
                                         GROUP BY book_id) progress
                                        ON progress.book_id = b.id;`;

    const rows = await query<ReadingPlanRow>(sql, []);

    const row = rows[0];

    return {
      totalPages: Number(row?.total_pages),
      pagesRead: Number(row?.pages_read),
    };
  },
  async readingToday(): Promise<{
    pagesReadToday: number;
  }> {
    const sql = `SELECT COALESCE(SUM(pages_read), 0) AS pages_read_today
                     FROM reading_sessions
                     WHERE reading_date = CURRENT_DATE;`;

    const pages = await query<{ pages_read_today: number }>(sql, []);

    const pagesReadToday = pages[0];
    if (!pagesReadToday) {
      throw new Error("Data of read pages not found.");
    }

    return {
      pagesReadToday: Number(pagesReadToday.pages_read_today),
    };
  },
};
