import { beforeAll, afterAll, describe, it, expect } from "vitest";
import { buildApp } from "../../src/app";
import { assertTestDatabase } from "../helpers/env";
import { resetDatabase, closePool } from "../helpers/db";

assertTestDatabase();

let app: Awaited<ReturnType<typeof buildApp>>;

beforeAll(async () => {
  app = await buildApp();
});

afterAll(async () => {
  await app.close();
  await closePool();
});

async function loginAndGetCookie() {
  const loginRes = await app.inject({
    method: "POST",
    url: "/api/admin/login",
    payload: { password: process.env.ADMIN_PASSWORD },
  });

  expect(loginRes.statusCode).toBe(200);

  return loginRes.cookies;
}

async function createBook(cookies: any, title: string) {
  const res = await app.inject({
    method: "POST",
    url: "/api/books",
    cookies,
    payload: { title, totalPages: 100 },
  });

  expect(res.statusCode).toBe(201);

  return res.json();
}

describe("POST /api/books/:bookId/reading-sessions", () => {
  it("creates a reading session with valid data", async () => {
    await resetDatabase();
    const cookies = await loginAndGetCookie();
    const book = await createBook(cookies, "Test Book");

    const res = await app.inject({
      method: "POST",
      url: `/api/books/${book.id}/reading-sessions`,
      cookies,
      payload: {
        readingDate: "2026-11-25",
        pagesRead: 30,
        note: "Good chapter",
      },
    });

    expect(res.statusCode).toBe(201);
  });

  it("rejects invalid readingDate with 400", async () => {
    await resetDatabase();
    const cookies = await loginAndGetCookie();
    const book = await createBook(cookies, "Test Book");

    const res = await app.inject({
      method: "POST",
      url: `/api/books/${book.id}/reading-sessions`,
      cookies,
      payload: {
        readingDate: "25-11-2026",
        pagesRead: 30,
      },
    });

    expect(res.statusCode).toBe(400);
  });

  it("rejects pagesRead = 0 with 400", async () => {
    await resetDatabase();
    const cookies = await loginAndGetCookie();
    const book = await createBook(cookies, "Test Book");

    const res = await app.inject({
      method: "POST",
      url: `/api/books/${book.id}/reading-sessions`,
      cookies,
      payload: {
        readingDate: "2026-11-25",
        pagesRead: 0,
      },
    });

    expect(res.statusCode).toBe(400);
  });

  it("rejects request without auth cookie with 401", async () => {
    await resetDatabase();
    const cookies = await loginAndGetCookie();
    const book = await createBook(cookies, "Test Book");

    const res = await app.inject({
      method: "POST",
      url: `/api/books/${book.id}/reading-sessions`,
      payload: {
        readingDate: "2026-11-25",
        pagesRead: 30,
      },
    });

    expect(res.statusCode).toBe(401);
  });
});
