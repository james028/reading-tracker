import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildApp } from "../../src/app";
import { assertTestDatabase } from "../helpers/env";
import { closePool, resetDatabase } from "../helpers/db";

assertTestDatabase();

let app: Awaited<ReturnType<typeof buildApp>>;

beforeAll(async () => {
  app = await buildApp();
});

afterAll(async () => {
  await app.close();
  await closePool();
});

describe("Auth guard", () => {
  it("POST /api/books requires auth (401 without cookie)", async () => {
    await resetDatabase();

    const res = await app.inject({
      method: "POST",
      url: "/api/books",
      payload: { title: "Test", totalPages: 100 },
    });

    expect(res.statusCode).toBe(401);
  });

  it("POST /api/books/:id/reading-sessions requires auth (401 without cookie)", async () => {
    await resetDatabase();

    const res = await app.inject({
      method: "POST",
      url: "/api/books/1/reading-sessions",
      payload: {
        readingDate: "2026-11-25",
        pagesRead: 30,
      },
    });

    expect(res.statusCode).toBe(401);
  });
});
