import type { FastifyInstance, FastifyPluginAsyncZod } from "fastify";
import { createBookSchema, getBooksQuerySchema } from "./books.schemas";
import { booksService } from "./books.service";

export const booksRoutes: FastifyPluginAsyncZod = async (
  app: FastifyInstance,
) => {
  app.get(
    "/books",
    {
      schema: {
        querystring: getBooksQuerySchema,
      },
    },
    async function (request, reply) {
      const result = await booksService.getBooks(request.query);

      return reply.code(200).send(result);
    },
  );

  app.post(
    "/books",
    {
      schema: {
        body: createBookSchema,
      },
    },
    async function (request, reply) {
      const book = await booksService.createBook(request.body);

      return reply.code(201).send(book);
    },
  );
};
