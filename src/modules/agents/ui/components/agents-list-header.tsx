"use client";

import { useState } from "react";
import { PlusIcon, XCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";
import { useAgentsFilters } from "../../hooks/use-agents-filters";

const DEFAULT_PAGE = 1;

export const AgentsListHeader = () => {
  const [filters, setFilters] = useAgentsFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isAnyFilterModified = !!filters.search;

  const onClearFilters = () => {
    setFilters({
      search: "",
      page: DEFAULT_PAGE,
    });
  };

  return (
    <>
      <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      <div className="py-4 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Agents</h1>

          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusIcon className="size-4 mr-2" />
            New Agent
          </Button>
        </div>

        {isAnyFilterModified && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="w-fit"
          >
            <XCircleIcon className="size-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
    </>
  );
};
