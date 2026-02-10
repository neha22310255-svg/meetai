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

import { agentsInsertSchema, agentsUpdateSchema } from "../schemas";

export const agentsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(agentsInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const [agent] = await db
        .insert(agents)
        .values({
          ...input,
          userId: ctx.user.id,
        })
        .returning();

      if (!agent) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create agent",
        });
      }

      return agent;
    }),

  update: protectedProcedure
    .input(agentsUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const [updatedAgent] = await db
        .update(agents)
        .set(input)
        .where(and(eq(agents.id, input.id), eq(agents.userId, ctx.user.id)))
        .returning();

      if (!updatedAgent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found",
        });
      }

      return updatedAgent;
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [removedAgent] = await db
        .delete(agents)
        .where(and(eq(agents.id, input.id), eq(agents.userId, ctx.user.id)))
        .returning();

      if (!removedAgent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found",
        });
      }

      return removedAgent;
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [existingAgent] = await db
        .select({
          ...getTableColumns(agents),
          meetingCount: sql<number>`CAST(5 AS INTEGER)`,
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
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const page = input?.page ?? DEFAULT_PAGE;
      const pageSize = input?.pageSize ?? DEFAULT_PAGE_SIZE;
      const search = input?.search;

      const items = await db
        .select({
          ...getTableColumns(agents),
          meetingCount: sql<number>`CAST(6 AS INTEGER)`,
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
