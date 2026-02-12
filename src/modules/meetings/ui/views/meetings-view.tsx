"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Clock, MoreVertical, Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";

import type { MeetingGetMany } from "@/modules/meetings/types";
import { MeetingsHeader } from "../components/meetings-list-header";

export const MeetingsView = () => {
  const [search, setSearch] = useState("");

  const [data] = trpc.meetings.getMany.useSuspenseQuery({
    page: 1,
    pageSize: 100,
    search: search || undefined,
  });

  const meetings = data?.items || [];

  if (meetings.length === 0 && !search) {
    return (
      <div className="flex flex-col h-full">
        <MeetingsHeader total={0} search={search} setSearch={setSearch} />

        <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 text-center">
          {/* Empty SVG Image */}
          <div className="relative w-64 h-64 mb-8">
            <Image
              src="/empty.svg"
              alt="No meetings"
              fill
              className="object-contain"
              priority
            />
          </div>

          <h3 className="text-xl font-semibold mb-2">
            Create your first meeting
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Schedule a meeting to connect with others. Each meeting lets you
            collaborate, share ideas, and interact with participants in real
            time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8">
      <MeetingsHeader
        total={data?.total || 0}
        search={search}
        setSearch={setSearch}
      />

      <div className="mt-6">
        <p className="text-sm text-muted-foreground mb-4">TODO: Filters</p>

        {/* Meetings List */}
        <div className="space-y-3">
          {meetings.map((meeting) => (
            <MeetingRow key={meeting.id} meeting={meeting} />
          ))}
        </div>

        {meetings.length === 0 && search && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No meetings found matching "{search}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

interface MeetingRowProps {
  meeting: MeetingGetMany[number];
}

const MeetingRow = ({ meeting }: MeetingRowProps) => {
  const agentName = meeting.agent?.name || "New Agent";
  const agentAvatar = meeting.agent?.name || "agent";

  const statusConfig: Record<string, { label: string; icon: React.ReactNode }> =
    {
      upcoming: { label: "Upcoming", icon: <Clock className="h-3 w-3" /> },
      active: { label: "Upcoming", icon: <Clock className="h-3 w-3" /> },
      "in-progress": { label: "Upcoming", icon: <Clock className="h-3 w-3" /> },
      completed: { label: "Completed", icon: <Clock className="h-3 w-3" /> },
      processing: { label: "Processing", icon: <Clock className="h-3 w-3" /> },
      cancelled: { label: "Cancelled", icon: <Clock className="h-3 w-3" /> },
    };

  const status = statusConfig[meeting.status] || statusConfig.upcoming;

  return (
    <Link href={`/meetings/${meeting.id}`}>
      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors group">
        {/* Left section: Title and Agent */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-base group-hover:text-primary transition-colors">
            {meeting.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <GeneratedAvatar
              variant="botttsNeutral"
              seed={agentAvatar}
              className="h-4 w-4 rounded-full"
            />
            <span className="text-sm text-muted-foreground truncate">
              {agentName}
            </span>
          </div>
        </div>

        {/* Right section: Status and Duration */}
        <div className="flex items-center gap-4 ml-4">
          <Badge variant="outline" className="flex items-center gap-1.5">
            {status.icon}
            {status.label}
          </Badge>

          <Badge variant="outline" className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            No Duration
          </Badge>
        </div>
      </div>
    </Link>
  );
};

export const MeetingsViewLoading = () => (
  <div className="flex flex-col h-full p-4 md:p-8">
    <LoadingState
      title="Loading Meetings"
      description="Loading your meetings data..."
    />
  </div>
);

export const MeetingsViewError = () => (
  <div className="flex flex-col h-full p-4 md:p-8">
    <ErrorState
      title="Failed to load meetings"
      description="There was an error loading your meetings. Please try again."
    />
  </div>
);
