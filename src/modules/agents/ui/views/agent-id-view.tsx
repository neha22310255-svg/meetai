"use client";

import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { AgentIdViewHeader } from "../components/agent-id-view-header";
import { UpdateAgentDialog } from "../components/update-agent-dialog";
import { trpc } from "@/trpc/client";
import { useConfirm } from "@/hooks/use-confirm";

interface Props {
  agentId: string;
}

export const AgentIdView = ({ agentId }: Props) => {
  const router = useRouter();
  const utils = trpc.useUtils();
  const [updateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false);

  const { data: agent } = trpc.agents.getOne.useQuery({ id: agentId });

  const removeAgent = trpc.agents.remove.useMutation({
    onSuccess: async () => {
      await utils.agents.getMany.invalidate();
      router.push("/agents");
      toast.success("Agent removed successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove agent");
    },
  });

  const [RemoveConfirmation, confirmRemove] = useConfirm(
    "Are you sure?",
    `The following action will remove ${agent?.meetingCount ?? 0} associated meetings`,
  );

  const handleRemoveAgent = async () => {
    const ok = await confirmRemove();
    if (!ok) return;

    await removeAgent.mutateAsync({ id: agentId });
  };

  if (!agent)
    return (
      <LoadingState
        title="Loading Agent"
        description="Loading agent details..."
      />
    );

  return (
    <>
      <RemoveConfirmation />
      <UpdateAgentDialog
        open={updateAgentDialogOpen}
        onOpenChange={setUpdateAgentDialogOpen}
        initialValues={agent}
      />
      <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <AgentIdViewHeader
          agentId={agentId}
          agentName={agent.name}
          onEdit={() => setUpdateAgentDialogOpen(true)}
          onRemove={handleRemoveAgent}
        />

        <div className="bg-white rounded-lg border mt-4">
          <div className="px-4 py-5 flex flex-col gap-y-5">
            <div className="flex items-center gap-x-3">
              <GeneratedAvatar
                variant="botttsNeutral"
                seed={agent.name}
                className="size-10"
              />
              <h2 className="text-2xl font-medium">{agent.name}</h2>
            </div>

            <Badge
              variant="outline"
              className="flex items-center gap-x-2 [&>svg]:size-4"
            >
              <VideoIcon className="text-blue-700" />
              {agent.meetingCount}{" "}
              {agent.meetingCount === 1 ? "meeting" : "meetings"}
            </Badge>

            <div className="flex flex-col gap-y-4">
              <p className="text-lg font-medium">Instructions</p>
              <p className="text-neutral-800 whitespace-pre-wrap">
                {agent.instructions}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const AgentIdViewLoading = () => (
  <LoadingState
    title="Loading Agent"
    description="This may take a few seconds"
  />
);

export const AgentIdViewError = () => (
  <ErrorState title="Error Loading Agent" description="Something went wrong" />
);
