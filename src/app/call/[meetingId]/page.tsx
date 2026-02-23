"use client";

import { api } from "@/trpc/client";
import { CallProvider } from "@/modules/call/ui/components/call-provider";
interface Props {
  params: {
    meetingId: string;
  };
}

const CallView = ({ params }: Props) => {
  const { meetingId } = params;

  const { data } = api.meetings.getOne.useQuery({
    id: meetingId,
  });

  if (!data) return null;

  return <CallProvider meetingId={meetingId} meetingName={data.name} />;
};

export default CallView;
