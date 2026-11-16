import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import {
  BookNotFoundError,
  PagesLimitExceededError,
} from "../modules/reading-sessions/reading-sessions.service";

export async function errorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      return reply.code(400).send({
        message: "Validation failed",
        errors: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    if (error instanceof BookNotFoundError) {
      return reply.code(404).send({
        message: error.message,
      });
    }

    if (error instanceof PagesLimitExceededError) {
      return reply.code(422).send({
        message: error.message,
      });
    }

    app.log.error(error);

    return reply.code(500).send({
      message: "Internal server error",
    });
  });
}
