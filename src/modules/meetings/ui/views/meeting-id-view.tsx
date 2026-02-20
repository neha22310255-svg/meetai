// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { trpc } from "@/trpc/client";
// import { useConfirm } from "@/hooks/use-confirm";
// import { MeetingIdViewHeader } from "../components/meeting-id-view-header";
// import { UpdateMeetingDialog } from "../components/update-meeting-dialog";
// import { toast } from "sonner";

// interface Props {
//   meetingId: string;
// }

// export const MeetingIdView = ({ meetingId }: Props) => {
//   const router = useRouter();
//   const utils = trpc.useUtils();

//   const [updateOpen, setUpdateOpen] = useState(false);

//   const [RemoveConfirmation, confirmRemove] = useConfirm(
//     "Are you sure?",
//     "This will permanently delete this meeting.",
//   );

//   const { data } = trpc.meetings.getOne.useQuery(
//     { id: meetingId },
//     { suspense: true },
//   );

//   if (!data) return null;

//   const removeMeeting = trpc.meetings.remove.useMutation({
//     onSuccess: () => {
//       utils.meetings.getMany.invalidate();
//       toast.success("Meeting deleted");
//       router.push("/meetings");
//     },
//   });

//   const handleRemove = async () => {
//     const ok = await confirmRemove();
//     if (!ok) return;
//     removeMeeting.mutate({ id: meetingId });
//   };

//   return (
//     <>
//       <RemoveConfirmation />

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

//         <div className="rounded-lg border bg-card p-6">
//           <pre className="text-xs bg-muted p-4 rounded overflow-auto">
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

import { MeetingIdViewHeader } from "../components/meeting-id-view-header";
import { UpdateMeetingDialog } from "../components/update-meeting-dialog";

interface Props {
  meetingId: string;
}

export const MeetingIdView = ({ meetingId }: Props) => {
  const router = useRouter();
  const utils = trpc.useUtils();
  const [updateOpen, setUpdateOpen] = useState(false);

  // Confirmation modal for deletion
  const [RemoveConfirmation, confirmRemove] = useConfirm(
    "Delete Meeting",
    "Are you sure? This will permanently delete this meeting and all associated data.",
  );

  // Fetch meeting data
  const { data, isLoading } = trpc.meetings.getOne.useQuery(
    { id: meetingId },
    { staleTime: 5000 }, // Keep data fresh
  );

  // Remove mutation
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
    if (ok) {
      removeMeeting.mutate({ id: meetingId });
    }
  };

  if (isLoading) return <div className="p-8 text-zinc-500">Loading...</div>;
  if (!data) return <div className="p-8 text-zinc-500">Meeting not found.</div>;

  return (
    <>
      <RemoveConfirmation />

      {/* The Dialog for editing */}
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

        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="text-lg font-semibold mb-4">Meeting Details</h2>
          <pre className="text-xs bg-black/40 p-4 rounded border border-zinc-800 text-zinc-300 overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </>
  );
};
