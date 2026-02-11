import { ResponsiveDialog } from "@/components/responsive-dialog";
// Remove the AgentForm import

interface NewAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewAgentDialog = ({ open, onOpenChange }: NewAgentDialogProps) => {
  return (
    <ResponsiveDialog
      title="New Agent"
      description="Create a new agent"
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="p-4">
        <p>Agent form will be implemented here</p>
        {/* TODO: Implement agent form */}
      </div>
    </ResponsiveDialog>
  );
};
