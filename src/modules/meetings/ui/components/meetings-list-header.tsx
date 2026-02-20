"use client";

import { useState } from "react";
import { PlusIcon, XCircleIcon } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { NewMeetingDialog } from "./new-meeting-dialog";
import { AgentIdFilter } from "./agent-id-filter";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { StatusFilter } from "./status-filter";
import { MeetingsSearchFilter } from "./meetings-search-filter";
import { DEFAULT_PAGE } from "@/constants";

interface MeetingsHeaderProps {
  total: number;
}

export const MeetingsHeader = ({ total }: MeetingsHeaderProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useMeetingsFilters();

  const isAnyFilterModified =
    Boolean(filters.status) ||
    Boolean(filters.search) ||
    Boolean(filters.agentId);

  const onClearFilters = () => {
    setFilters({
      status: null,
      agentId: null,
      search: null,
      page: DEFAULT_PAGE,
    });
  };

  return (
    <>
      <NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="font-medium text-xl">My Meetings</h5>
            <p className="text-sm text-muted-foreground mt-1">
              Total {total} {total === 1 ? "meeting" : "meetings"}
            </p>
          </div>

          <Button
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <PlusIcon className="h-4 w-4" />
            New Meeting
          </Button>
        </div>

        <ScrollArea className="w-full">
          <div className="flex items-center gap-x-2 min-w-max pb-2">
            <MeetingsSearchFilter />
            <StatusFilter />
            <AgentIdFilter />

            {isAnyFilterModified && (
              <Button
                type="button"
                variant="outline"
                onClick={onClearFilters}
                className="h-9 flex items-center gap-x-2"
              >
                <XCircleIcon className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export { MeetingsHeader as MeetingsListHeader };
