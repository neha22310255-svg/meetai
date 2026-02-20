"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { trpc } from "@/trpc/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GeneratedAvatar } from "@/components/generated-avatar";
import {
  Form,
  FormControl,
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
import { MeetingGetOne } from "../../types";

const meetingFormSchema = z.object({
  name: z.string().min(1).max(100),
  agentId: z.string().min(1),
});

type MeetingFormValues = z.infer<typeof meetingFormSchema>;

interface MeetingFormProps {
  onSuccess?: (meetingId?: string) => void;
  onCancel?: () => void;
  initialValues?: MeetingGetOne;
}

export const MeetingForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: MeetingFormProps) => {
  const utils = trpc.useUtils();
  const isEditing = !!initialValues;

  const form = useForm<MeetingFormValues>({
    resolver: zodResolver(meetingFormSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      agentId: initialValues?.agentId ?? "",
    },
  });

  // ✅ Cached agents for 5 minutes (prevents slow refetch)
  const { data: agentsData } = trpc.agents.getMany.useQuery(
    { page: 1, pageSize: 100 },
    { staleTime: 1000 * 60 * 5 },
  );

  const agents = agentsData?.items ?? [];

  const createMeeting = trpc.meetings.create.useMutation({
    onSuccess: (data) => {
      utils.meetings.getMany.invalidate();
      toast.success("Meeting created");
      onSuccess?.(data?.id);
    },
  });

  const updateMeeting = trpc.meetings.update.useMutation({
    onSuccess: () => {
      utils.meetings.getMany.invalidate();
      if (initialValues) {
        utils.meetings.getOne.invalidate({ id: initialValues.id });
      }
      toast.success("Meeting updated");
      onSuccess?.(initialValues?.id);
    },
  });

  const onSubmit = (values: MeetingFormValues) => {
    if (isEditing && initialValues) {
      updateMeeting.mutate({ id: initialValues.id, ...values });
    } else {
      createMeeting.mutate(values);
    }
  };

  const isLoading = createMeeting.isPending || updateMeeting.isPending;

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
                <Input {...field} disabled={isLoading} />
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
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      <div className="flex items-center gap-2">
                        <GeneratedAvatar
                          seed={agent.name}
                          variant="botttsNeutral"
                          className="w-6 h-6"
                        />
                        {agent.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Saving..."
              : isEditing
                ? "Update Meeting"
                : "Create Meeting"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
