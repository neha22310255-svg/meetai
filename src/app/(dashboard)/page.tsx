import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { HomeView } from "@/modules/home/ui/views/home-view";

const Page = async () => {
  // Await headers() because it returns a Promise
  const nextHeaders = await headers();

  // Convert ReadonlyHeaders to a plain object
  const headersObj = Object.fromEntries(nextHeaders.entries());

  const session = await auth.api.getSession({
    headers: headersObj,
  });

  if (!session) {
    redirect("/sign-in");
  }

  return <HomeView />;
};

export default Page;
