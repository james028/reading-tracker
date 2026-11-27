import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { registerCookiePlugin } from "./plugins/cookie";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import FastifySwagger from "@fastify/swagger";
import { errorHandler } from "./plugins/error-handler";
// @ts-ignore
import ScalarApiReference from "@scalar/fastify-api-reference";
import { booksRoutes } from "./modules/books/books.routes";
import { readingSessionsRoutes } from "./modules/reading-sessions/reading-sessions.routes";
import { readingPlanRoutes } from "./modules/reading-plan/reading-plan.routes";
import { adminRoutes } from "./modules/admin/admin.routes";

export async function buildApp() {
  const app = Fastify({
    logger: true,
    trustProxy: true,
  });

  await app.register(cors, {
    origin: [
      "http://127.0.0.1:5173",
      "https://reading-tracker-jk-9.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });

  await registerCookiePlugin(app);

  await app.register(helmet);

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(FastifySwagger, {
    openapi: {
      openapi: "3.1.0",
      info: {
        title: "Reading Tracker API",
        description: "API for tracking books and daily reading progress",
        version: "1.0.0",
      },
      tags: [
        {
          name: "Books",
          description: "Book catalog endpoints",
        },
        {
          name: "Reading sessions",
          description: "Daily reading progress endpoints",
        },
      ],
    },
  });

  await app.register(errorHandler);

  await app.register(ScalarApiReference, {
    routePrefix: "/docs",
  });

  await app.register(booksRoutes, {
    prefix: "/api",
  });

  await app.register(readingSessionsRoutes, {
    prefix: "/api",
  });

  await app.register(readingPlanRoutes, {
    prefix: "/api",
  });

  await app.register(adminRoutes, {
    prefix: "/api",
  });

  await app.ready();
  return app;
}
