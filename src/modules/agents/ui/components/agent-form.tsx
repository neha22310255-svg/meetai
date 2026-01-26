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

// Create a stricter validation schema
const agentFormSchema = agentsInsertSchema.extend({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  instructions: z
    .string()
    .min(1, "Instructions are required")
    .max(5000, "Instructions are too long"),
});

export const AgentForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: AgentFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof agentFormSchema>>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      instructions: initialValues?.instructions ?? "",
    },
    mode: "onChange", // Validate on change for immediate feedback
  });

  const isEdit = !!initialValues?.id;

  const createAgent = trpc.agents.create.useMutation({
    onSuccess: () => {
      form.reset(); // Reset form after successful submission
      onSuccess?.();
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create agent");

      // Check if error code is "FORBIDDEN", redirect to /upgrade
      if (error.data?.code === "FORBIDDEN") {
        router.push("/upgrade");
      }
    },
  });

  const isPending = createAgent.isPending;

  const onSubmit = (values: z.infer<typeof agentFormSchema>) => {
    createAgent.mutate(values);
  };

  // Check if form is valid for button disable state
  const isFormValid = form.formState.isValid;
  const hasErrors = Object.keys(form.formState.errors).length > 0;

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <GeneratedAvatar
          seed={form.watch("name")}
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
                  placeholder="e.g. Data Science Tutor"
                  {...field}
                  aria-invalid={!!form.formState.errors.name}
                />
              </FormControl>
              <FormMessage className="text-red-500 text-sm mt-1" />
            </FormItem>
          )}
        />

        {/* Instructions Field */}
        <FormField
          name="instructions"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g. Provide clear, step-by-step guidance on Python and data science concepts"
                  {...field}
                  aria-invalid={!!form.formState.errors.instructions}
                  className="min-h-32"
                />
              </FormControl>
              <FormMessage className="text-red-500 text-sm mt-1" />
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
          <Button
            disabled={isPending || !isFormValid || hasErrors}
            type="submit"
            className="ml-auto"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {isEdit ? "Updating..." : "Creating..."}
              </span>
            ) : isEdit ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
