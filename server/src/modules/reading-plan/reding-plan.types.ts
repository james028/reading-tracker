export interface ReadingPlanRow {
  total_pages: string;
  pages_read: string;
}

export interface ReadingPlanDto {
  today: string;
  yearEndDate: string;
  daysLeft: number;
  totalPages: number;
  pagesRead: number;
  pagesLeft: number;
  pagesReadToday: number;
  requiredPagesPerDay: number;
  recommendedPagesPerDay: number;
  isAchievable: boolean;
}
