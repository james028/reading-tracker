import {readdir, readFile} from "node:fs/promises";
import path from "node:path";
import {pool} from "../db/database";

const migrationsDirectory = path.join(process.cwd(), "src", "migrations",);

async function createMigrationsTable() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS migrations
        (
            name        TEXT PRIMARY KEY,
            executed_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
    `);
}

async function getExecutedMigrations() {
    const result = await pool.query<{ name: string }>("SELECT name FROM migrations",);

    return result.rows.map((row) => row.name);
}

async function runMigrations() {
    await createMigrationsTable();

    const files = await readdir(migrationsDirectory);
    const sqlFiles = files
        .filter((file) => file.endsWith(".sql"))
        .sort();

    const executedMigrations = await getExecutedMigrations();

    for (const file of sqlFiles) {
        if (executedMigrations.includes(file)) {
            console.log(`Skipping: ${file}`);
            continue;
        }

        const sql = await readFile(path.join(migrationsDirectory, file), "utf8",);

        const client = await pool.connect();

        try {
            await client.query("BEGIN");
            await client.query(sql);
            await client.query("INSERT INTO migrations (name) VALUES ($1)", [file],);
            await client.query("COMMIT");

            console.log(`Executed: ${file}`);
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    await pool.end();
}

runMigrations();