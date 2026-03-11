// "use client";

// import { api } from "@/trpc/client";
// import { CallProvider } from "@/modules/call/ui/components/call-provider";
// interface Props {
//   params: {
//     meetingId: string;
//   };
// }

// const CallView = ({ params }: Props) => {
//   const { meetingId } = params;

//   const { data } = api.meetings.getOne.useQuery({
//     id: meetingId,
//   });

//   if (!data) return null;

//   return <CallProvider meetingId={meetingId} meetingName={data.name} />;
// };

// export default CallView;

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/trpc/server";

import { CallView } from "@/modules/call/ui/views/call-view";

interface Props {
  params: Promise<{
    meetingId: string;
  }>;
}

const Page = async ({ params }: Props) => {
  const { meetingId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CallView meetingId={meetingId} />
    </HydrationBoundary>
  );
};

export default Page;
