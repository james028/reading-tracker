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

async function loginAndGetCookie() {
  const loginRes = await app.inject({
    method: "POST",
    url: "/api/admin/login",
    payload: { password: process.env.ADMIN_PASSWORD },
  });

  expect(loginRes.statusCode).toBe(200);

  return loginRes.cookies;
}

async function createBook(cookies: any, title: string, totalPages: number) {
  const res = await app.inject({
    method: "POST",
    url: "/api/books",
    cookies,
    payload: { title, totalPages },
  });

  expect(res.statusCode).toBe(201);

  return res.json();
}

async function createReadingSession(
  cookies: any,
  bookId: number,
  pagesRead: number,
) {
  const res = await app.inject({
    method: "POST",
    url: `/api/books/${bookId}/reading-sessions`,
    cookies,
    payload: {
      readingDate: "2026-11-25",
      pagesRead,
    },
  });

  expect(res.statusCode).toBe(201);
}

describe("GET /api/reading-plan", () => {
  it("returns plan with zero pages when no books", async () => {
    await resetDatabase();
    const cookies = await loginAndGetCookie();

    const res = await app.inject({
      method: "GET",
      url: "/api/reading-plan",
      cookies,
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({
      totalPages: 0,
      pagesRead: 0,
      pagesLeft: 0,
      pagesReadToday: 0,
      isAchievable: true,
    });
  });

  it("calculates plan after adding book and reading session", async () => {
    await resetDatabase();
    const cookies = await loginAndGetCookie();

    const book = await createBook(cookies, "Test Book", 300);
    await createReadingSession(cookies, book.id, 100);

    const res = await app.inject({
      method: "GET",
      url: "/api/reading-plan",
      cookies,
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({
      totalPages: 300,
      pagesRead: 100,
      pagesLeft: 200,
      pagesReadToday: 100,
    });
  });

  it("returns 0 required pages per day when all pages read", async () => {
    await resetDatabase();
    const cookies = await loginAndGetCookie();

    const book = await createBook(cookies, "Test Book", 100);
    await createReadingSession(cookies, book.id, 100);

    const res = await app.inject({
      method: "GET",
      url: "/api/reading-plan",
      cookies,
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({
      pagesLeft: 0,
      requiredPagesPerDay: 0,
      isAchievable: true,
    });
  });
});
