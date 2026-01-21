// "use client";

// import { trpc } from "@/trpc/client";

// export const HomeView = () => {
//   const { data, isLoading, error } = trpc.hello.useQuery({
//     text: "Antonio",
//   });

//   if (isLoading) {
//     return <div className="p-4">Loading...</div>;
//   }

//   if (error) {
//     return <div className="p-4 text-red-500">Something went wrong</div>;
//   }

//   return <div className="flex flex-col p-4 gap-y-4">{data?.greeting}</div>;
// };

"use client";

import { trpc } from "@/trpc/client"; // use the exported 'trpc' instance
import { useQuery } from "@tanstack/react-query";

export const HomeView = () => {
  // Use tRPC's query hook instead of 'useTRPC'
  const { data } = trpc.hello.useQuery({ text: "Antonio" });

  return (
    <div className="flex flex-col p-4 gap-y-4">
      {data?.greeting}{" "}
      {/* TypeScript should be happy if your router types are correct */}
    </div>
  );
};
