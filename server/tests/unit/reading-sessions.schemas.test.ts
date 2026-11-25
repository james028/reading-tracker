import { describe, expect, it } from "vitest";
import {
  bookIdParamsSchema,
  createReadingSessionSchema,
} from "../../src/modules/reading-sessions/reading-sessions.schema";

describe("bookIdParamsSchema", () => {
  it("accepts a valid UUID", () => {
    const result = bookIdParamsSchema.safeParse({
      bookId: "550e8400-e29b-41d4-a716-446655440000",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid UUID formats", () => {
    expect(bookIdParamsSchema.safeParse({ bookId: "not-a-uuid" }).success).toBe(
      false,
    );
    expect(bookIdParamsSchema.safeParse({ bookId: "123" }).success).toBe(false);
    expect(bookIdParamsSchema.safeParse({ bookId: "" }).success).toBe(false);
  });
});

describe("createReadingSessionSchema", () => {
  it("accepts a valid session", () => {
    const result = createReadingSessionSchema.safeParse({
      readingDate: "2026-11-25",
      pagesRead: 30,
      note: "Good chapter",
    });

    expect(result.success).toBe(true);
  });

  it("accepts a session without optional note", () => {
    const result = createReadingSessionSchema.safeParse({
      readingDate: "2026-11-25",
      pagesRead: 30,
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid readingDate formats", () => {
    expect(
      createReadingSessionSchema.safeParse({
        readingDate: "25-11-2026",
        pagesRead: 30,
      }).success,
    ).toBe(false);
    expect(
      createReadingSessionSchema.safeParse({
        readingDate: "2026/11/25",
        pagesRead: 30,
      }).success,
    ).toBe(false);
    expect(
      createReadingSessionSchema.safeParse({ readingDate: "", pagesRead: 30 })
        .success,
    ).toBe(false);
  });

  it("rejects non-existent dates", () => {
    expect(
      createReadingSessionSchema.safeParse({
        readingDate: "2026-02-30",
        pagesRead: 30,
      }).success,
    ).toBe(false);
  });

  it("rejects invalid pagesRead values", () => {
    expect(
      createReadingSessionSchema.safeParse({
        readingDate: "2026-11-25",
        pagesRead: 0,
      }).success,
    ).toBe(false);
    expect(
      createReadingSessionSchema.safeParse({
        readingDate: "2026-11-25",
        pagesRead: -5,
      }).success,
    ).toBe(false);
    expect(
      createReadingSessionSchema.safeParse({
        readingDate: "2026-11-25",
        pagesRead: 10.5,
      }).success,
    ).toBe(false);
  });

  it("rejects note longer than 1000 characters", () => {
    const result = createReadingSessionSchema.safeParse({
      readingDate: "2026-11-25",
      pagesRead: 30,
      note: "a".repeat(1001),
    });

    expect(result.success).toBe(false);
  });
});
