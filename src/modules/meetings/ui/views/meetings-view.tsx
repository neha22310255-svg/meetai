// "use client";

// import { trpc } from "@/trpc/client";
// import { ErrorState } from "@/components/error-state";
// import { LoadingState } from "@/components/loading-state";

// export const MeetingsView = () => {
//   const { data, isLoading, error } = trpc.meetings.getMany.useQuery({
//     page: 1,
//     pageSize: 100,
//   });

//   if (isLoading) {
//     return <MeetingsViewLoading />;
//   }

//   if (error) {
//     return <MeetingsViewError />;
//   }

//   return (
//     <div className="overflow-x-auto">
//       <pre className="p-4 text-sm">{JSON.stringify(data, null, 2)}</pre>
//     </div>
//   );
// };

// export const MeetingsViewLoading = () => {
//   return (
//     <LoadingState
//       title="Loading Meetings"
//       description="Loading meetings data..."
//     />
//   );
// };

// export const MeetingsViewError = () => {
//   return (
//     <ErrorState
//       title="Error Loading Meetings"
//       description="Failed to load meetings data"
//     />
//   );
// };
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar, Clock, MoreVertical, Play, Video } from "lucide-react";
import Link from "next/link";

import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";

export const MeetingsView = () => {
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = trpc.meetings.getMany.useQuery({
    page: 1,
    pageSize: 100,
    search: search || undefined,
  });

  if (isLoading) {
    return <MeetingsViewLoading />;
  }

  if (error) {
    return <MeetingsViewError />;
  }

  const meetings = data?.items || [];

  if (meetings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="p-4 rounded-full bg-muted mb-4">
          <Video className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No meetings yet</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          Create your first meeting to get started with AI-powered
          conversations.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/meetings/new">Create Meeting</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Meetings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            You have {data?.total || 0} total meetings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search meetings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />
          <Button asChild>
            <Link href="/meetings/new">New Meeting</Link>
          </Button>
        </div>
      </div>

      {/* Filters - TODO */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-primary/5">
          All
        </Badge>
        <Badge variant="outline">Upcoming</Badge>
        <Badge variant="outline">Completed</Badge>
        <Badge variant="outline">Recorded</Badge>
      </div>

      {/* Meetings Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {meetings.map((meeting) => (
          <MeetingCard key={meeting.id} meeting={meeting} />
        ))}
      </div>
    </div>
  );
};

interface MeetingCardProps {
  meeting: {
    id: string;
    name: string;
    status: string;
    createdAt: string;
    agentName: string | null;
    startedAt?: string | null;
    endedAt?: string | null;
    recordingUrl?: string | null;
    transcriptUrl?: string | null;
  };
}

const MeetingCard = ({ meeting }: MeetingCardProps) => {
  const utils = trpc.useUtils();
  const formattedDate = format(new Date(meeting.createdAt), "MMM d, yyyy");
  const formattedTime = format(new Date(meeting.createdAt), "h:mm a");

  const statusColors: Record<string, string> = {
    upcoming: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    active: "bg-green-500/10 text-green-500 border-green-500/20",
    "in-progress": "bg-green-500/10 text-green-500 border-green-500/20",
    completed: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    processing: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  const statusColor =
    statusColors[meeting.status] || "bg-gray-500/10 text-gray-500";

  const getAgentInitial = (name: string | null) => {
    return name?.charAt(0).toUpperCase() || "A";
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <Badge variant="outline" className={statusColor}>
              {meeting.status}
            </Badge>
            <h3 className="font-semibold leading-none mt-3">
              <Link
                href={`/meetings/${meeting.id}`}
                className="hover:underline"
              >
                {meeting.name}
              </Link>
            </h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/meetings/${meeting.id}`}>View Details</Link>
              </DropdownMenuItem>
              {meeting.status === "upcoming" && (
                <DropdownMenuItem asChild>
                  <Link href={`/meetings/${meeting.id}/join`}>
                    Join Meeting
                  </Link>
                </DropdownMenuItem>
              )}
              {meeting.recordingUrl && (
                <DropdownMenuItem>View Recording</DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Cancel Meeting
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{formattedTime}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {getAgentInitial(meeting.agentName)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {meeting.agentName || "AI Agent"}
            </span>
          </div>
          {meeting.status === "upcoming" && (
            <Button size="sm" className="h-8 gap-1" asChild>
              <Link href={`/meetings/${meeting.id}/join`}>
                <Play className="h-3.5 w-3.5" />
                Join
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const MeetingsViewLoading = () => {
  return (
    <LoadingState
      title="Loading Meetings"
      description="Loading your meetings data..."
    />
  );
};

export const MeetingsViewError = () => {
  return (
    <ErrorState
      title="Failed to load meetings"
      description="There was an error loading your meetings. Please try again."
    />
  );
};
