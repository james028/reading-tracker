import cookie from "@fastify/cookie";
import type { FastifyInstance } from "fastify";

export async function registerCookiePlugin(app: FastifyInstance) {
  // @ts-ignore
  await app.register(cookie, {
    secret: process.env.COOKIE_SECRET,
  });
}
