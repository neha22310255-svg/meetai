"use client";

import { format } from "date-fns";
import { Clock, CircleCheck, CircleX, Loader, Video } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";

import { MeetingsHeader } from "../components/meetings-list-header";
import { DataPagination } from "../components/data-pagination";
import { MeetingStatus } from "../../types";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import type { MeetingGetMany } from "../../types";

export const MeetingsView = () => {
  const [filters, setFilters] = useMeetingsFilters();

  const page = filters.page ?? 1;

  const search = filters.search ?? "";
  const setSearch = (value: string) =>
    setFilters({
      ...filters,
      search: value,
      page: 1,
    });

  const [data] = trpc.meetings.getMany.useSuspenseQuery({
    page,
    pageSize: 10,
    search: filters.search ?? undefined,
    status: filters.status ?? undefined,
    agentId: filters.agentId ?? undefined,
  });

  const meetings = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  const handlePageChange = (newPage: number) => {
    setFilters({
      ...filters,
      page: newPage,
    });
  };

  if (
    meetings.length === 0 &&
    !filters.search &&
    !filters.status &&
    !filters.agentId
  ) {
    return (
      <div className="flex flex-col h-full">
        <MeetingsHeader total={0} search={search} setSearch={setSearch} />

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="relative w-48 h-48 mb-6">
            <Image
              src="/empty.svg"
              alt="No meetings"
              fill
              className="object-contain"
              priority
            />
          </div>

          <h3 className="text-lg font-semibold mb-2">
            Create your first meeting
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Schedule a meeting to connect with others.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <MeetingsHeader total={total} search={search} setSearch={setSearch} />

      <div className="flex-1 p-6 space-y-3 overflow-y-auto">
        {meetings.map((meeting) => (
          <MeetingRow key={meeting.id} meeting={meeting} />
        ))}

        {meetings.length === 0 &&
          (filters.search || filters.status || filters.agentId) && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No meetings found matching your filters
              </p>
              <Button
                variant="link"
                onClick={() =>
                  setFilters({
                    search: null,
                    status: null,
                    agentId: null,
                    page: 1,
                  })
                }
                className="mt-2"
              >
                Clear all filters
              </Button>
            </div>
          )}
      </div>

      {meetings.length > 0 && (
        <DataPagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};
interface MeetingRowProps {
  meeting: MeetingGetMany[number];
}

const MeetingRow = ({ meeting }: MeetingRowProps) => {
  const agentName = meeting.agent?.name || "New Agent";
  const agentAvatar = meeting.agent?.name || "agent";

  const getStatusConfig = (status: string) => {
    switch (status) {
      case MeetingStatus.Upcoming:
        return { label: "Upcoming", icon: Clock };
      case MeetingStatus.Active:
        return { label: "Active", icon: Video };
      case MeetingStatus.Completed:
        return { label: "Completed", icon: CircleCheck };
      case MeetingStatus.Processing:
        return { label: "Processing", icon: Loader };
      case MeetingStatus.Cancelled:
        return { label: "Cancelled", icon: CircleX };
      default:
        return { label: "Upcoming", icon: Clock };
    }
  };

  const status = getStatusConfig(meeting.status);
  const StatusIcon = status.icon;

  return (
    <Link href={`/meetings/${meeting.id}`}>
      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors group">
        <div className="flex items-center gap-3 min-w-0">
          <GeneratedAvatar
            variant="botttsNeutral"
            seed={agentAvatar}
            className="h-10 w-10 rounded-full shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-base group-hover:text-primary transition-colors truncate">
              {meeting.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground truncate">
                {agentName}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 ml-4 shrink-0">
          <Badge variant="outline" className="flex items-center gap-1.5">
            <StatusIcon className="h-3 w-3" />
            {status.label}
          </Badge>

          <Badge
            variant="outline"
            className="flex items-center gap-1.5 whitespace-nowrap"
          >
            <Clock className="h-3 w-3" />
            {meeting.createdAt
              ? format(new Date(meeting.createdAt), "MMM d, yyyy")
              : "No date"}
          </Badge>
        </div>
      </div>
    </Link>
  );
};

export const MeetingsViewLoading = () => (
  <div className="flex flex-col h-full">
    <LoadingState
      title="Loading Meetings"
      description="Loading your meetings data..."
    />
  </div>
);

export const MeetingsViewError = () => (
  <div className="flex flex-col h-full">
    <ErrorState
      title="Failed to load meetings"
      description="There was an error loading your meetings. Please try again."
    />
  </div>
);
