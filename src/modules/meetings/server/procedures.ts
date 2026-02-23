// import { z } from "zod";
// import { TRPCError } from "@trpc/server";
// import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";

// import { MeetingStatus } from "../types";
// import { db } from "@/db";
// import { meetings, agents } from "@/db/schema";
// import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
// import {
//   DEFAULT_PAGE,
//   DEFAULT_PAGE_SIZE,
//   MAX_PAGE_SIZE,
//   MIN_PAGE_SIZE,
// } from "@/constants";

// import { meetingsInsertSchema, meetingsUpdateSchema } from "../schemas";

// export const meetingsRouter = createTRPCRouter({
//   getOne: protectedProcedure
//     .input(z.object({ id: z.string() }))
//     .query(async ({ ctx, input }) => {
//       const [meeting] = await db
//         .select({
//           ...getTableColumns(meetings),
//           agent: agents,
//         })
//         .from(meetings)
//         .innerJoin(agents, eq(meetings.agentId, agents.id))
//         .where(
//           and(eq(meetings.id, input.id), eq(meetings.userId, ctx.user.id)),
//         );

//       if (!meeting) {
//         throw new TRPCError({
//           code: "NOT_FOUND",
//           message: "Meeting not found",
//         });
//       }

//       return meeting;
//     }),

//   getMany: protectedProcedure
//     .input(
//       z.object({
//         page: z.number().default(DEFAULT_PAGE),
//         pageSize: z
//           .number()
//           .min(MIN_PAGE_SIZE)
//           .max(MAX_PAGE_SIZE)
//           .default(DEFAULT_PAGE_SIZE),
//         search: z.string().nullish(),
//         agentId: z.string().nullish(),
//         status: z
//           .enum([
//             MeetingStatus.Upcoming,
//             MeetingStatus.Active,
//             MeetingStatus.Completed,
//             MeetingStatus.Processing,
//             MeetingStatus.Cancelled,
//           ])
//           .nullish(),
//       }),
//     )
//     .query(async ({ ctx, input }) => {
//       const { search, status, agentId } = input;
//       const page = Math.max(1, input.page);
//       const pageSize = input.pageSize;

//       const whereClause = and(
//         eq(meetings.userId, ctx.user.id),
//         search ? ilike(meetings.name, `%${search}%`) : undefined,
//         status ? eq(meetings.status, status) : undefined,
//         agentId ? eq(meetings.agentId, agentId) : undefined,
//       );

//       const [totalResult] = await db
//         .select({ count: count() })
//         .from(meetings)
//         .innerJoin(agents, eq(meetings.agentId, agents.id))
//         .where(whereClause);

//       const total = Number(totalResult?.count ?? 0);
//       const totalPages = Math.max(1, Math.ceil(total / pageSize));
//       const safePage = Math.min(page, totalPages);

//       const items = await db
//         .select({
//           ...getTableColumns(meetings),
//           agent: agents,
//           duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as(
//             "duration",
//           ),
//         })
//         .from(meetings)
//         .innerJoin(agents, eq(meetings.agentId, agents.id))
//         .where(whereClause)
//         .orderBy(desc(meetings.createdAt), desc(meetings.id))
//         .limit(pageSize)
//         .offset((safePage - 1) * pageSize);

//       return {
//         items,
//         total,
//         totalPages,
//         page: safePage,
//       };
//     }),

//   create: protectedProcedure
//     .input(meetingsInsertSchema)
//     .mutation(async ({ input, ctx }) => {
//       const [createdMeeting] = await db
//         .insert(meetings)
//         .values({
//           ...input,
//           userId: ctx.user.id,
//           status: MeetingStatus.Upcoming,
//         })
//         .returning();

//       return createdMeeting;
//     }),

//   update: protectedProcedure
//     .input(meetingsUpdateSchema)
//     .mutation(async ({ ctx, input }) => {
//       const { id, ...updateData } = input;

//       const [updatedMeeting] = await db
//         .update(meetings)
//         .set(updateData)
//         .where(and(eq(meetings.id, id), eq(meetings.userId, ctx.user.id)))
//         .returning();

//       if (!updatedMeeting) {
//         throw new TRPCError({
//           code: "NOT_FOUND",
//           message: "Meeting not found",
//         });
//       }

//       return updatedMeeting;
//     }),

//   remove: protectedProcedure
//     .input(z.object({ id: z.string() }))
//     .mutation(async ({ ctx, input }) => {
//       const [removedMeeting] = await db
//         .delete(meetings)
//         .where(and(eq(meetings.id, input.id), eq(meetings.userId, ctx.user.id)))
//         .returning();

