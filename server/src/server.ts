import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import cors from "@fastify/cors";
import FastifySwagger from "@fastify/swagger";
// @ts-ignore
import ScalarApiReference from "@scalar/fastify-api-reference";
import { booksRoutes } from "./modules/books/books.routes";
import { readingSessionsRoutes } from "./modules/reading-sessions/reading-sessions.routes";
import { errorHandler } from "./plugins/error-handler";
import { readingPlanRoutes } from "./modules/reading-plan/reading-plan.routes";

const app = Fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(FastifySwagger, {
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

app.register(cors, {
  origin: ["http://localhost:5173", "https://reading-tracker-jk-9.vercel.app"],
});

app.register(errorHandler);

app.register(ScalarApiReference, {
  routePrefix: "/docs",
});

app.register(booksRoutes, {
  prefix: "/api",
});

app.register(readingSessionsRoutes, {
  prefix: "/api",
});

app.register(readingPlanRoutes, {
  prefix: "/api",
});

const port = Number(process.env.PORT) || 3000;

app.listen({
  port,
  host: "0.0.0.0",
});
