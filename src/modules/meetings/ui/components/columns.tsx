"use client";

declare module "humanize-duration";

import { format } from "date-fns";
import humanizeDuration from "humanize-duration";
import { ColumnDef } from "@tanstack/react-table";
import {
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  ClockFadingIcon,
  CornerDownRightIcon,
  LoaderIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { GeneratedAvatar } from "@/components/generated-avatar";

import { MeetingGetMany } from "../../types";

function formatDuration(seconds: number | null | undefined) {
  if (!seconds) return "—";
  return humanizeDuration(seconds * 1000, {
    largest: 1,
    round: true,
    units: ["h", "m", "s"],
  });
}

const statusIconMap = {
  upcoming: ClockArrowUpIcon,
  active: LoaderIcon,
  completed: CircleCheckIcon,
  processing: LoaderIcon,
  cancelled: CircleXIcon,
};

const statusColorMap = {
  upcoming: "bg-yellow-500/20 text-yellow-800 border-yellow-800/5",
  active: "bg-blue-500/20 text-blue-800 border-blue-800/5",
  completed: "bg-emerald-500/20 text-emerald-800 border-emerald-800/5",
  cancelled: "bg-rose-500/20 text-rose-800 border-rose-800/5",
  processing: "bg-gray-300/20 text-gray-800 border-gray-800/5",
};

export const columns: ColumnDef<MeetingGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Agent Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-1">
        <div className="flex items-center gap-x-2">
          <GeneratedAvatar
            variant="botttsNeutral"
            seed={row.original.name}
            className="size-8"
          />
          <span className="font-semibold capitalize">{row.original.name}</span>
        </div>
        <div className="flex items-center gap-x-1">
          <CornerDownRightIcon className="size-3 text-muted-foreground" />
          <span className="text-sm text-muted-foreground max-w-50 truncate capitalize">
            {row.original.agent?.name || "No agent"}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status as keyof typeof statusIconMap;
      const Icon = statusIconMap[status] || ClockArrowUpIcon;
      const colorClass =
        statusColorMap[status] || "bg-gray-500/20 text-gray-800";

      return (
        <Badge
          variant="outline"
          className={cn("capitalize gap-x-2", colorClass)}
        >
          <Icon className="size-4" />
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "agent.name",
    header: "Agent",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        <GeneratedAvatar
          variant="botttsNeutral"
          seed={row.original.agent?.name || "agent"}
          className="size-6"
        />
        <span className="text-sm capitalize">
          {row.original.agent?.name || "AI Agent"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "startedAt",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.startedAt
          ? format(new Date(row.original.startedAt), "MMM d, yyyy")
          : row.original.createdAt
            ? format(new Date(row.original.createdAt), "MMM d, yyyy")
            : "Not scheduled"}
      </span>
    ),
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        <ClockFadingIcon className="size-4 text-muted-foreground" />
        <span className="text-sm">{formatDuration(row.original.duration)}</span>
      </div>
    ),
  },
];
