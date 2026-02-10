"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { trpc } from "@/trpc/client";
import { agentsInsertSchema } from "@/db/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GeneratedAvatar } from "@/components/generated-avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type AgentGetOne = {
  id: string;
  name: string;
  instructions: string;
};

interface AgentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: AgentGetOne;
}

const agentFormSchema = agentsInsertSchema.extend({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  instructions: z
    .string()
    .min(1, "Instructions are required")
    .max(5000, "Instructions are too long"),
});

type AgentFormValues = z.infer<typeof agentFormSchema>;

export const AgentForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: AgentFormProps) => {
  const router = useRouter();
  const utils = trpc.useUtils();

  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      instructions: initialValues?.instructions ?? "",
    },
    mode: "onChange",
  });

  const isEdit = !!initialValues?.id;

  const createAgent = trpc.agents.create.useMutation({
    onSuccess: async () => {
      toast.success("Agent created successfully");
      form.reset();
      await utils.agents.getMany.invalidate();
      onSuccess?.() || router.push("/agents");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create agent");
      if (error.data?.code === "FORBIDDEN") router.push("/upgrade");
    },
  });

  const updateAgent = trpc.agents.update.useMutation({
    onSuccess: async () => {
      toast.success("Agent updated successfully");
      await utils.agents.getMany.invalidate();
      if (initialValues?.id) {
        await utils.agents.getOne.invalidate({ id: initialValues.id });
      }
      onSuccess?.() || router.push("/agents");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update agent");
    },
  });

  const isLoading = createAgent.isPending || updateAgent.isPending;

  const onSubmit = (values: AgentFormValues) => {
    if (isEdit && initialValues?.id) {
      updateAgent.mutate({ id: initialValues.id, ...values });
    } else {
      createAgent.mutate(values);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <GeneratedAvatar
          seed={form.watch("name") || "default"}
          variant="botttsNeutral"
          className="border size-16"
        />

        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter agent name"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="instructions"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="min-h-32"
                  placeholder="Enter instructions for the agent"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-x-2 pt-2">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" className="ml-auto" disabled={isLoading}>
            {isLoading
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
  );
};
