import { z } from "zod";

export const bookIdParamsSchema = z.object({
  bookId: z.string().uuid(),
});

export const createReadingSessionSchema = z.object({
  readingDate: z.string().date(),
  pagesRead: z.number().int().min(1),
  note: z.string().trim().max(1000).optional(),
});

export type CreateReadingSessionSchema = z.infer<
  typeof createReadingSessionSchema
>;
