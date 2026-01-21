import "server-only"; // ensures this file is never imported on the client

import { cache } from "react";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";

import { appRouter } from "./routers/_app";
import { makeQueryClient } from "./query-client";
import { createTRPCContext } from "./init";

/* --------------------------------------------
   Stable QueryClient per request
--------------------------------------------- */
export const getQueryClient = cache(makeQueryClient);

/* --------------------------------------------
   Server-side tRPC proxy
--------------------------------------------- */
export const trpc = createTRPCOptionsProxy({
  router: appRouter,
  ctx: createTRPCContext,
  queryClient: getQueryClient,
});
export const caller = appRouter.createCaller(createTRPCContext);
