import type { FastifyPluginAsync } from "fastify";
import { readingPlanService } from "./reading-plan.service";

export const readingPlanRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    "/reading-plan",
    {
      schema: {
        summary: "Get yearly reading plan",
        description:
          "Calculates how many pages need to be read per day to finish all books by the end of the year.",
        tags: ["Reading plan"],
      },
    },
    // @ts-ignore
    async (_request, reply) => {
      const plan = await readingPlanService.getReadingPlan();

      return reply.code(200).send(plan);
    },
  );
};
