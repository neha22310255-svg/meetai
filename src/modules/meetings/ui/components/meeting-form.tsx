"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { trpc } from "@/trpc/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const meetingFormSchema = z.object({
  name: z
    .string()
    .min(1, "Meeting name is required")
    .max(100, "Name is too long"),
  agentId: z.string().min(1, "Please select an agent"),
  // Remove scheduledFor and description from schema
});

type MeetingFormValues = z.infer<typeof meetingFormSchema>;

interface MeetingFormProps {
  onSuccess?: (meetingId?: string) => void;
  onCancel?: () => void;
}

export const MeetingForm = ({ onSuccess, onCancel }: MeetingFormProps) => {
  const utils = trpc.useUtils();

  const form = useForm<MeetingFormValues>({
    resolver: zodResolver(meetingFormSchema),
    defaultValues: {
      name: "",
      agentId: "",
    },
  });

  // Fetch available agents
  const { data: agentsData } = trpc.agents.getMany.useQuery({
    page: 1,
    pageSize: 100,
  });

  const agents = agentsData?.items || [];

  // Create meeting mutation
  const createMeeting = trpc.meetings.create.useMutation({
    onSuccess: async (data) => {
      toast.success("Meeting created successfully");
      form.reset();

      // Invalidate meetings list
      await utils.meetings.getMany.invalidate();

      if (onSuccess) {
        onSuccess(data?.id);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create meeting");
    },
  });

  const onSubmit = (values: MeetingFormValues) => {
    createMeeting.mutate({
      name: values.name,
      agentId: values.agentId,
      // Remove scheduledFor and description
    });
  };

  const isLoading = createMeeting.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meeting Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter meeting name"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="agentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agent</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an agent" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {agents.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      No agents available. Create one first.
                    </div>
                  ) : (
                    agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose which AI agent will join this meeting
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Remove scheduledFor and description fields */}

        <div className="flex justify-between gap-2 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isLoading || agents.length === 0}
            className="ml-auto"
          >
            {isLoading ? "Creating..." : "Create Meeting"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
