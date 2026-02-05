// "use client";

// import Image from "next/image";
// import { useQueryState } from "nuqs";
// import { useDeferredValue } from "react";
// import { trpc } from "@/trpc/client";

// import { AgentsListHeader } from "@/modules/agents/ui/components/agents-search-filter";
// import { DataTable } from "@/modules/agents/ui/components/data-table";
// import { columns } from "@/modules/agents/ui/components/columns";

// import { EmptyState } from "@/components/empty-state";

// export default function AgentsPage() {
//   return (
//     <div className="flex flex-col h-full">
//       <AgentsListHeader />
//       <AgentsView />
//     </div>
//   );
// }

// const AgentsView = () => {
//   const [query] = useQueryState("query");
//   const deferredQuery = useDeferredValue(query);

//   const [data] = trpc.agents.getMany.useSuspenseQuery({
//     search: deferredQuery || undefined,
//     page: 1,
//     pageSize: 2,
//   });

//   const agentsData = data?.items ?? [];

//   if (agentsData.length === 0 && deferredQuery) {
//     return (
//       <div className="flex-1 flex flex-col items-center justify-center p-8">
//         <div className="relative w-40 h-40">
//           <Image
//             src="/empty.svg"
//             alt="No results"
//             fill
//             className="object-contain grayscale opacity-30"
//           />
//         </div>
//         <p className="text-zinc-500 text-sm mt-4">No results.</p>
//       </div>
//     );
//   }

//   if (agentsData.length === 0) {
//     return (
//       <div className="flex-1 px-4 md:px-8 flex items-center justify-center">
//         <EmptyState
//           title="Create your first agent"
//           description="Create an agent to join your meetings."
//         />
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 px-4 md:px-8 pb-4">
//       <DataTable data={agentsData} columns={columns} />
//     </div>
//   );
// };

import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import {
  AgentsView,
  AgentsViewLoading,
} from "@/modules/agents/ui/views/agents-view";
import { AgentsListHeader } from "@/modules/agents/ui/components/agents-list-header";
import { loadSearchParams } from "@/modules/agents/params";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const Page = async ({ searchParams }: Props) => {
  const filters = await loadSearchParams(searchParams);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8">
      <AgentsListHeader />

      <Suspense fallback={<AgentsViewLoading />}>
        <AgentsView />
      </Suspense>
    </div>
  );
};

export default Page;
