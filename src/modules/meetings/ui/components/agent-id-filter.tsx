"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { GeneratedAvatar } from "@/components/generated-avatar";

import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { api } from "@/trpc/client";

interface Agent {
  id: string;
  name: string;
}

export const AgentIdFilter = () => {
  const [filters, setFilters] = useMeetingsFilters();
  const [isOpen, setIsOpen] = useState(false);
  const [agentSearch, setAgentSearch] = useState("");

  const { data, isLoading } = api.agents.getMany.useQuery({
    page: 1,
    pageSize: 100,
    search: agentSearch || undefined,
  });

  const agents: Agent[] = (data?.items as Agent[]) || [];
  const selectedAgent = agents.find((agent) => agent.id === filters.agentId);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-9 flex items-center gap-x-2 min-w-30 justify-between"
        >
          <span className="flex items-center gap-x-2 truncate">
            {selectedAgent ? (
              <>
                <GeneratedAvatar
                  seed={selectedAgent.name}
                  variant="botttsNeutral"
                  className="size-4 shrink-0"
                />
                <span className="truncate">{selectedAgent.name}</span>
              </>
            ) : (
              "Agent"
            )}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Select Agent</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="px-2 py-1.5">
          <Input
            placeholder="Search agents..."
            value={agentSearch}
            onChange={(e) => setAgentSearch(e.target.value)}
            className="h-8"
            autoFocus
          />
        </div>

        <DropdownMenuSeparator />

        <div className="max-h-64 overflow-y-auto">
          <DropdownMenuItem
            onClick={() => {
              setFilters({ agentId: null });
              setIsOpen(false);
              setAgentSearch("");
            }}
            className="flex items-center justify-between"
          >
            All Agents
            {!filters.agentId && <span className="text-xs">✓</span>}
          </DropdownMenuItem>

          {isLoading ? (
            <DropdownMenuItem disabled className="text-muted-foreground">
              Loading agents...
            </DropdownMenuItem>
          ) : agents.length === 0 ? (
            <DropdownMenuItem disabled className="text-muted-foreground">
              {agentSearch ? "No agents found" : "No agents created yet"}
            </DropdownMenuItem>
          ) : (
            agents.map((agent) => (
              <DropdownMenuItem
                key={agent.id}
                onClick={() => {
                  setFilters({ agentId: agent.id });
                  setIsOpen(false);
                  setAgentSearch("");
                }}
                className="flex items-center gap-x-2"
              >
                <GeneratedAvatar
                  seed={agent.name}
                  variant="botttsNeutral"
                  className="size-4 shrink-0"
                />
                <span className="flex-1 truncate">{agent.name}</span>
                {filters.agentId === agent.id && (
                  <span className="ml-auto text-xs">✓</span>
                )}
              </DropdownMenuItem>
            ))
          )}
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            window.location.href = "/agents";
          }}
          className="text-primary font-medium"
        >
          + Create New Agent
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
