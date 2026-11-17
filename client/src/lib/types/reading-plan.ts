export interface ReadingPlan {
  today: string;
  yearEndDate: string;
  daysLeft: number;
  totalPages: number;
  pagesRead: number;
  pagesLeft: number;
  requiredPagesPerDay: number;
  recommendedPagesPerDay: number;
  isAchievable: boolean;
}
