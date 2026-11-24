import { FastifyInstance, FastifyPluginAsync } from "fastify";
import {
  bookIdParamsSchema,
  createReadingSessionSchema,
} from "./reading-sessions.schema";
import { readingSessionsService } from "./reading-sessions.service";
import { requireAdmin } from "../../auth/admin-guard";

export const readingSessionsRoutes: FastifyPluginAsync = async (
  app: FastifyInstance,
) => {
  app.post(
    "/books/:bookId/reading-sessions",
    {
      preHandler: requireAdmin,
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
      const { bookId } = bookIdParamsSchema.parse(request.params);

      const input = createReadingSessionSchema.parse(request.body);

      const session = await readingSessionsService.create({
        bookId,
        pagesRead: input.pagesRead,
        readingDate: input.readingDate,
      });

      return reply.code(201).send(session);
    },
  );
};
