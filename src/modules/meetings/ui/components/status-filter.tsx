// import {
//   CircleXIcon,
//   CircleCheckIcon,
//   ClockArrowUpIcon,
//   VideoIcon,
//   LoaderIcon,
//   ChevronDown,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { MeetingStatus } from "../../types";
// import { useMeetingsFilters } from "../../hooks/use-meetings-filters";

// const statusConfig = [
//   {
//     status: MeetingStatus.Upcoming,
//     icon: ClockArrowUpIcon,
//     label: "Upcoming",
//   },
//   {
//     status: MeetingStatus.Completed,
//     icon: CircleCheckIcon,
//     label: "Completed",
//   },
//   {
//     status: MeetingStatus.Active,
//     icon: VideoIcon,
//     label: "Active",
//   },
//   {
//     status: MeetingStatus.Processing,
//     icon: LoaderIcon,
//     label: "Processing",
//   },
//   {
//     status: MeetingStatus.Cancelled,
//     icon: CircleXIcon,
//     label: "Cancelled",
//   },
// ];

// export const StatusFilter = () => {
//   const [filters, setFilters] = useMeetingsFilters();

//   const activeStatus = statusConfig.find((s) => s.status === filters.status);
//   const StatusIcon = activeStatus?.icon || ChevronDown;

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button
//           variant="outline"
//           className="h-9 flex items-center gap-x-2 min-w-30 justify-between"
//         >
//           <span className="flex items-center gap-x-2">
//             {activeStatus && <StatusIcon className="size-4" />}
//             {activeStatus?.label || "Status"}
//           </span>
//           <ChevronDown className="h-4 w-4 opacity-50" />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="start" className="w-48">
//         {statusConfig.map(({ status, icon: Icon, label }) => (
//           <DropdownMenuItem
//             key={status}
//             onClick={() =>
//               setFilters({
//                 status: filters.status === status ? null : status,
//               })
//             }
//             className="flex items-center gap-x-2"
//           >
//             <Icon className="size-4" />
//             {label}
//             {filters.status === status && (
//               <span className="ml-auto text-xs">✓</span>
//             )}
//           </DropdownMenuItem>
//         ))}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// };

import {
  CircleXIcon,
  CircleCheckIcon,
  ClockArrowUpIcon,
  VideoIcon,
  LoaderIcon,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MeetingStatus } from "../../types";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";

const statusConfig = [
  {
    status: MeetingStatus.Upcoming,
    icon: ClockArrowUpIcon,
    label: "Upcoming",
  },
  {
    status: MeetingStatus.Completed,
    icon: CircleCheckIcon,
    label: "Completed",
  },
  {
    status: MeetingStatus.Active,
    icon: VideoIcon,
    label: "Active",
  },
  {
    status: MeetingStatus.Processing,
    icon: LoaderIcon,
    label: "Processing",
  },
  {
    status: MeetingStatus.Cancelled,
    icon: CircleXIcon,
    label: "Cancelled",
  },
];

export const StatusFilter = () => {
  const [filters, setFilters] = useMeetingsFilters();

  const activeStatus = statusConfig.find((s) => s.status === filters.status);
  const StatusIcon = activeStatus?.icon || ChevronDown;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-9 flex items-center gap-x-2 min-w-30 justify-between"
        >
          <span className="flex items-center gap-x-2">
            {activeStatus && <StatusIcon className="size-4" />}
            {activeStatus?.label || "Status"}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {statusConfig.map(({ status, icon: Icon, label }) => (
          <DropdownMenuItem
            key={status}
            onClick={() =>
              setFilters({
                status: filters.status === status ? null : status,
              })
            }
            className="flex items-center gap-x-2"
          >
            <Icon className="size-4" />
            {label}
            {filters.status === status && (
              <span className="ml-auto text-xs">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