//       if (!removedMeeting) {
//         throw new TRPCError({
//           code: "NOT_FOUND",
//           message: "Meeting not found",
//         });
//       }

//       return removedMeeting;
//     }),
// });
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";

import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { generateAvatarUri } from "@/lib/avatar";
import { streamVideo } from "@/lib/stream-video";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants";

import { MeetingStatus } from "../types";
import { meetingsInsertSchema, meetingsUpdateSchema } from "../schemas";

export const meetingsRouter = createTRPCRouter({
  generateToken: protectedProcedure.mutation(async ({ ctx }) => {
    await streamVideo.upsertUsers([
      {
        id: ctx.user.id,
        name: ctx.user.name,
        role: "admin",
        image:
          ctx.user.image ??
          generateAvatarUri({ seed: ctx.user.name, variant: "initials" }),
      },
    ]);

    const expirationTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour
    const issuedAt = Math.floor(Date.now() / 1000) - 60;

    const token = streamVideo.generateUserToken({
      user_id: ctx.user.id,
      exp: expirationTime,
      validity_in_seconds: issuedAt,
    });

    return token;
  }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [removedMeeting] = await db
        .delete(meetings)
        .where(and(eq(meetings.id, input.id), eq(meetings.userId, ctx.user.id)))
        .returning();

      if (!removedMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      return removedMeeting;
    }),

  update: protectedProcedure
    .input(meetingsUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const [updatedMeeting] = await db
        .update(meetings)
        .set(input)
        .where(and(eq(meetings.id, input.id), eq(meetings.userId, ctx.user.id)))
        .returning();

      if (!updatedMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      return updatedMeeting;
    }),

  create: protectedProcedure
    .input(meetingsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdMeeting] = await db
        .insert(meetings)
        .values({
          ...input,
          userId: ctx.user.id,
          status: MeetingStatus.Upcoming,
        })
        .returning();

      // TODO: Create Stream Call, Upsert Stream Users
      const call = streamVideo.video.call("default", createdMeeting.id);
      await call.create({
        data: {
          created_by_id: ctx.user.id,
          custom: {
            meetingId: createdMeeting.id,
            meetingName: createdMeeting.name,
          },
          settings_override: {
            transcription: {
              language: "en",
              mode: "auto-on",
              closed_caption_mode: "auto-on",
            },
            recording: {
              mode: "auto-on",
              quality: "1080p",
            },
          },
        },
      });

      const [existingAgent] = await db
        .select()
        .from(agents)
        .where(eq(agents.id, createdMeeting.agentId));

      if (!existingAgent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found",
        });
      }

      await streamVideo.upsertUsers([
        {
          id: existingAgent.id,
          name: existingAgent.name,
          role: "user",
          image: generateAvatarUri({
            seed: existingAgent.name,
            variant: "botttsNeutral",
          }),
        },
      ]);

      return createdMeeting;
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [existingMeeting] = await db
        .select({
          ...getTableColumns(meetings),
          agent: agents,
          duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as(
            "duration",
          ),
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(eq(meetings.id, input.id), eq(meetings.userId, ctx.user.id)),
        );

      if (!existingMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      return existingMeeting;
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
        agentId: z.string().nullish(),
        status: z
          .enum([
            MeetingStatus.Upcoming,
            MeetingStatus.Active,
            MeetingStatus.Completed,
            MeetingStatus.Processing,
            MeetingStatus.Cancelled,
          ])
          .nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { search, page, pageSize, status, agentId } = input;

      const data = await db
        .select({
          ...getTableColumns(meetings),
          agent: agents,
          duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as(
            "duration",
          ),
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(
            eq(meetings.userId, ctx.user.id),
            search ? ilike(meetings.name, `%${search}%`) : undefined,
            status ? eq(meetings.status, status) : undefined,
            agentId ? eq(meetings.agentId, agentId) : undefined,
          ),
        )
        .orderBy(desc(meetings.createdAt), desc(meetings.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [total] = await db
        .select({ count: count() })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(
            eq(meetings.userId, ctx.user.id),
            search ? ilike(meetings.name, `%${search}%`) : undefined,
            status ? eq(meetings.status, status) : undefined,
            agentId ? eq(meetings.agentId, agentId) : undefined,
          ),
        );

      const totalPages = Math.ceil(total.count / pageSize);

      return {
        items: data,
        total: total.count,
        totalPages,
        page,
      };
    }),
});
