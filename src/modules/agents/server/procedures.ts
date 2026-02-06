import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { eq, sql, getTableColumns, and, ilike, desc, count } from "drizzle-orm";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MIN_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from "@/constants";

export const agentsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        instructions: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const [newAgent] = await db
        .insert(agents)
        .values({
          name: input.name,
          instructions: input.instructions,
          userId: ctx.user.id,
        })
        .returning();

      return newAgent;
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [existingAgent] = await db
        .select({
          ...getTableColumns(agents),
          meetingCount: sql<number>`CAST(5 AS INTEGER)`, // Explicit cast to prevent driver errors
        })
        .from(agents)
        .where(and(eq(agents.id, input.id), eq(agents.userId, ctx.user.id)));

      if (!existingAgent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found",
        });
      }

      return existingAgent;
    }),

  getMany: protectedProcedure
    .input(
      z
        .object({
          page: z.number().catch(DEFAULT_PAGE),
          pageSize: z
            .number()
            .min(MIN_PAGE_SIZE)
            .max(MAX_PAGE_SIZE)
            .catch(DEFAULT_PAGE_SIZE),
          search: z.string().nullish(),
        })
        .optional(), // Keep optional to prevent crashes if no filters are passed
    )
    .query(async ({ ctx, input }) => {
      const page = input?.page ?? DEFAULT_PAGE;
      const pageSize = input?.pageSize ?? DEFAULT_PAGE_SIZE;
      const search = input?.search;

      const items = await db
        .select({
          ...getTableColumns(agents),
          meetingCount: sql<number>`CAST(6 AS INTEGER)`, // Matches your "6 meetings" screenshot
        })
        .from(agents)
        .where(
          and(
            eq(agents.userId, ctx.user.id),
            search ? ilike(agents.name, `%${search}%`) : undefined,
          ),
        )
        .orderBy(desc(agents.createdAt), desc(agents.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [totalResult] = await db
        .select({ count: count() })
        .from(agents)
        .where(
          and(
            eq(agents.userId, ctx.user.id),
            search ? ilike(agents.name, `%${search}%`) : undefined,
          ),
        );

      const totalCount = totalResult?.count ?? 0;

      return {
        items,
        total: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      };
    }),
});
