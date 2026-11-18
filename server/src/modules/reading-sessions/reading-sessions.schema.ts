import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const bookIdParamsSchema = z.object({
  bookId: z.string().uuid(),
});

export const createReadingSessionSchema = z.object({
  readingDate: z.string().date().openapi({
    description: "Reading date",
    example: "2026-11-23",
  }),

  pagesRead: z.number().int().min(1),
  note: z.string().trim().max(1000).optional(),
});

export type CreateReadingSessionSchema = z.infer<
  typeof createReadingSessionSchema
>;
