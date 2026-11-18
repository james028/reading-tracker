import { z } from "zod";

export const getBooksQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
});

export const createBookSchema = z.object({
  title: z.string().trim().min(1).max(255).meta({
    example: "Cień wiatru",
  }),
  author: z.string().trim().max(255).optional(),
  totalPages: z.number().int().min(1),
});

export type GetBooksQuerySchema = z.infer<typeof getBooksQuerySchema>;
export type CreateBookSchema = z.infer<typeof createBookSchema>;
