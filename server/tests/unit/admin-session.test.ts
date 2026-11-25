import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createAdminSessionToken,
  isAdminPasswordValid,
  isValidAdminSession,
} from "../../src/auth/admin-session";

describe("isAdminPasswordValid", () => {
  it("returns true for the configured admin password", () => {
    expect(isAdminPasswordValid(process.env.ADMIN_PASSWORD)).toBe(true);
  });

  it("returns false for wrong password, empty string, or non-string values", () => {
    expect(isAdminPasswordValid("wrong-password")).toBe(false);
    expect(isAdminPasswordValid("")).toBe(false);
    expect(isAdminPasswordValid(undefined)).toBe(false);
    expect(isAdminPasswordValid(null)).toBe(false);
    expect(isAdminPasswordValid(12345)).toBe(false);
  });
});

describe("admin session token", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("accepts a freshly created token", () => {
    const token = createAdminSessionToken();

    expect(isValidAdminSession(token)).toBe(true);
  });

  it("rejects undefined and empty token", () => {
    expect(isValidAdminSession(undefined)).toBe(false);
    expect(isValidAdminSession("")).toBe(false);
  });

  it("rejects tokens with invalid structure", () => {
    expect(isValidAdminSession("no-dots-at-all")).toBe(false);
    expect(isValidAdminSession("admin.123456")).toBe(false);
    expect(isValidAdminSession("admin.123456.")).toBe(false);
    expect(isValidAdminSession("a.b.c.d")).toBe(false);
  });

  it("rejects token with tampered signature", () => {
    const token = createAdminSessionToken();
    const lastChar = token.at(-1) === "a" ? "b" : "a";
    const tampered = token.slice(0, -1) + lastChar;

    expect(isValidAdminSession(tampered)).toBe(false);
  });

  it("rejects token with tampered role or timestamp", () => {
    const token = createAdminSessionToken();
    const [, issuedAt, signature] = token.split(".");

    expect(isValidAdminSession(`user.${issuedAt}.${signature}`)).toBe(false);
    expect(
      isValidAdminSession(`admin.${Number(issuedAt) + 1}.${signature}`),
    ).toBe(false);
  });

  it("rejects an expired token after 7 days", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-25T12:00:00Z"));

    const token = createAdminSessionToken();

    vi.advanceTimersByTime(7 * 24 * 60 * 60 * 1000 + 1);

    expect(isValidAdminSession(token)).toBe(false);
  });
});
