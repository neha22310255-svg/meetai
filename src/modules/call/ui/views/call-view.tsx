// import { headers } from "next/headers";
// import { redirect } from "next/navigation";
// import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

// import { auth } from "@/lib/auth";
// import { getQueryClient, trpc } from "@/trpc/server";

// import { CallView } from "./call-view";

// interface Props {
//   params: Promise<{
//     meetingId: string;
//   }>;
// }

// const Page = async ({ params }: Props) => {
//   const { meetingId } = await params;

//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });

//   if (!session) {
//     redirect("/sign-in");
//   }

//   const queryClient = getQueryClient();

//   try {
//     await queryClient.prefetchQuery(
//       trpc.meetings.getOne.queryOptions({ id: meetingId }),
//     );
//   } catch (error) {
//     console.error("Failed to prefetch meeting:", error);
//   }

//   return (
//     <HydrationBoundary state={dehydrate(queryClient)}>
//       <CallView meetingId={meetingId} />
//     </HydrationBoundary>
//   );
// };

// export default Page;

"use client";

import { api } from "@/trpc/client";
import { ErrorState } from "@/components/error-state";
import { CallProvider } from "../components/call-provider";

interface Props {
  meetingId: string;
}

export const CallView = ({ meetingId }: Props) => {
  // Use tRPC's built-in suspense query hook
  const [meeting] = api.meetings.getOne.useSuspenseQuery({ id: meetingId });

  if (meeting.status === "completed") {
    return (
      <div className="flex h-screen items-center justify-center">
        <ErrorState
          title="Meeting has ended"
          description="You can no longer join this meeting"
        />
      </div>
    );
  }

  return <CallProvider meetingId={meetingId} meetingName={meeting.name} />;
};
