"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { trpc } from "@/trpc/client";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";

export const MeetingsView = () => {
  const result = trpc.meetings.getMany.useSuspenseQuery();
  const data = result[0];

  return <div>{JSON.stringify(data)}</div>;
};

export const MeetingsViewLoading = () => (
  <LoadingState
    title="Loading Meetings"
    description="This may take a few seconds"
  />
);

export const MeetingsViewError = () => (
  <ErrorState
    title="Error Loading Meetings"
    description="Something went wrong"
  />
);
