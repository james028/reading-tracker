import { Pool } from 'pg';
import 'dotenv/config';

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function query<T = unknown>(
    sql: string,
    values: unknown[] = [],
): Promise<T[]> {
    const result = await pool.query(sql, values);

    return result.rows as T[];
}