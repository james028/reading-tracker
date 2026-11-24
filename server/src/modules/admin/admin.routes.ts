import type { FastifyInstance } from "fastify";
import {
  createAdminSessionToken,
  isAdminPasswordValid,
} from "../../auth/admin-session";
import { z } from "zod";

const isProduction = process.env.NODE_ENV === "production";

const loginSchema = z.object({
  password: z.string().trim().min(1).max(255),
});

export async function adminRoutes(app: FastifyInstance) {
  app.post(
    "/admin/login",
    {
      schema: {
        body: loginSchema,
      },
    },
    async (request, reply) => {
      const { password } = request.body as { password: string };

      if (!isAdminPasswordValid(password)) {
        return reply.code(401).send({
          error: "Invalid credentials",
        });
      }

      const sessionToken = createAdminSessionToken();

      reply.setCookie("admin_session", sessionToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return reply.code(200).send({ sessionToken });
    },
  );

  app.post("/admin/logout", async (_request, reply) => {
    reply.clearCookie("admin_session", {
      path: "/",
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
    });

    return reply.code(204).send();
  });
}
