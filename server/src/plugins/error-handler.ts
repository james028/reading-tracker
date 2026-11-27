import type { FastifyInstance, FastifyError } from "fastify";
import { ZodError } from "zod";
import {
  BookNotFoundError,
  PagesLimitExceededError,
} from "../modules/reading-sessions/reading-sessions.service";
import { ConflictError } from "../modules/books/books.service";

export async function errorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    // 1. Błędy walidacji Zod (jeśli trafią jako ZodError)
    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: "Validation failed",
        errors: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    // 2. Błędy walidacji Fastify (schema validation)
    const fastifyError = error as FastifyError;
    if (fastifyError.validation) {
      return reply.status(400).send({
        message: "Validation failed",
        errors: fastifyError.validation.map((v) => ({
          field: v.instancePath?.replace(/^\//, "").replace(/\//g, ".") ?? "",
          message: v.message ?? "Invalid value",
        })),
      });
    }

    // 3. Twoje domenowe błędy
    if (error instanceof ConflictError) {
      return reply.status(409).send({
        statusCode: 409,
        error: "Conflict",
        message: error.message,
      });
    }

    if (error instanceof BookNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      });
    }

    if (error instanceof PagesLimitExceededError) {
      return reply.status(422).send({
        message: error.message,
      });
    }

    // 4. Błędy z jawnym statusCode (np. 401 z guard, 429 z rate-limit)
    if (
      typeof fastifyError.statusCode === "number" &&
      fastifyError.statusCode >= 400 &&
      fastifyError.statusCode < 500
    ) {
      return reply.status(fastifyError.statusCode).send({
        statusCode: fastifyError.statusCode,
        error: fastifyError.name ?? "Error",
        message: fastifyError.message,
      });
    }

    // 5. Wszystko inne — logujemy pełny błąd, klient dostaje generyk
    app.log.error(error);

    return reply.status(500).send({
      message: "Internal server error",
    });
  });
}
