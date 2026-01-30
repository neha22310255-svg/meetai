import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { getTableColumns } from "drizzle-orm"; // Added import

export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      // Changed 'db' to 'ctx'
      const [existingAgent] = await db // Use the imported db directly
        .select({
          // TODO: Change to actual count
          meetingCount: sql<number>`5`,
          ...getTableColumns(agents),
        })
        .from(agents)
        .where(eq(agents.id, input.id));

      return existingAgent;
    }),

  // Added missing getMany procedure
  getMany: protectedProcedure.query(async () => {
    const allAgents = await db
      .select({
        meetingCount: sql<number>`5`,
        ...getTableColumns(agents),
      })
      .from(agents);

    return allAgents;
  }),
});
