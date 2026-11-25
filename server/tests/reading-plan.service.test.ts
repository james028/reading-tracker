import { describe, expect, it } from "vitest";
import { calculateReadingPlan } from "../src/modules/reading-plan/reading-plan.service";

describe("calculateReadingPlan", () => {
  it("returns zero pages left when all pages are read", () => {
    const result = calculateReadingPlan({
      totalPages: 300,
      pagesRead: 300,
      pagesReadToday: 50,
      now: new Date("2026-11-25T12:00:00Z"),
    });

    expect(result.pagesLeft).toBe(0);
    expect(result.requiredPagesPerDay).toBe(0);
    expect(result.isAchievable).toBe(true);
  });

  it("calculates required pages per day", () => {
    const result = calculateReadingPlan({
      totalPages: 300,
      pagesRead: 100,
      pagesReadToday: 0,
      now: new Date("2026-11-25T12:00:00Z"),
    });

    expect(result.pagesLeft).toBe(200);
    expect(result.daysLeft).toBeGreaterThan(0);
    expect(result.requiredPagesPerDay).toBeGreaterThan(0);
  });

  it("returns 0 required pages per day on the last day of the year", () => {
    const result = calculateReadingPlan({
      totalPages: 300,
      pagesRead: 100,
      pagesReadToday: 0,
      now: new Date("2026-12-31T23:59:59.999"),
    });

    expect(result.daysLeft).toBe(0);
    expect(result.requiredPagesPerDay).toBe(0);
    expect(result.isAchievable).toBe(false);
  });

  it("handles empty library (no books)", () => {
    const result = calculateReadingPlan({
      totalPages: 0,
      pagesRead: 0,
      pagesReadToday: 0,
      now: new Date("2026-11-25T12:00:00Z"),
    });

    expect(result.pagesLeft).toBe(0);
    expect(result.requiredPagesPerDay).toBe(0);
    expect(result.isAchievable).toBe(true);
  });
});
