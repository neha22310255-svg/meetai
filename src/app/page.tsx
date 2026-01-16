import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { HomeView } from "@/modules/home/ui/views/home-view";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Not logged in → go to sign-in
  if (!session) {
    redirect("/sign-in");
  }

  // Logged in → show home
  return <HomeView session={session} />;
};

export default Page;
