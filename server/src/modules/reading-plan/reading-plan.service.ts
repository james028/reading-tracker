import { readingPlanRepository } from "./reading-plan.repository";
import { ReadingPlanDto } from "./reding-plan.types";

function getTodayDateString(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getYearEndDate(year: number): Date {
  return new Date(year, 11, 31, 23, 59, 59, 999);
}

function getDaysLeft(today: Date, yearEndDate: Date): number {
  const differenceInMs = yearEndDate.getTime() - today.getTime();

  const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);

  return Math.max(Math.ceil(differenceInDays), 0);
}

export function calculateReadingPlan(input: {
  totalPages: number;
  pagesRead: number;
  pagesReadToday: number;
  now: Date;
}): ReadingPlanDto {
  const today = input.now;
  const year = today.getFullYear();
  const yearEndDate = getYearEndDate(year);

  const daysLeft = getDaysLeft(today, yearEndDate);
  const pagesLeft = Math.max(input.totalPages - input.pagesRead, 0);

  const requiredPagesPerDay = daysLeft === 0 ? 0 : pagesLeft / daysLeft;

  return {
    today: getTodayDateString(),
    yearEndDate: `${year}-12-31`,
    daysLeft,
    totalPages: input.totalPages,
    pagesRead: input.pagesRead,
    pagesLeft,
    pagesReadToday: input.pagesReadToday,
    requiredPagesPerDay: Number(requiredPagesPerDay.toFixed(2)),
    recommendedPagesPerDay: Math.ceil(requiredPagesPerDay),
    isAchievable: pagesLeft === 0 || daysLeft > 0,
  };
}

export const readingPlanService = {
  async getReadingPlan(): Promise<ReadingPlanDto> {
    const [resultsTotal, pagesToday] = await Promise.all([
      readingPlanRepository.getTotals(),
      readingPlanRepository.readingToday(),
    ]);

    const totalPages = resultsTotal.totalPages;
    const pagesRead = resultsTotal.pagesRead;
    const pagesReadToday = pagesToday.pagesReadToday;

    return calculateReadingPlan({
      totalPages,
      pagesRead,
      pagesReadToday,
      now: new Date(),
    });
  },
};
