import { readFile } from "node:fs/promises";
import path from "node:path";
import { query } from "../../db/database";
import { ReadingPlanRow } from "./reding-plan.types";

const sqlDirectory = path.join(__dirname, "sql");

async function loadSql(fileName: string): Promise<string> {
  return readFile(path.join(sqlDirectory, fileName), "utf8");
}

export const readingPlanRepository = {
  async getTotals(): Promise<{
    totalPages: number;
    pagesRead: number;
  }> {
    const sql = await loadSql("select-reading-plan.sql");

    const rows = await query<ReadingPlanRow>(sql, []);

    const row = rows[0];

    return {
      totalPages: Number(row?.total_pages),
      pagesRead: Number(row?.pages_read),
    };
  },
};
