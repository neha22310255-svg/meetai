"use client";

import { useState } from "react";
import { PlusIcon, XCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";
import { useAgentsFilters } from "../../hooks/use-agents-filters";
import { DEFAULT_PAGE } from "@/constants";

export const AgentsListHeader = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useAgentsFilters();

  const isAnyFilterModified = Boolean(filters.search);

  const handleClearFilters = () => {
    setFilters({
      search: "",
      page: DEFAULT_PAGE,
    });
  };

  return (
    <>
      <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h5 className="text-xl font-medium">My Agents</h5>
          </div>

          <Button
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            New Agent
          </Button>
        </div>

        {/* Filters Section */}
        <ScrollArea className="w-full">
          <div className="flex items-center gap-x-2 min-w-max pb-2">
            {isAnyFilterModified && (
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="h-9 flex items-center gap-2"
              >
                <XCircleIcon className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>

          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
};

export { AgentsListHeader as AgentsHeader };
