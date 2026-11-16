import { FastifyInstance, FastifyPluginAsync } from "fastify";
import {
  bookIdParamsSchema,
  upsertReadingSessionSchema,
} from "./reading-sessions.schema";
import { readingSessionsService } from "./reading-sessions.service";

export const readingSessionsRoutes: FastifyPluginAsync = async (
  app: FastifyInstance,
) => {
  app.post(
    "/books/:bookId/reading-sessions",
    {
      schema: {
        params: bookIdParamsSchema,
        body: upsertReadingSessionSchema,
      },
    },
    async (request, reply) => {
      // @ts-ignore
      const session = await readingSessionsService.upsert({
        // @ts-ignore
        bookId: request.params.bookId,
        // @ts-ignore
        readingDate: request.body.readingDate,
        // @ts-ignore
        pagesRead: request.body.pagesRead,
        // @ts-ignore
        note: request.body.note,
      });

      return reply.code(201).send(session);
    },
  );
};
