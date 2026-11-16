import { z } from "zod";

export const getBooksQuerySchema = z.object({
  search: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const createBookSchema = z.object({
  title: z.string().trim().min(1).max(255),
  author: z.string().trim().max(255).optional(),
  totalPages: z.number().int().min(1),
});

export type GetBooksQuerySchema = z.infer<typeof getBooksQuerySchema>;
export type CreateBookSchema = z.infer<typeof createBookSchema>;
