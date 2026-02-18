// import { Suspense } from "react";
// import { ErrorBoundary } from "react-error-boundary";
// import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";

// import { getQueryClient, trpc } from "@/trpc/server";
// import { auth } from "@/lib/auth";

// import type { SearchParams } from "nuqs/server";
// import { loadSearchParams } from "@/modules/agents/params";
// import {
//   MeetingsView,
//   MeetingsViewError,
//   MeetingsViewLoading,
// } from "@/modules/meetings/ui/views/meetings-view";

// interface Props {
//   searchParams: Promise<SearchParams>;
// }

// const Page = async ({ searchParams }: Props) => {
//   // Linter warning: 'filters' is assigned a value but never used.
//   const filters = await loadSearchParams(searchParams);

//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });

//   if (!session) {
//     // ... handling for unauthenticated users
//     redirect("/sign-in");
//   }

//   const queryClient = getQueryClient();
//   void queryClient.prefetchQuery(
//     trpc.meetings.getMany.queryOptions({
//       ...filters,
//     }),
//   );
//   // Prefetch meetings data
//   void queryClient.prefetchQuery(
//     trpc.meetings.getMany.queryOptions({
//       page: 1,
//       pageSize: 100,
//     }),
//   );

//   return (
//     <div className="flex flex-col h-full">
//       <HydrationBoundary state={dehydrate(queryClient)}>
//         <Suspense fallback={<MeetingsViewLoading />}>
//           <ErrorBoundary fallback={<MeetingsViewError />}>
//             <MeetingsView />
//           </ErrorBoundary>
//         </Suspense>
//       </HydrationBoundary>
//     </div>
//   );
// };

// export default Page;

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getQueryClient, trpc } from "@/trpc/server";
import { auth } from "@/lib/auth";

import type { SearchParams } from "nuqs/server";
import { loadSearchParams } from "@/modules/agents/params";
import {
  MeetingsView,
  MeetingsViewError,
  MeetingsViewLoading,
} from "@/modules/meetings/ui/views/meetings-view";

interface Props {
  searchParams: Promise<SearchParams>;
}

const Page = async ({ searchParams }: Props) => {
  const filters = await loadSearchParams(searchParams);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const queryClient = getQueryClient();

  // Single prefetch query with pageSize: 2
  void queryClient.prefetchQuery(
    trpc.meetings.getMany.queryOptions({
      page: filters.page || 1,
      pageSize: 2, // 👈 Changed to 2 meetings per page
      search: filters.search,
      status: filters.status,
      agentId: filters.agentId,
    }),
  );

  return (
    <div className="flex flex-col h-full">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<MeetingsViewLoading />}>
          <ErrorBoundary fallback={<MeetingsViewError />}>
            <MeetingsView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </div>
  );
};

export default Page;
