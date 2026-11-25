import { describe, expect, it } from "vitest";
import {
  createBookSchema,
  getBooksQuerySchema,
} from "../../src/modules/books/books.schemas";

describe("getBooksQuerySchema", () => {
  it("applies defaults when query is empty", () => {
    const result = getBooksQuerySchema.safeParse({});

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ page: 1, limit: 20 });
    }
  });

  it("coerces string numbers and trims search", () => {
    const result = getBooksQuerySchema.safeParse({
      page: "3",
      limit: "50",
      search: "  Dune  ",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ page: 3, limit: 50, search: "Dune" });
    }
  });

  it("rejects invalid page and limit values", () => {
    expect(getBooksQuerySchema.safeParse({ page: 0 }).success).toBe(false);
    expect(getBooksQuerySchema.safeParse({ page: -1 }).success).toBe(false);
    expect(getBooksQuerySchema.safeParse({ page: 1.5 }).success).toBe(false);
    expect(getBooksQuerySchema.safeParse({ limit: 0 }).success).toBe(false);
    expect(getBooksQuerySchema.safeParse({ limit: 101 }).success).toBe(false);
  });
});

describe("createBookSchema", () => {
  it("accepts a valid book and trims title and author", () => {
    const result = createBookSchema.safeParse({
      title: "  Cień wiatru  ",
      author: "  Carlos Ruiz Zafón  ",
      totalPages: 500,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        title: "Cień wiatru",
        author: "Carlos Ruiz Zafón",
        totalPages: 500,
      });
    }
  });

  it("accepts a valid book without optional author", () => {
    const result = createBookSchema.safeParse({
      title: "Dune",
      totalPages: 412,
    });

    expect(result.success).toBe(true);
  });

  it("rejects empty, whitespace-only, or too long title", () => {
    expect(
      createBookSchema.safeParse({ title: "", totalPages: 100 }).success,
    ).toBe(false);
    expect(
      createBookSchema.safeParse({ title: "   ", totalPages: 100 }).success,
    ).toBe(false);
    expect(
      createBookSchema.safeParse({ title: "a".repeat(256), totalPages: 100 })
        .success,
    ).toBe(false);
  });

  it("rejects invalid totalPages values", () => {
    expect(
      createBookSchema.safeParse({ title: "Dune", totalPages: 0 }).success,
    ).toBe(false);
    expect(
      createBookSchema.safeParse({ title: "Dune", totalPages: -10 }).success,
    ).toBe(false);
    expect(
      createBookSchema.safeParse({ title: "Dune", totalPages: 12.5 }).success,
    ).toBe(false);
    expect(
      createBookSchema.safeParse({ title: "Dune", totalPages: "100" }).success,
    ).toBe(false);
  });

  it("rejects author longer than 255 characters", () => {
    const result = createBookSchema.safeParse({
      title: "Dune",
      author: "a".repeat(256),
      totalPages: 412,
    });

    expect(result.success).toBe(false);
  });
});
