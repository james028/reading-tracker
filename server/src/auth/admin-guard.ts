import type { FastifyReply, FastifyRequest } from "fastify";
import { isValidAdminSession } from "./admin-session";

export async function requireAdmin(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const token = request.cookies.admin_session;

  console.log("AUTH DEBUG", {
    origin: request.headers.origin,
    host: request.headers.host,
    hasCookieHeader: Boolean(request.headers.cookie),
    hasAdminSession: Boolean(request.cookies?.admin_session),
  });

  if (!isValidAdminSession(token)) {
    return reply.code(401).send({
      error: "Unauthorized. You can not add pages. You are not administrator.",
    });
  }
}
