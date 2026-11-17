import { FastifyInstance, FastifyPluginAsync } from "fastify";
import {
  bookIdParamsSchema,
  createReadingSessionSchema,
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
        body: createReadingSessionSchema,
        summary: "Create a reading session",
        description:
          "Creates a new reading session. Multiple sessions can be created for the same book and date.",
        tags: ["Reading sessions"],
      },
    },
    async (request, reply) => {
      console.log(request.body.pagesRead, "!!!!!!!!!!!!1");
      const session = await readingSessionsService.create({
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
