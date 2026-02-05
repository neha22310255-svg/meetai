"use client";

import { useState } from "react";
import { Search, XCircle } from "lucide-react";
import { useQueryState, parseAsString } from "nuqs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";

export const AgentsListHeader = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [query, setQuery] = useQueryState(
    "query",
    parseAsString.withDefault("").withOptions({ shallow: false }),
  );

  return (
    <>
      {/* New Agent Modal */}
      <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      <div className="flex flex-col gap-y-4 px-4 md:px-8 pt-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">My Agents</h1>

          <Button
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-x-2"
          >
            <span className="text-lg">+</span>
            New Agent
          </Button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-x-2">
          <div className="relative w-full max-w-75">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
            <Input
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 bg-transparent border-zinc-800 text-white h-9"
            />
          </div>

          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuery("")}
              className="flex items-center gap-x-2 text-zinc-400 hover:text-white hover:bg-zinc-800 h-9 px-3 border border-zinc-800"
            >
              <XCircle className="size-4" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
