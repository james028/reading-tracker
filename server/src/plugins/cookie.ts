import cookie from "@fastify/cookie";
import type { FastifyInstance } from "fastify";

export async function registerCookiePlugin(app: FastifyInstance) {
  const cookieSecret = process.env.COOKIE_SECRET;

  if (!cookieSecret) {
    throw new Error("Missing required environment variable: COOKIE_SECRET");
  }

  await app.register(cookie, {
    secret: cookieSecret,
  });
}
