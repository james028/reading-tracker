import type { FastifyInstance } from "fastify";
import {
  createAdminSessionToken,
  isAdminPasswordValid,
} from "../../auth/admin-session";

const loginSchema = {
  body: {
    type: "object",
    required: ["password"],
    properties: {
      password: {
        type: "string",
        minLength: 1,
      },
    },
  },
};

// const loginSchema2 = {
//   password: {
//     type: "string",
//     minLength: 1,
//   },
// };

export async function adminRoutes(app: FastifyInstance) {
  app.post(
    "/admin/login",
    {
      schema: loginSchema,
    },
    async (request, reply) => {
      const { password } = request.body as { password: string };

      console.log(password, "sdasfdgdsgds");

      if (!isAdminPasswordValid(password)) {
        return reply.code(401).send({
          error: "Invalid credentials",
        });
      }

      const sessionToken = createAdminSessionToken();

      const isProduction = process.env.NODE_ENV === "production";

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
    });

    return reply.code(204).send();
  });
}
