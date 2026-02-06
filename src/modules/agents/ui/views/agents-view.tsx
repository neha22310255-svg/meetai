"use client";

import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/empty-state";
import { trpc } from "@/trpc/client";

import { columns } from "../components/columns";
import { DataTable } from "../components/data-table"; // Matches the Named Export
import { DataPagination } from "../components/data-pagination";
import { useAgentsFilters } from "../../hooks/use-agents-filters";

type AgentItem = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  instructions: string;
  meetingCount: number;
};

export const AgentsViewLoading = () => {
  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex items-center justify-center">
      <div className="animate-pulse text-zinc-500">Loading agents...</div>
    </div>
  );
};

export const AgentsView = () => {
  const router = useRouter();
  const [filters, setFilters] = useAgentsFilters();

  // useSuspenseQuery ensures 'data' is defined when the component renders
  const [data] = trpc.agents.getMany.useSuspenseQuery({
    ...filters,
  });

  if (!data || data.items.length === 0) {
    return (
      <div className="flex-1 pb-4 px-4 md:px-8 flex items-center justify-center">
        <EmptyState
          title="Create your first agent"
          description="Create an agent to join your meetings."
        />
      </div>
    );
  }

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable
        data={data.items}
        columns={columns}
        onRowClick={(row: AgentItem) => router.push(`/agents/${row.id}`)}
      />

      <DataPagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilters({ page })}
      />
    </div>
  );
};
