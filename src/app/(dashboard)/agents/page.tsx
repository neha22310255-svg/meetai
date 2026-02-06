import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import {
  AgentsView,
  AgentsViewLoading,
} from "@/modules/agents/ui/views/agents-view";
import { AgentsListHeader } from "@/modules/agents/ui/components/agents-list-header";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const Page = async ({ searchParams }: Props) => {
  // Await searchParams to get the actual values
  const params = await searchParams;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-col h-full">
      <AgentsListHeader />

      <Suspense fallback={<AgentsViewLoading />}>
        <AgentsView />
      </Suspense>
    </div>
  );
};

export default Page;
