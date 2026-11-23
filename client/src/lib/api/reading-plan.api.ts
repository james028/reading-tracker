import { apiRequest } from "./http.ts";
import type { ReadingPlan } from "../types/reading-plan";

export function getReadingPlan(): Promise<ReadingPlan> {
  return apiRequest<ReadingPlan>("/reading-plan");
}
