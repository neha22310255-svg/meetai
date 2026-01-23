"use client";

import { trpc } from "@/trpc/client";

// Minimal replacements for LoadingState and ErrorState
const LoadingState = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{title}</h2>
    <p>{description}</p>
  </div>
);

const ErrorState = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
    <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{title}</h2>
    <p>{description}</p>
  </div>
);

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

export const AgentsView = () => {
  const [data] = trpc.agents.getMany.useSuspenseQuery();

  return <div>{JSON.stringify(data, null, 2)}</div>;
};
