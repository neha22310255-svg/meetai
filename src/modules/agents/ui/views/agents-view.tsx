"use client";

import { trpc } from "@/trpc/client";

// Simple fallback components
const ErrorState = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="p-4 text-center border border-red-200 rounded-lg bg-red-50">
    <h2 className="text-xl font-semibold text-red-700 mb-2">{title}</h2>
    <p className="text-red-600">{description}</p>
  </div>
);

const LoadingState = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="p-4 text-center border border-blue-200 rounded-lg bg-blue-50">
    <h2 className="text-xl font-semibold text-blue-700 mb-2">{title}</h2>
    <p className="text-blue-600 mb-3">{description}</p>
    <div className="flex justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
    </div>
  </div>
);

export const AgentsView = () => {
  const { data, isLoading, isError, error } = trpc.agents.getMany.useQuery();

  if (isLoading) {
    return (
      <LoadingState
        title="Loading Agents"
        description="This may take a few seconds"
      />
    );
  }

  if (isError) {
    console.error("Error loading agents:", error);
    return (
      <ErrorState
        title="Error Loading Agents"
        description={error.message || "Something went wrong"}
      />
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Agents</h1>
      <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export const AgentsViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agents"
      description="This may take a few seconds"
    />
  );
};

export const AgentsViewError = () => {
  return (
    <ErrorState
      title="Error Loading Agents"
      description="Something went wrong"
    />
  );
};
