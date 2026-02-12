"use client";

import { useState } from "react";
import { Search, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NewMeetingDialog } from "./new-meeting-dialog";

interface MeetingsHeaderProps {
  total: number;
  search: string;
  setSearch: (value: string) => void;
}

export const MeetingsHeader = ({
  total,
  search,
  setSearch,
}: MeetingsHeaderProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      <div className="space-y-4">
        {/* Title and Search Row */}
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">My Meetings</h1>

          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-9"
              />
              {search && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Button
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              New Meeting
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

// Also export as MeetingsListHeader for backward compatibility
export { MeetingsHeader as MeetingsListHeader };
