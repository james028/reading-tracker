import { beforeAll, afterAll, describe, expect, it } from "vitest";
import { buildApp } from "../src/app";
import { assertTestDatabase } from "./helpers/env";
import { resetDatabase, closePool } from "./helpers/db";

assertTestDatabase();

let app: Awaited<ReturnType<typeof buildApp>>;

beforeAll(async () => {
  app = await buildApp();
});

afterAll(async () => {
  await app.close();
  await closePool();
});

describe("GET /api/books", () => {
  it("returns empty list", async () => {
    await resetDatabase();

    const res = await app.inject({
      method: "GET",
      url: "/api/books",
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual([]);
  });
});
