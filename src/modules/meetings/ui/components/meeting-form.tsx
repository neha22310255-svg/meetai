"use client";

import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { trpc } from "@/trpc/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MeetingGetOne {
  id: string;
  name: string;
  agentId: string;
  status: string;
}

interface MeetingFormProps {
  onSuccess?: (id?: string) => void;
  onCancel?: () => void;
  initialValues?: MeetingGetOne;
}

const meetingsInsertSchema = z.object({
  name: z.string().min(1, "Name is required"),
  agentId: z.string().min(1, "Please select an agent"),
});

export const MeetingForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: MeetingFormProps) => {
  const router = useRouter();
  const utils = trpc.useUtils();

  const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);
  const [agentSearch, setAgentSearch] = useState("");

  const form = useForm<z.infer<typeof meetingsInsertSchema>>({
    resolver: zodResolver(meetingsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      agentId: initialValues?.agentId ?? "",
    },
  });

  const isEdit = !!initialValues?.id;

  const { data: agentsData, isLoading: agentsLoading } =
    trpc.agents.getMany.useQuery({
      page: 1,
      pageSize: 100,
      search: agentSearch || undefined,
    });

  const createMeeting = trpc.meetings.create.useMutation({
    onSuccess: async (data) => {
      await utils.meetings.getMany.invalidate();
      toast.success("Meeting created successfully");
      if (!isEdit) {
        form.reset();
      }
      onSuccess?.(data.id);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create meeting");
      if (error.data?.code === "FORBIDDEN") {
        router.push("/upgrade");
      }
    },
  });

  const updateMeeting = trpc.meetings.update.useMutation({
    onSuccess: async (data) => {
      toast.success("Meeting updated successfully");
      await utils.meetings.getMany.invalidate();
      if (initialValues?.id) {
        await utils.meetings.getOne.invalidate({ id: initialValues.id });
      }
      onSuccess?.(data.id);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update meeting");
      if (error.data?.code === "FORBIDDEN") {
        router.push("/upgrade");
      }
    },
  });

  const isPending =
    createMeeting.isPending || updateMeeting.isPending || agentsLoading;

  const onSubmit = (values: z.infer<typeof meetingsInsertSchema>) => {
    if (isEdit && initialValues?.id) {
      updateMeeting.mutate({ ...values, id: initialValues.id });
    } else {
      createMeeting.mutate(values);
    }
  };

  const getAgentEmoji = (name: string) => {
    const agentName = name.toLowerCase();
    if (agentName.includes("math") || agentName.includes("tutor")) return "📚";
    if (agentName.includes("code") || agentName.includes("program"))
      return "💻";
    if (agentName.includes("sales") || agentName.includes("business"))
      return "💰";
    if (agentName.includes("support") || agentName.includes("help"))
      return "🛟";
    if (agentName.includes("creative") || agentName.includes("design"))
      return "🎨";
    return "🤖";
  };

  return (
    <>
      <NewAgentDialog
        open={openNewAgentDialog}
        onOpenChange={setOpenNewAgentDialog}
      />

      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-center">
            <GeneratedAvatar
              seed={form.watch("name") || "meeting"}
              variant="botttsNeutral"
              className="border size-16"
            />
          </div>

          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g. Math consultations"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="agentId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an agent" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {agentsData?.items?.map((agent) => {
                      const emoji = getAgentEmoji(agent.name);
                      return (
                        <SelectItem key={agent.id} value={agent.id}>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{emoji}</span>
                            <span>{agent.name}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Not found what you&apos;re looking for?{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => setOpenNewAgentDialog(true)}
                  >
                    Create new agent
                  </button>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between gap-x-2 pt-2">
            {onCancel && (
              <Button
                variant="ghost"
                disabled={isPending}
                type="button"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
            <Button disabled={isPending} type="submit" className="ml-auto">
              {isPending
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                  ? "Update"
                  : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
