import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function resetDatabase() {
  await pool.query(
    `TRUNCATE TABLE reading_sessions, books RESTART IDENTITY CASCADE`,
  );
}

export async function closePool() {
  await pool.end();
}

export { pool };
