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

describe("POST /api/admin/login", () => {
  it("returns 200 and sets admin_session cookie for correct password", async () => {
    await resetDatabase();

    const res = await app.inject({
      method: "POST",
      url: "/api/admin/login",
      payload: { password: process.env.ADMIN_PASSWORD },
    });

    expect(res.statusCode).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
    expect(res.headers["set-cookie"]).toContain("admin_session=");
  });

  it("returns 401 and does not set cookie for wrong password", async () => {
    await resetDatabase();

    const res = await app.inject({
      method: "POST",
      url: "/api/admin/login",
      payload: { password: "wrong-password" },
    });

    expect(res.statusCode).toBe(401);
    expect(res.headers["set-cookie"]).toBeUndefined();
  });
});

describe("POST /api/admin/logout", () => {
  it("clears admin_session cookie", async () => {
    await resetDatabase();

    const loginRes = await app.inject({
      method: "POST",
      url: "/api/admin/login",
      payload: { password: process.env.ADMIN_PASSWORD },
    });

    const logoutRes = await app.inject({
      method: "POST",
      url: "/api/admin/logout",
      cookies: loginRes.cookies,
    });

    expect(logoutRes.statusCode).toBe(204);
  });
});
