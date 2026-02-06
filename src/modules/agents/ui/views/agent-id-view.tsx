"use client";

import { trpc } from "@/trpc/client";
import { Badge } from "@/components/ui/badge";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { VideoIcon } from "lucide-react";

import { AgentIdViewHeader } from "../components/agent-id-view-header";

interface Props {
  agentId: string;
}

export const AgentIdView = ({ agentId }: Props) => {
  // Fetch data using TRPC's useSuspenseQuery
  const data = trpc.agents.getOne.useSuspenseQuery({ id: agentId });

  // If your query returns an array, take the first element
  const agent = Array.isArray(data) ? data[0] : data;

  return (
    <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
      <AgentIdViewHeader
        agentId={agentId}
        agentName={agent?.name ?? "Unknown Agent"}
        onEdit={() => {}}
        onRemove={() => {}}
      />

      <div className="bg-white rounded-lg border mt-4">
        <div className="px-4 py-5 flex flex-col gap-y-5">
          <div className="flex items-center gap-x-3">
            <GeneratedAvatar
              variant="botttsNeutral"
              seed={agent?.name ?? "unknown"}
              className="size-10"
            />
            <h2 className="text-2xl font-medium">
              {agent?.name ?? "Unknown Agent"}
            </h2>
          </div>

          <Badge
            variant="outline"
            className="flex items-center gap-x-2 [&>svg]:size-4"
          >
            <VideoIcon className="text-blue-700" />
            {agent?.meetingCount ?? 0}{" "}
            {agent?.meetingCount === 1 ? "meeting" : "meetings"}
          </Badge>

          <div className="flex flex-col gap-y-4">
            <p className="text-lg font-medium">Instructions</p>
            <p className="text-neutral-800">{agent?.instructions ?? "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder for loading state
export const AgentIdViewLoading = () => (
  <div className="flex flex-col items-center justify-center py-10">
    <h2 className="text-lg font-semibold">Loading Agent</h2>
    <p>This may take a few seconds</p>
  </div>
);

// Placeholder for error state
export const AgentIdViewError = () => (
  <div className="flex flex-col items-center justify-center py-10 text-red-500">
    <h2 className="text-lg font-semibold">Error Loading Agent</h2>
    <p>Something went wrong</p>
  </div>
);
