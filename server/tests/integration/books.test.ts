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

// Helper do logowania i pobrania cookie
async function loginAndGetCookie() {
  const loginRes = await app.inject({
    method: "POST",
    url: "/api/admin/login",
    payload: { password: process.env.ADMIN_PASSWORD },
  });

  expect(loginRes.statusCode).toBe(200);

  return loginRes.cookies;
}

describe("POST /api/books", () => {
  it("rejects missing title with 400", async () => {
    await resetDatabase();
    const cookies = await loginAndGetCookie();

    const res = await app.inject({
      method: "POST",
      url: "/api/books",
      cookies,
      payload: {
        author: "Some Author",
        totalPages: 100,
      },
    });

    expect(res.statusCode).toBe(400);
  });

  it("rejects totalPages = 0 with 400", async () => {
    await resetDatabase();
    const cookies = await loginAndGetCookie();

    const res = await app.inject({
      method: "POST",
      url: "/api/books",
      cookies,
      payload: {
        title: "Test Book",
        totalPages: 0,
      },
    });

    expect(res.statusCode).toBe(400);
  });

  it("rejects duplicate title with 409", async () => {
    await resetDatabase();
    const cookies = await loginAndGetCookie();

    // Pierwsze dodanie - powinno przejść
    const first = await app.inject({
      method: "POST",
      url: "/api/books",
      cookies,
      payload: {
        title: "Duplicate Book",
        totalPages: 100,
      },
    });

    expect(first.statusCode).toBe(201);

    // Drugie dodanie tej samej książki - powinno zwrócić 409
    const second = await app.inject({
      method: "POST",
      url: "/api/books",
      cookies,
      payload: {
        title: "Duplicate Book",
        totalPages: 200,
      },
    });

    expect(second.statusCode).toBe(409);
  });

  it("rejects request without auth cookie with 401", async () => {
    await resetDatabase();

    const res = await app.inject({
      method: "POST",
      url: "/api/books",
      payload: {
        title: "No Auth Book",
        totalPages: 100,
      },
    });

    expect(res.statusCode).toBe(401);
  });
});

describe("GET /api/books", () => {
  it("returns empty list when no books", async () => {
    await resetDatabase();
    const cookies = await loginAndGetCookie();

    const res = await app.inject({
      method: "GET",
      url: "/api/books",
      cookies,
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({
      items: [],
    });
  });

  it("returns created books", async () => {
    await resetDatabase();
    const cookies = await loginAndGetCookie();

    await app.inject({
      method: "POST",
      url: "/api/books",
      cookies,
      payload: { title: "Book A", totalPages: 100 },
    });

    await app.inject({
      method: "POST",
      url: "/api/books",
      cookies,
      payload: { title: "Book B", totalPages: 200 },
    });

    const res = await app.inject({
      method: "GET",
      url: "/api/books",
      cookies,
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().items).toHaveLength(2);
  });

  it("respects pagination (page, limit)", async () => {
    await resetDatabase();
    const cookies = await loginAndGetCookie();

    for (let i = 1; i <= 5; i++) {
      await app.inject({
        method: "POST",
        url: "/api/books",
        cookies,
        payload: { title: `Book ${i}`, totalPages: 100 },
      });
    }

    const res = await app.inject({
      method: "GET",
      url: "/api/books?page=2&limit=2",
      cookies,
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().items).toHaveLength(2);
  });

  it("filters by search query", async () => {
    await resetDatabase();
    const cookies = await loginAndGetCookie();

    await app.inject({
      method: "POST",
      url: "/api/books",
      cookies,
      payload: { title: "Clean Code", totalPages: 100 },
    });

    await app.inject({
      method: "POST",
      url: "/api/books",
      cookies,
      payload: { title: "Clean Architecture", totalPages: 100 },
    });

    await app.inject({
      method: "POST",
      url: "/api/books",
      cookies,
      payload: { title: "Refactoring", totalPages: 100 },
    });

    const res = await app.inject({
      method: "GET",
      url: "/api/books?search=Clean",
      cookies,
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().items).toHaveLength(2);
  });
});
