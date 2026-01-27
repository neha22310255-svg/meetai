import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { HomeView } from "@/modules/home/ui/views/home-view";

const Page = async () => {
  // Get request headers
  const nextHeaders = await headers();

  // Convert headers to plain object
  const headersObj = Object.fromEntries(nextHeaders.entries());

  // Get session
  const session = await auth.api.getSession({
    headers: headersObj,
  });

  // Redirect if not authenticated
  if (!session) {
    redirect("/sign-in");
  }

  // Render page view
  return <HomeView />;
};

export default Page;
