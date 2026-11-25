import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { createBookSchema, getBooksQuerySchema } from "./books.schemas";
import { booksService } from "./books.service";
import { requireAdmin } from "../../auth/admin-guard";

export const booksRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get(
    "/books",
    {
      schema: {
        querystring: getBooksQuerySchema,
      },
    },
    async function (request, reply) {
      const query = getBooksQuerySchema.parse(request.query);
      const result = await booksService.getBooks(query);

      return reply.code(200).send(result);
    },
  );

  app.post(
    "/books",
    {
      preHandler: requireAdmin,
      schema: {
        body: createBookSchema,
      },
    },
    async function (request, reply) {
      const body = createBookSchema.parse(request.body);
      const book = await booksService.createBook(body);

      return reply.code(201).send(book);
    },
  );
};
