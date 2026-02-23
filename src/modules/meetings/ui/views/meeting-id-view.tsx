// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";

// import { trpc } from "@/trpc/client";
// import { useConfirm } from "@/hooks/use-confirm";

// import { MeetingIdViewHeader } from "../components/meeting-id-view-header";
// import { UpdateMeetingDialog } from "../components/update-meeting-dialog";

// interface Props {
//   meetingId: string;
// }

// export const MeetingIdView = ({ meetingId }: Props) => {
//   const router = useRouter();
//   const utils = trpc.useUtils();
//   const [updateOpen, setUpdateOpen] = useState(false);

//   // Confirmation modal for deletion
//   const [RemoveConfirmation, confirmRemove] = useConfirm(
//     "Delete Meeting",
//     "Are you sure? This will permanently delete this meeting and all associated data.",
//   );

//   // Fetch meeting data
//   const { data, isLoading } = trpc.meetings.getOne.useQuery(
//     { id: meetingId },
//     { staleTime: 5000 }, // Keep data fresh
//   );

//   // Remove mutation
//   const removeMeeting = trpc.meetings.remove.useMutation({
//     onSuccess: () => {
//       toast.success("Meeting deleted");
//       utils.meetings.getMany.invalidate();
//       router.push("/meetings");
//     },
//     onError: (error) => {
//       toast.error(error.message || "Failed to delete meeting");
//     },
//   });

//   const handleRemove = async () => {
//     const ok = await confirmRemove();
//     if (!ok) return;
//     await removeMeeting.mutateAsync({ id: meetingId });
//   };

//   if (isLoading) return <div className="p-8 text-zinc-500">Loading...</div>;
//   if (!data) return <div className="p-8 text-zinc-500">Meeting not found.</div>;

//   return (
//     <>
//       <RemoveConfirmation />

//       {/* The Dialog for editing */}
//       <UpdateMeetingDialog
//         open={updateOpen}
//         onOpenChange={setUpdateOpen}
//         initialValues={data}
//       />

//       <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
//         <MeetingIdViewHeader
//           meetingId={meetingId}
//           meetingName={data.name}
//           onEdit={() => setUpdateOpen(true)}
//           onRemove={handleRemove}
//         />

//         <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
//           <h2 className="text-lg font-semibold mb-4">Meeting Details</h2>
//           <pre className="text-xs bg-black/40 p-4 rounded border border-zinc-800 text-zinc-300 overflow-auto">
//             {JSON.stringify(data, null, 2)}
//           </pre>
//         </div>
//       </div>
//     </>
//   );
// };

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { trpc } from "@/trpc/client";
import { useConfirm } from "@/hooks/use-confirm";

import { ActiveState } from "../components/active-state";
import { UpcomingState } from "../components/upcoming-state";
import { CancelledState } from "../components/cancelled-state";
import { ProcessingState } from "../components/processing-state";
import { UpdateMeetingDialog } from "../components/update-meeting-dialog";
import { MeetingIdViewHeader } from "../components/meeting-id-view-header";

interface Props {
  meetingId: string;
}

export const MeetingIdView = ({ meetingId }: Props) => {
  const router = useRouter();
  const utils = trpc.useUtils();
  const [updateOpen, setUpdateOpen] = useState(false);

  const [RemoveConfirmation, confirmRemove] = useConfirm(
    "Delete Meeting",
    "Are you sure? This will permanently delete this meeting and all associated data.",
  );

  const { data, isLoading } = trpc.meetings.getOne.useQuery(
    { id: meetingId },
    { staleTime: 5000 },
  );

  const removeMeeting = trpc.meetings.remove.useMutation({
    onSuccess: () => {
      toast.success("Meeting deleted");
      utils.meetings.getMany.invalidate();
      router.push("/meetings");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete meeting");
    },
  });

  const handleRemove = async () => {
    const ok = await confirmRemove();
    if (!ok) return;
    removeMeeting.mutate({ id: meetingId });
  };

  if (isLoading || !data) {
    return <div className="p-6">Loading...</div>;
  }

  const isActive = data.status === "active";
  const isUpcoming = data.status === "upcoming";
  const isCancelled = data.status === "cancelled";
  const isCompleted = data.status === "completed";
  const isProcessing = data.status === "processing";

  return (
    <>
      <RemoveConfirmation />
      <UpdateMeetingDialog
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        initialValues={data}
      />
      <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <MeetingIdViewHeader
          meetingId={meetingId}
          meetingName={data.name}
          onEdit={() => setUpdateOpen(true)}
          onRemove={handleRemove}
        />
        {isCancelled && <CancelledState />}
        {isProcessing && <ProcessingState />}
        {isCompleted && <div>Completed</div>}
        {isActive && <ActiveState meetingId={meetingId} />}
        {isUpcoming && <UpcomingState meetingId={meetingId} />}
      </div>
    </>
  );
};
