"use client";

import { trpc } from "@/trpc/client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";

import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";

export const AgentsView = () => {
  const [data] = trpc.agents.getMany.useSuspenseQuery();

  if (!data || data.length === 0) {
    return (
      <div className="flex-1 pb-4 px-4 md:px-8 flex items-center justify-center">
        <EmptyState
          title="Create your first agent"
          description="Create an agent to join your meetings. Each agent will follow your instructions and can interact with participants during the call."
        />
      </div>
    );
  }

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable data={data} columns={columns} />
    </div>
  );
};

export const AgentsViewLoading = () => (
  <div className="flex-1 pb-4 px-4 md:px-8 flex items-center justify-center">
    <LoadingState
      title="Loading Agents"
      description="This may take a few seconds"
    />
  </div>
);

export const AgentsViewError = () => (
  <div className="flex-1 pb-4 px-4 md:px-8 flex items-center justify-center">
    <ErrorState
      title="Error Loading Agents"
      description="Something went wrong while loading agents"
    />
  </div>
);
