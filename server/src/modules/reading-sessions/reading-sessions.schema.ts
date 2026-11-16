import { z } from "zod";

export const bookIdParamsSchema = z.object({
  bookId: z.string().uuid(),
});

export const upsertReadingSessionSchema = z.object({
  readingDate: z.string().date(),
  pagesRead: z.number().int().min(1),
  note: z.string().trim().max(1000).optional(),
});

export type UpsertReadingSessionSchema = z.infer<
  typeof upsertReadingSessionSchema
>;
