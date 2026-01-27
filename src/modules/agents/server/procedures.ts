import { z } from "zod";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { agentsInsertSchema } from "../schemas";

export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [existingAgent] = await db
        .select()
        .from(agents)
        .where(eq(agents.id, input.id));

      // Optional: Add authorization check to ensure user owns this agent
      if (existingAgent && existingAgent.userId !== ctx.user.id) {
        throw new Error("Not authorized to access this agent");
      }

      return existingAgent;
    }),

  getMany: protectedProcedure.query(async ({ ctx }) => {
    const data = await db
      .select()
      .from(agents)
      .where(eq(agents.userId, ctx.user.id)); // Only get user's agents
    return data;
  }),

  create: protectedProcedure
    .input(agentsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdAgent] = await db
        .insert(agents)
        .values({
          ...input,
          userId: ctx.user.id,
        })
        .returning();

      return createdAgent;
    }),
});

// if wanted show error on page after logged user tries to access any data

// import { z } from "zod";
// import { eq } from "drizzle-orm";

// import { db } from "@/db";
// import { agents } from "@/db/schema";
// import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
// import { agentsInsertSchema } from "../schemas";

// export const agentsRouter = createTRPCRouter({
//   getOne: protectedProcedure
//     .input(z.object({ id: z.string() }))
//     .query(async ({ input, ctx }) => {
//       const [existingAgent] = await db
//         .select()
//         .from(agents)
//         .where(eq(agents.id, input.id));

//       if (existingAgent && existingAgent.userId !== ctx.user.id) {
//         throw new Error("Not authorized to access this agent");
//       }

//       return existingAgent;
//     }),

//   getMany: protectedProcedure.query(async ({ ctx }) => {
//     const data = await db
//       .select()
//       .from(agents)
//       .where(eq(agents.userId, ctx.user.id)); // Only get user's agents
//     return data;
//   }),

//   create: protectedProcedure
//     .input(agentsInsertSchema)
//     .mutation(async ({ input, ctx }) => {
//       const [createdAgent] = await db
//         .insert(agents)
//         .values({
//           ...input,
//           userId: ctx.user.id,
//         })
//         .returning();

//       return createdAgent;
//     }),
// });
